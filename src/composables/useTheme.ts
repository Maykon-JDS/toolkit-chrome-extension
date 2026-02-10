import { ref, onMounted, watch } from 'vue';

export function useTheme() {
  const theme = ref<string>('system');
  const isLoaded = ref(false);

  const applyTheme = (newTheme: string) => {
    if (newTheme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    theme.value = newTheme;
  };

  const saveTheme = (newTheme: string) => {
    // Usar chrome.storage se disponível, caso contrário usar localStorage
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ theme: newTheme });
    }
    localStorage.setItem('theme', newTheme);
  };

  const loadTheme = async () => {
    let savedTheme = 'system';
    
    // Tentar carregar do chrome.storage primeiro
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await new Promise((resolve) => {
        chrome.storage.local.get('theme', (items) => {
          resolve(items.theme || localStorage.getItem('theme') || 'system');
        });
      });
      savedTheme = result as string;
    } else {
      // Fallback para localStorage
      savedTheme = localStorage.getItem('theme') || 'system';
    }
    
    theme.value = savedTheme;
    applyTheme(savedTheme);
    isLoaded.value = true;
  };

  onMounted(() => {
    loadTheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (theme.value === 'system') {
        applyTheme('system');
      }
    });
  });

  watch(theme, (newTheme) => {
    if (isLoaded.value) {
      saveTheme(newTheme);
      applyTheme(newTheme);
    }
  });

  return {
    theme,
    isLoaded,
  };
}
