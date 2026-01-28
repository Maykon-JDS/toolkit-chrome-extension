<template>
  <div class="generator-container">
    <div class="document-display">
      <span class="document-text">{{ generatedDocument || placeholder }}</span>
      <button @click="copyToClipboard" class="icon-button" :aria-label="CopyAriaLabel">
        <CopyIcon />
      </button>
    </div>
    <div class="actions">
      <button @click="generateCPF" class="generate-button">Gerar CPF</button>
      <button @click="generateCNPJ" class="generate-button">Gerar CNPJ</button>
    </div>
    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { generateCPF as genCPF, generateCNPJ as genCNPJ } from '../../utils/documentUtils';
import CopyIcon from '../icons/CopyIcon.vue';

const generatedDocument = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);
const documentType = ref('');

const placeholder = computed(() => `Clique para gerar um ${documentType.value || 'documento'}`);
const CopyAriaLabel = computed(() => `Copiar ${documentType.value || 'documento'}`);

const generateCPF = () => {
  generatedDocument.value = genCPF();
  documentType.value = 'CPF';
};

const generateCNPJ = () => {
  generatedDocument.value = genCNPJ();
  documentType.value = 'CNPJ';
};

const copyToClipboard = async () => {
  if (!generatedDocument.value) return;

  try {
    await navigator.clipboard.writeText(generatedDocument.value);
    showNotification.value = true;
    notificationMessage.value = `${documentType.value} copiado para a área de transferência!`;
    setTimeout(() => (showNotification.value = false), 2000);
  } catch (err) {
    console.error('Falha ao copiar: ', err);
    showNotification.value = true;
    notificationMessage.value = `Falha ao copiar o ${documentType.value}.`;
    setTimeout(() => (showNotification.value = false), 2000);
  }
};
</script>

<style scoped>
.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding-top: 1rem;
}

.document-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: var(--tab-bg);
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
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--icon-color);
  padding: 0.5rem;
  border-radius: 9999px;
}

.icon-button:hover {
  background-color: var(--icon-hover-bg);
}

.actions {
  display: flex;
  gap: 1rem;
}

.generate-button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.generate-button:hover {
  background-color: var(--primary-hover);
}

.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  text-align: center;
}
</style>
