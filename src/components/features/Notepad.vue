<template>
  <div class="notepad-container">
    <textarea
      v-model="note"
      class="notepad-textarea"
      placeholder="Suas anotações aqui..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from '../../composables/useStorage';

const note = useStorage('user-note', '');
</script>

<style scoped>
.notepad-container {
  padding-top: 1rem;
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
