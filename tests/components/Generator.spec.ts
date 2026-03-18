import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Generator from '../../src/components/features/Generator.vue';
import DocumentGenerator from '../../src/components/features/DocumentGenerator.vue';

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
});

describe('Generator.vue', () => {
  it('should render DocumentGenerator components for CPF and CNPJ', () => {
    const wrapper = mount(Generator);
    const docs = wrapper.findAllComponents(DocumentGenerator);
    expect(docs.length).toBeGreaterThanOrEqual(3); // CPF, CNPJ, NFe

    expect(docs[0].props('title')).toBe('CPF');
    expect(docs[1].props('title')).toBe('CNPJ');
    expect(docs[2].props('title')).toContain('Homologação');
  });

  it('should change emitter type when clicking CPF button', async () => {
    const wrapper = mount(Generator);

    const cpfButton = wrapper.findAll('button').find(b => b.text() === 'CPF');
    expect(cpfButton).toBeDefined();

    await cpfButton?.trigger('click');
    expect(cpfButton?.classes()).toContain('active');

    // Ensure NFe Homologation gets reset
    const docs = wrapper.findAllComponents(DocumentGenerator);
    expect(docs[2].props('document')).toBe('');
  });

  it('should change model selection', async () => {
    const wrapper = mount(Generator);
    const select = wrapper.find('select#model');
    await select.setValue('65'); // NFCe

    const docs = wrapper.findAllComponents(DocumentGenerator);
    expect(docs[2].props('title')).toContain('NFCe');
  });
});
