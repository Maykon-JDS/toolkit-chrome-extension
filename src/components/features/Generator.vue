<template>
  <div class="generators-list">
    <DocumentGenerator
      title="CPF"
      :document="generatedCPF"
      :generate="generateCPF"
      :copyToClipboard="copyToClipboard"
    />
    <hr class="separator" />
    <DocumentGenerator
      title="CNPJ"
      :document="generatedCNPJ"
      :generate="generateCNPJ"
      :copyToClipboard="copyToClipboard"
    />
    <hr class="separator" />
    <DocumentGenerator
      title="Chave de NFe/CFe/MDFe"
      :document="generatedNFeKey"
      :generate="generateNFeKey"
      :copyToClipboard="copyToClipboard"
    />
    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { generateCPF as genCPF, generateCNPJ as genCNPJ, generateNFeKey as genNFeKey } from '../../utils/documentUtils';
import DocumentGenerator from './DocumentGenerator.vue';

const generatedCPF = ref('');
const generatedCNPJ = ref('');
const generatedNFeKey = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);

const generateCPF = () => {
  generatedCPF.value = genCPF();
};

const generateCNPJ = () => {
  generatedCNPJ.value = genCNPJ();
};

const generateNFeKey = () => {
  generatedNFeKey.value = genNFeKey();
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
  gap: 1.5rem;
  padding-top: 1.5rem;
}

.separator {
  border: none;
  height: 1px;
  background-color: var(--border);
  margin: 0.5rem 0;
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
