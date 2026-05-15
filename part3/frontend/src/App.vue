<script setup>
  import NavBar from '@/components/NavBar.vue'
  import Message from '@/components/Message.vue'
  import Confirm from '@/components/Confirm.vue'
  import { onMounted, ref } from "vue"
  import { setMessageInstance, setConfirmInstance } from "@/plugins/ui"

  const messageEl = ref(null)
  const confirmEl = ref(null)

  onMounted(() => {
    setMessageInstance(messageEl.value)
    setConfirmInstance(confirmEl.value)
  })
</script>

<template>
  <div class="app">

    <NavBar />

    <Message ref="messageEl" />
    <Confirm ref="confirmEl" />

    <router-view />

  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --p1: #9E72C3;
    --p2: #924DBF;
    --p3: #7228A0;
    --p4: #4A2574;
    --p5: #0F0529;

    --text: #eae6f5;
    --muted: rgba(234, 230, 245, 0.65);

    --surface: rgba(74, 37, 116, 0.25);
    --border: rgba(146, 77, 191, 0.25);

    --glow: rgba(146, 77, 191, 0.4);
  }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--p5);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>