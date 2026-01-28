<template>
  <div class="theme-toggle">
    <button
      v-for="t in themes"
      :key="t.name"
      @click="theme = t.name"
      :class="{ active: theme === t.name }"
      :aria-label="`Switch to ${t.name} theme`"
    >
      <component :is="t.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '../../composables/useTheme';
import SunIcon from '../icons/SunIcon.vue';
import MoonIcon from '../icons/MoonIcon.vue';
import SystemIcon from '../icons/SystemIcon.vue';

const { theme } = useTheme();

const themes = [
  { name: 'light', icon: SunIcon },
  { name: 'dark', icon: MoonIcon },
  { name: 'system', icon: SystemIcon },
];
</script>

<style scoped>
.theme-toggle {
  display: flex;
  background-color: var(--tab-bg);
  border-radius: 9999px;
  padding: 0.25rem;
  border: 1px solid var(--border);
}

button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  color: var(--icon-color);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
}

button:hover {
  background-color: var(--icon-hover-bg);
}

button.active {
  background-color: var(--primary);
  color: white;
}

button svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
