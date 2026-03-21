<template>
  <div id="app-container">
    <header class="app-header">
      <div class="header-title">
        <span>Ferramentas</span>
      </div>
      <button class="hamburger-menu" @click="sidebarVisible = true">
        <i class="pi pi-bars"></i>
      </button>
    </header>

    <Sidebar v-model:visible="sidebarVisible" position="right" class="extension-sidebar">
      <h2>Menu</h2>
      <div class="sidebar-links">
        <button @click="selectTab('generator')" :class="{ active: activeTab === 'generator' }">
          <IDIcon />
          <span>Gerador</span>
        </button>
        <button @click="selectTab('notepad')" :class="{ active: activeTab === 'notepad' }">
          <NoteIcon />
          <span>Notas</span>
        </button>
        <button @click="selectTab('settings')" :class="{ active: activeTab === 'settings' }">
          <SettingsIcon />
          <span>Configurações</span>
        </button>
      </div>
    </Sidebar>

    <main class="app-main">
      <Generator v-if="activeTab === 'generator'" />
      <Notepad v-if="activeTab === 'notepad'" />
      <Settings v-if="activeTab === 'settings'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from './composables/useStorage';
import { useTheme } from './composables/useTheme';
import Generator from './components/features/Generator.vue';
import Notepad from './components/features/Notepad.vue';
import Settings from './components/features/Settings.vue';
import IDIcon from './components/icons/IDIcon.vue';
import NoteIcon from './components/icons/NoteIcon.vue';
import SettingsIcon from './components/icons/SettingsIcon.vue';
import Sidebar from 'primevue/sidebar';

const activeTab = useStorage('active-tab', 'generator');
const sidebarVisible = ref(false);

useTheme();

function selectTab(tab: string) {
  activeTab.value = tab;
  sidebarVisible.value = false;
}
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

.header-title {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.hamburger-menu {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.hamburger-menu:hover {
  background-color: var(--icon-hover-bg);
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.sidebar-links button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background-color: transparent;
  color: var(--text-secondary);
  font-size: 1.1rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-align: left;
}

.sidebar-links button:hover {
  background-color: var(--icon-hover-bg);
}

.sidebar-links button.active {
  background-color: var(--tab-active-bg);
  color: var(--text-primary);
}

.sidebar-links button svg {
  width: 1.25rem;
  height: 1.25rem;
}

.app-main {
  flex-grow: 1;
}

:deep(.p-sidebar) {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.2);
}
:deep(.p-sidebar-header) {
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}
:deep(.p-sidebar-close) {
  color: var(--text-primary);
}
:deep(.p-sidebar-content) {
  padding: 1rem;
}
</style>
