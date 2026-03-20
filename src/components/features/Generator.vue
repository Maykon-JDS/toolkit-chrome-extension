<template>
  <div class="generators-list">
    <template v-for="(tool, index) in sortedTools" :key="tool.id">
      <div v-if="index > 0 && isPinnedDivider(index)" class="pinned-divider">
        <span class="pinned-divider-label">Outras ferramentas</span>
      </div>
      <hr v-else-if="index > 0" class="separator" />

      <!-- CPF Generator -->
      <DocumentGenerator
        v-if="tool.id === 'cpf'"
        title="CPF"
        :document="generatedCPF"
        :pinned="isPinned('cpf')"
        :generate="generateCPF"
        :copyToClipboard="copyToClipboard"
        @toggle-pin="togglePin('cpf')"
      />

      <!-- CNPJ Generator -->
      <DocumentGenerator
        v-if="tool.id === 'cnpj'"
        title="CNPJ"
        :document="generatedCNPJ"
        :pinned="isPinned('cnpj')"
        :generate="generateCNPJ"
        :copyToClipboard="copyToClipboard"
        @toggle-pin="togglePin('cnpj')"
      />

      <!-- NFe Key Generator -->
      <div v-if="tool.id === 'nfe'" class="group-wrapper" :class="{ 'is-pinned': isPinned('nfe') }">
        <div class="group-header">
          <button
            class="pin-button"
            :class="{ active: isPinned('nfe') }"
            :aria-label="isPinned('nfe') ? 'Desafixar Chave NFe' : 'Fixar Chave NFe'"
            @click="togglePin('nfe')"
          >
            <PinIcon :pinned="isPinned('nfe')" />
          </button>
        </div>
        <div class="selectors-container">
          <div class="field-row">
            <div class="field-item">
              <label for="model">Tipo de Documento:</label>
              <select id="model" v-model="selectedModel" @change="resetKeys" class="select-input">
                <option value="55">NFe (Nota Fiscal Eletrônica)</option>
                <option value="57">CTe (Conhecimento de Transporte)</option>
                <option value="58">MDFe (Manifesto de Documentos)</option>
                <option value="65">NFCe (Nota Fiscal de Consumidor)</option>
              </select>
            </div>
          </div>

          <div class="field-grid">
            <div class="field-item">
              <label for="issuer-uf">UF Emitente:</label>
              <select id="issuer-uf" v-model="selectedIssuerUF" @change="resetKeys" class="select-input">
                <option value="12">AC</option>
                <option value="27">AL</option>
                <option value="13">AM</option>
                <option value="16">AP</option>
                <option value="29">BA</option>
                <option value="23">CE</option>
                <option value="53">DF</option>
                <option value="32">ES</option>
                <option value="52">GO</option>
                <option value="21">MA</option>
                <option value="31">MG</option>
                <option value="50">MS</option>
                <option value="51">MT</option>
                <option value="15">PA</option>
                <option value="25">PB</option>
                <option value="26">PE</option>
                <option value="22">PI</option>
                <option value="41">PR</option>
                <option value="33">RJ</option>
                <option value="24">RN</option>
                <option value="11">RO</option>
                <option value="14">RR</option>
                <option value="43">RS</option>
                <option value="42">SC</option>
                <option value="28">SE</option>
                <option value="35">SP</option>
                <option value="17">TO</option>
              </select>
            </div>

            <div class="field-item">
              <label for="dest-uf">UF Destinatário:</label>
              <select id="dest-uf" v-model="selectedDestUF" @change="resetKeys" class="select-input">
                <option value="12">AC</option>
                <option value="27">AL</option>
                <option value="13">AM</option>
                <option value="16">AP</option>
                <option value="29">BA</option>
                <option value="23">CE</option>
                <option value="53">DF</option>
                <option value="32">ES</option>
                <option value="52">GO</option>
                <option value="21">MA</option>
                <option value="31">MG</option>
                <option value="50">MS</option>
                <option value="51">MT</option>
                <option value="15">PA</option>
                <option value="25">PB</option>
                <option value="26">PE</option>
                <option value="22">PI</option>
                <option value="41">PR</option>
                <option value="33">RJ</option>
                <option value="24">RN</option>
                <option value="11">RO</option>
                <option value="14">RR</option>
                <option value="43">RS</option>
                <option value="42">SC</option>
                <option value="28">SE</option>
                <option value="35">SP</option>
                <option value="17">TO</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field-item">
              <label>Identificação do Emitente:</label>
              <div class="segmented-control">
                <button 
                  :class="{ active: emitterType === 'CNPJ' }" 
                  @click="emitterType = 'CNPJ'; resetKeys()"
                >CNPJ</button>
                <button 
                  :class="{ active: emitterType === 'CPF' }" 
                  @click="emitterType = 'CPF'; resetKeys()"
                >CPF</button>
              </div>
            </div>
          </div>
        </div>

        <DocumentGenerator
          :title="`Chave ${selectedModelName} (Homologação SEFAZ)`"
          :document="generatedNFeHomologation"
          :generate="generateNFeHomologation"
          :copyToClipboard="copyToClipboard"
          :hidePin="true"
        />
      </div>
    </template>

    <div v-if="showNotification" class="notification">
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { generateCPF as genCPF, generateCNPJ as genCNPJ, generateNFeKey as genNFeKey } from '../../utils/documentUtils';
import { usePinnedTools } from '../../composables/usePinnedTools';
import DocumentGenerator from './DocumentGenerator.vue';
import PinIcon from '../icons/PinIcon.vue';

