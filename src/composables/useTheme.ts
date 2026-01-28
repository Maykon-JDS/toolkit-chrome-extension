import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const theme = ref(localStorage.getItem('theme') || 'system');

  const applyTheme = (newTheme: string) => {
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    localStorage.setItem('theme', newTheme);
    theme.value = newTheme;
  };

  onMounted(() => {
    applyTheme(theme.value);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    });
  });

  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
  };
}
