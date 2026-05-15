<template>
  <div class="container">

    <div
      v-for="msg in messages"
      :key="msg.id"
      class="toast"
      :class="msg.type"
    >
      <div class="text">
        {{ msg.text }}
      </div>

      <button class="ok-btn" @click="remove(msg.id)">
        OK
      </button>

    </div>

  </div>
</template>

<script setup>
    import { ref } from "vue"

    const messages = ref([])

    function show(text, type = "info") {
        const id = Date.now()

        messages.value.push({ id, text, type })

        const timer = setTimeout(() => {
            remove(id)
        }, 3000)
    }

    function remove(id) {
        messages.value = messages.value.filter(m => m.id !== id)
    }

    defineExpose({ show, remove })
</script>

<style scoped>
    .container {
        position: fixed;

        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        display: flex;
        flex-direction: column;
        align-items: center;

        gap: 10px;

        z-index: 1000;

        pointer-events: none; /* allows clicks through except on toasts */
    }

    .toast {
        background: var(--surface);
        border: 1px solid var(--border);
        padding: 12px 16px;

        min-width: 250px;
        max-width: 350px;

        color: var(--text);
        backdrop-filter: blur(10px);

        animation: slide 0.3s ease;

        text-align: center;

        pointer-events: auto; /* clickable */
    }

    .toast.success {
        border-color: var(--p2);
    }

    .toast.error {
        border-color: #ff4d6d;
    }

    .toast.info {
        border-color: var(--p1);
    }

    .ok-btn {
        margin-top: 10px;

        padding: 6px 12px;

        background: transparent;
        border: 1px solid var(--p2);
        color: var(--p1);

        cursor: pointer;
        font-size: 0.7rem;
        text-transform: uppercase;

        transition: 0.2s;
    }

    .ok-btn:hover {
        background: rgba(146, 77, 191, 0.2);
    }

    @keyframes slide {
        from {
            transform: translateX(20px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
</style>