const { pinnedIds, togglePin, isPinned, sortByPinned } = usePinnedTools();

const generatedCPF = ref('');
const generatedCNPJ = ref('');
const generatedNFeHomologation = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);
const selectedModel = ref('55');
const selectedIssuerUF = ref('33'); // RJ
const selectedDestUF = ref('33'); // RJ
const emitterType = ref<'CNPJ' | 'CPF'>('CNPJ');

const tools = [
  { id: 'cpf', label: 'CPF' },
  { id: 'cnpj', label: 'CNPJ' },
  { id: 'nfe', label: 'NFe' },
];

const sortedTools = computed(() => sortByPinned(tools));

const hasPinnedTools = computed(() => pinnedIds.value.length > 0);

function isPinnedDivider(index: number): boolean {
  if (!hasPinnedTools.value) return false;
  const currentTool = sortedTools.value[index];
  const prevTool = sortedTools.value[index - 1];
  
  if (!currentTool || !prevTool) return false;
  
  return !isPinned(currentTool.id) && isPinned(prevTool.id);
}

const selectedModelName = computed(() => {
  const models: Record<string, string> = {
    '55': 'NFe',
    '57': 'CTe',
    '58': 'MDFe',
    '65': 'NFCe',
  };
  return models[selectedModel.value] || 'NFe';
});

const resetKeys = () => {
  generatedNFeHomologation.value = '';
};

const generateCPF = () => {
  generatedCPF.value = genCPF();
};

const generateCNPJ = () => {
  generatedCNPJ.value = genCNPJ();
};

const generateNFeHomologation = () => {
  generatedNFeHomologation.value = genNFeKey(selectedIssuerUF.value, true, selectedModel.value, emitterType.value);
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

.pinned-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
}

.pinned-divider::before,
.pinned-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--border);
}

.pinned-divider-label {
  font-size: 0.7rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem;
  background-color: var(--tab-bg);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.group-wrapper.is-pinned {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.group-header {
  display: flex;
  justify-content: flex-end;
}

.pin-button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--icon-color);
  padding: 0.375rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  opacity: 0.5;
}

.pin-button:hover {
  background-color: var(--icon-hover-bg);
  opacity: 1;
}

.pin-button.active {
  opacity: 1;
  color: var(--primary);
}

.selectors-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.field-row {
  display: flex;
  flex-direction: column;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field-item label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.segmented-control {
  display: flex;
  background-color: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 0.25rem;
  gap: 0.25rem;
}

.segmented-control button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.segmented-control button:hover {
  background-color: var(--icon-hover-bg);
}

.segmented-control button.active {
  background-color: var(--primary);
  color: white;
}

.selectors-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.model-selector, .uf-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.model-selector label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.select-input {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}

.select-input:hover {
  border-color: var(--primary);
}

.select-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
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
