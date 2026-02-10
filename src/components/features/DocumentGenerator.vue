<template>
  <div class="generator-container">
    <h3 class="generator-title">{{ title }}</h3>
    <div class="document-display">
      <span class="document-text" @click="copyToClipboard(document, title)">{{ document || `Clique para gerar um ${title}` }}</span>
      <div class="button-group">
        <button @click="generate" class="icon-button generate-button" :aria-label="`Gerar ${title}`">
          <IDIcon />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import IDIcon from '../icons/IDIcon.vue';

const props = defineProps<{
  title: string;
  document: string;
  generate: () => void;
  copyToClipboard: (text: string, documentName: string) => void;
}>();

const { title, document, generate, copyToClipboard } = toRefs(props);
</script>

<style scoped>
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background-color: var(--tab-bg);
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.generator-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.document-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  width: 100%;
  min-height: 2.5rem;
  box-sizing: border-box;
}

.document-text {
  font-family: 'monospace';
  font-size: 1.1rem;
  color: var(--text-secondary);
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  user-select: none; /* Impede a seleção do texto ao clicar */
  padding-right: 1rem;
}

.document-text:hover {
  color: var(--text-primary);
}

.button-group {
  display: flex;
  align-items: center;
  border-left: 1px solid var(--border);
  padding-left: 1rem;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--icon-color);
  padding: 0.5rem;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: var(--icon-hover-bg);
}

.generate-button {
  background-color: var(--primary);
  color: #ffffff;
}

.generate-button:hover {
  background-color: var(--primary-hover);
}
</style>