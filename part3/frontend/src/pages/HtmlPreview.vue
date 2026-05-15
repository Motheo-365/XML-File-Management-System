<template>
  <div class="preview">
    <iframe class="frame" :srcdoc="html"></iframe>
  </div>
</template>

<script setup>
  import { ref } from "vue"

  const html = ref(localStorage.getItem("htmlPreview") || "")
</script>

<style scoped>
  .preview {
    width: 100%;
    height: 100vh;
  }

  .frame {
    width: 100%;
    height: 100%;
    border: none;
    background: white;
  }
</style>