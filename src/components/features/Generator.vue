<template>
  <div class="generators-list">
    <!-- CPF Generator -->
    <div class="generator-container">
      <h3 class="generator-title">Gerador de CPF</h3>
      <div class="document-display">
        <span class="document-text" @click="copyToClipboard(generatedCPF, 'CPF')">{{ generatedCPF || 'Clique para gerar um CPF' }}</span>
        <div class="button-group">
          <button @click="generateCPF" class="icon-button" aria-label="Gerar CPF">
            <IDIcon />
          </button>
        </div>
      </div>
    </div>

    <!-- CNPJ Generator -->
    <div class="generator-container">
      <h3 class="generator-title">Gerador de CNPJ</h3>
      <div class="document-display">
        <span class="document-text" @click="copyToClipboard(generatedCNPJ, 'CNPJ')">{{ generatedCNPJ || 'Clique para gerar um CNPJ' }}</span>
        <div class="button-group">
          <button @click="generateCNPJ" class="icon-button" aria-label="Gerar CNPJ">
            <IDIcon />
          </button>
        </div>
      </div>
    </div>

    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { generateCPF as genCPF, generateCNPJ as genCNPJ } from '../../utils/documentUtils';
import IDIcon from '../icons/IDIcon.vue';

const generatedCPF = ref('');
const generatedCNPJ = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);

const generateCPF = () => {
  generatedCPF.value = genCPF();
};

const generateCNPJ = () => {
  generatedCNPJ.value = genCNPJ();
};

const copyToClipboard = async (text: string, documentName: string) => {
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    notificationMessage.value = `${documentName} copiado para a área de transferência!`;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 2000);
  } catch (err) {
    console.error(`Falha ao copiar ${documentName}: `, err);
    notificationMessage.value = `Falha ao copiar o ${documentName}.`;
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 2000);
  }
};
</script>

<style scoped>
.generators-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 1.5rem;
}

.generator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
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
  background-color: var(--tab-bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  width: 100%;
  min-height: 2.5rem;
  box-sizing: border-box;
  gap: 0.5rem;
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
}

.document-text:hover {
  color: var(--text-primary);
}

.button-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
}

.icon-button:hover {
  background-color: var(--icon-hover-bg);
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
