<template>
  <div class="notepad-container">
    <template v-if="!qrCodeDataUrl">
      <div class="qr-code-actions">
        <button class="generate-qr-btn" @click="generateQRCode">
          <i class="pi pi-qrcode"></i> QR Code
        </button>
      </div>
      <textarea
        v-model="note"
        class="notepad-textarea"
        placeholder="Suas anotações aqui..."
      ></textarea>
    </template>

    <template v-else>
      <div class="qr-code-actions">
        <button class="close-qr-btn" @click="closeQRCode">
          <i class="pi pi-times"></i> Fechar QR Code
        </button>
      </div>
      <div class="qr-code-preview">
        <img :src="qrCodeDataUrl" alt="QR Code" class="qr-code-image" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStorage } from '../../composables/useStorage';
import { QRCodeGeneratorProxy } from '../../services/qrcode/QRCodeGeneratorProxy';
import { RealQRCodeGenerator } from '../../services/qrcode/RealQRCodeGenerator';

const note = useStorage('user-note', '');
const qrCodeDataUrl = ref<string>('');

const qrCodeProxy = new QRCodeGeneratorProxy(new RealQRCodeGenerator());

const generateQRCode = async () => {
  if (!note.value) return;
  try {
    qrCodeDataUrl.value = await qrCodeProxy.generate(note.value);
  } catch (error) {
    console.error('Failed to generate QR Code:', error);
  }
};

const closeQRCode = () => {
  qrCodeDataUrl.value = '';
};
</script>

<style scoped>
.notepad-container {
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.qr-code-actions {
  display: flex;
  justify-content: flex-end;
}

.generate-qr-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary);
  color: var(--button-text, #ffffff);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s, opacity 0.2s;
}

.generate-qr-btn:hover {
  opacity: 0.9;
}

.close-qr-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.close-qr-btn:hover {
  background-color: var(--tab-bg);
}

.qr-code-preview {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: var(--tab-bg);
  border-radius: 8px;
  border: 1px solid var(--border);
}

.qr-code-image {
  max-width: 200px;
  border-radius: 4px;
}

.notepad-textarea {
  width: 100%;
  height: 250px;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  background-color: var(--tab-bg);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  box-sizing: border-box;
}

.notepad-textarea:focus {
  outline: 2px solid var(--primary);
  border-color: transparent;
}
</style>
