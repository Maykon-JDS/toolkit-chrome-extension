import { ref, watch, onMounted } from 'vue';

export function useStorage<T>(key: string, initialValue: T) {
  const data = ref<T>(initialValue);

  onMounted(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      data.value = JSON.parse(storedValue);
    }
  });

  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });

  return data;
}
