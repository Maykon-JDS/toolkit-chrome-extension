import { ref, watch, onMounted } from 'vue';

export function usePinnedTools() {
  const STORAGE_KEY = 'pinned-tools';
  const pinnedIds = ref<string[]>([]);

  onMounted(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        pinnedIds.value = JSON.parse(stored);
      } catch {
        pinnedIds.value = [];
      }
    }
  });

  watch(pinnedIds, (newValue) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
  }, { deep: true });

  function togglePin(id: string) {
    const index = pinnedIds.value.indexOf(id);
    if (index === -1) {
      pinnedIds.value.push(id);
    } else {
      pinnedIds.value.splice(index, 1);
    }
  }

  function isPinned(id: string): boolean {
    return pinnedIds.value.includes(id);
  }

  function sortByPinned<T extends { id: string }>(items: T[]): T[] {
    const pinned = items.filter(item => isPinned(item.id));
    const unpinned = items.filter(item => !isPinned(item.id));
    return [...pinned, ...unpinned];
  }

  return {
    pinnedIds,
    togglePin,
    isPinned,
    sortByPinned,
  };
}
