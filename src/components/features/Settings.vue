<template>
  <div class="settings-container">
    <h2 class="settings-title">Tema</h2>
    <ThemeToggle />
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';
</script>

<style scoped>
.settings-container {
  padding: 1rem;
}

.settings-title {
  margin-bottom: 1rem;
}
</style>
