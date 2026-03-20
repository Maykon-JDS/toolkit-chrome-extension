import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Generator from '../../src/components/features/Generator.vue';
import DocumentGenerator from '../../src/components/features/DocumentGenerator.vue';
import PinIcon from '../../src/components/icons/PinIcon.vue';
import { nextTick } from 'vue';

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

describe('Generator.vue', () => {
  let localStorageStore: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageStore = {};
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        getItem: vi.fn((key: string) => localStorageStore[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageStore[key] = value.toString();
        }),
        clear: vi.fn(() => {
          localStorageStore = {};
        }),
      }
    });
  });

  it('should render DocumentGenerator components for CPF and CNPJ', () => {
    const wrapper = mount(Generator);
    const docs = wrapper.findAllComponents(DocumentGenerator);
    expect(docs.length).toBeGreaterThanOrEqual(2); // CPF, CNPJ

    expect(docs[0].props('title')).toBe('CPF');
    expect(docs[1].props('title')).toBe('CNPJ');
  });

  it('should change emitter type when clicking CPF button', async () => {
    const wrapper = mount(Generator);

    const cpfButton = wrapper.findAll('.segmented-control button').find(b => b.text() === 'CPF');
    expect(cpfButton).toBeDefined();

    await cpfButton?.trigger('click');
    expect(cpfButton?.classes()).toContain('active');

    // Ensure NFe Homologation gets reset
    const docs = wrapper.findAllComponents(DocumentGenerator);
    const nfeDoc = docs.find(d => d.props('title').includes('Homologação'));
    expect(nfeDoc?.props('document')).toBe('');
  });

  it('should change model selection', async () => {
    const wrapper = mount(Generator);
    const select = wrapper.find('select#model');
    await select.setValue('65'); // NFCe

    const docs = wrapper.findAllComponents(DocumentGenerator);
    const nfeDoc = docs.find(d => d.props('title').includes('NFCe'));
    expect(nfeDoc?.exists()).toBe(true);
  });

  // Novos Testes de Integração de Pin/Unpin
  describe('Pin/Unpin Integration', () => {
    it('should render PinIcon in all generator tools', () => {
      const wrapper = mount(Generator);
      const pinIcons = wrapper.findAllComponents(PinIcon);
      expect(pinIcons.length).toBe(3); // CPF, CNPJ, NFe
    });

    it('should dynamically reorder tools when pinned', async () => {
      const wrapper = mount(Generator);
      
      // Initially: CPF (0), CNPJ (1), NFe (2)
      let docs = wrapper.findAllComponents(DocumentGenerator);
      expect(docs[0].props('title')).toBe('CPF');
      expect(docs[1].props('title')).toBe('CNPJ');

      // Emula click no botão de pin do CNPJ (index 1)
      await docs[1].vm.$emit('toggle-pin');
      await nextTick();

      // Now it should be: CNPJ (0), CPF (1), NFe (2)
      docs = wrapper.findAllComponents(DocumentGenerator);
      expect(docs[0].props('title')).toBe('CNPJ');
      expect(docs[1].props('title')).toBe('CPF');
      expect(docs[0].props('pinned')).toBe(true);
      expect(docs[1].props('pinned')).toBe(false);
    });

    it('should show divider when there are pinned and unpinned tools', async () => {
      const wrapper = mount(Generator);
      
      // Before pin, no divider
      expect(wrapper.find('.pinned-divider').exists()).toBe(false);

      // Pin CPF
      const docs = wrapper.findAllComponents(DocumentGenerator);
      await docs[0].vm.$emit('toggle-pin');
      await nextTick();

      // Divider should exist
      const divider = wrapper.find('.pinned-divider');
      expect(divider.exists()).toBe(true);
      expect(divider.text()).toBe('Outras ferramentas');
    });

    it('should unpin tool and return it to original position', async () => {
      const wrapper = mount(Generator);
      
      // Pin CNPJ
      let docs = wrapper.findAllComponents(DocumentGenerator);
      await docs[1].vm.$emit('toggle-pin');
      await nextTick();

      // Verify CNPJ is top
      docs = wrapper.findAllComponents(DocumentGenerator);
      expect(docs[0].props('title')).toBe('CNPJ');

      // Unpin CNPJ
      await docs[0].vm.$emit('toggle-pin');
      await nextTick();

      // Verify back to original
      docs = wrapper.findAllComponents(DocumentGenerator);
      expect(docs[0].props('title')).toBe('CPF');
      expect(docs[1].props('title')).toBe('CNPJ');
      expect(wrapper.find('.pinned-divider').exists()).toBe(false);
    });

    it('should save pinned state to localStorage integrated via composable', async () => {
      const wrapper = mount(Generator);
      
      const docs = wrapper.findAllComponents(DocumentGenerator);
      await docs[0].vm.$emit('toggle-pin'); // Pin CPF
      await nextTick();

      expect(window.localStorage.setItem).toHaveBeenCalledWith('pinned-tools', JSON.stringify(['cpf']));
    });

    it('should load pinned tools from localStorage on start', async () => {
      // Simulate existing localStorage data BEFORE mount
      localStorageStore['pinned-tools'] = JSON.stringify(['nfe']);

      const wrapper = mount(Generator);
      await nextTick();

      // Because NFe is pinned, it should be the first DocumentGenerator rendered
      // However NFe has a outer wrapper in the template, let's just check if it has the is-pinned class
      const nfeWrapper = wrapper.find('.group-wrapper');
      expect(nfeWrapper.classes()).toContain('is-pinned');
    });
  });
});
