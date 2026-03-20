import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { usePinnedTools } from '../../src/composables/usePinnedTools';

describe('usePinnedTools', () => {
  let localStorageStore: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    localStorageStore = {};
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        getItem(key: string) {
          return localStorageStore[key] || null;
        },
        setItem(key: string, value: string) {
          localStorageStore[key] = value.toString();
        },
        clear() {
          localStorageStore = {};
        },
        removeItem(key: string) {
          delete localStorageStore[key];
        }
      }
    });
  });

  function mountWithComposable() {
    const TestComponent = {
      setup() {
        const { pinnedIds, togglePin, isPinned, sortByPinned } = usePinnedTools();
        return { pinnedIds, togglePin, isPinned, sortByPinned };
      },
      template: '<div></div>'
    };

    return mount(TestComponent);
  }

  it('should initialize with an empty array of pinned tools', () => {
    const wrapper = mountWithComposable();
    expect(wrapper.vm.pinnedIds).toEqual([]);
  });

  it('should pin a tool when togglePin is called', async () => {
    const wrapper = mountWithComposable();

    wrapper.vm.togglePin('cpf');
    await nextTick();

    expect(wrapper.vm.pinnedIds).toContain('cpf');
    expect(wrapper.vm.isPinned('cpf')).toBe(true);
  });

  it('should unpin a tool when togglePin is called on a pinned tool', async () => {
    const wrapper = mountWithComposable();

    wrapper.vm.togglePin('cpf');
    await nextTick();
    expect(wrapper.vm.isPinned('cpf')).toBe(true);

    wrapper.vm.togglePin('cpf');
    await nextTick();
    expect(wrapper.vm.isPinned('cpf')).toBe(false);
    expect(wrapper.vm.pinnedIds).not.toContain('cpf');
  });

  it('should return false for isPinned when tool is not pinned', () => {
    const wrapper = mountWithComposable();
    expect(wrapper.vm.isPinned('cnpj')).toBe(false);
  });

  it('should pin multiple tools', async () => {
    const wrapper = mountWithComposable();

    wrapper.vm.togglePin('cpf');
    wrapper.vm.togglePin('cnpj');
    await nextTick();

    expect(wrapper.vm.isPinned('cpf')).toBe(true);
    expect(wrapper.vm.isPinned('cnpj')).toBe(true);
    expect(wrapper.vm.pinnedIds).toHaveLength(2);
  });

  it('should sort items with pinned tools first', async () => {
    const wrapper = mountWithComposable();

    const tools = [
      { id: 'cpf', label: 'CPF' },
      { id: 'cnpj', label: 'CNPJ' },
      { id: 'nfe', label: 'NFe' },
    ];

    wrapper.vm.togglePin('nfe');
    await nextTick();

    const sorted = wrapper.vm.sortByPinned(tools);

    expect(sorted[0].id).toBe('nfe');
    expect(sorted[1].id).toBe('cpf');
    expect(sorted[2].id).toBe('cnpj');
  });

  it('should maintain original order for non-pinned tools', async () => {
    const wrapper = mountWithComposable();

    const tools = [
      { id: 'cpf', label: 'CPF' },
      { id: 'cnpj', label: 'CNPJ' },
      { id: 'nfe', label: 'NFe' },
    ];

    const sorted = wrapper.vm.sortByPinned(tools);

    expect(sorted[0].id).toBe('cpf');
    expect(sorted[1].id).toBe('cnpj');
    expect(sorted[2].id).toBe('nfe');
  });

  it('should persist pinned tools to localStorage', async () => {
    const wrapper = mountWithComposable();

    wrapper.vm.togglePin('cpf');
    await nextTick();

    const stored = localStorageStore['pinned-tools'];
    expect(stored).toBeDefined();
    expect(JSON.parse(stored)).toContain('cpf');
  });

  it('should load pinned tools from localStorage on mount', async () => {
    localStorageStore['pinned-tools'] = JSON.stringify(['cnpj', 'nfe']);

    const wrapper = mountWithComposable();
    await nextTick();

    expect(wrapper.vm.isPinned('cnpj')).toBe(true);
    expect(wrapper.vm.isPinned('nfe')).toBe(true);
    expect(wrapper.vm.isPinned('cpf')).toBe(false);
  });
});
