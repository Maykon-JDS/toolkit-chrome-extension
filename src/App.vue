<template>
  <div id="app-container">
    <header class="app-header">
      <div class="tabs">
        <button @click="activeTab = 'generator'" :class="{ active: activeTab === 'generator' }">
          <IDIcon />
          <span>Gerador</span>
        </button>
        <button @click="activeTab = 'notepad'" :class="{ active: activeTab === 'notepad' }">
          <NoteIcon />
          <span>Notas</span>
        </button>
      </div>
      <ThemeToggle />
    </header>

    <main class="app-main">
      <Generator v-if="activeTab === 'generator'" />
      <Notepad v-if="activeTab === 'notepad'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from './composables/useStorage';
import Generator from './components/features/Generator.vue';
import Notepad from './components/features/Notepad.vue';
import ThemeToggle from './components/features/ThemeToggle.vue';
import IDIcon from './components/icons/IDIcon.vue';
import NoteIcon from './components/icons/NoteIcon.vue';

const activeTab = useStorage('active-tab', 'generator');
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  background-color: var(--tab-bg);
  border-radius: 0.5rem;
  padding: 0.5rem;
}

.tabs button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.tabs button:hover {
  background-color: var(--icon-hover-bg);
}

.tabs button.active {
  background-color: var(--tab-active-bg);
  color: var(--text-primary);
}

.tabs button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.app-main {
  flex-grow: 1;
}
</style>
