<!-- Motheo Morena u24666981 -->
<template>
  <div v-if="visible" class="overlay" @click.self="reject">

    <div class="modal" @keydown.esc="reject" tabindex="0">

      <h3>{{ title }}</h3>
      <p>{{ message }}</p>

      <div class="actions">
        <button class="no" @click="reject">Cancel</button>
        <button class="yes" @click="accept">Confirm</button>
      </div>

    </div>

  </div>
</template>

<script setup>
    import { ref, nextTick } from "vue"

    const visible = ref(false)
    const title = ref("")
    const message = ref("")
    let resolver = null

    function open(data) {
        title.value = data.title || "Confirm"
        message.value = data.message || "Are you sure?"
        visible.value = true

        setTimeout(() => {
            const modal = document.querySelector(".modal")
            modal?.focus()
        })

        return new Promise((resolve) => {
            resolver = resolve
        })
    }

    function close(value) {
        visible.value = false

        if (resolver) {
            resolver(value)
            resolver = null
        }
    }

    function accept() { close(true)  }

    function reject() { close(false) }

    defineExpose({ open })
</script>

<style scoped>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        display: flex;
        align-items: center;
        justify-content: center;

        background: rgba(0, 0, 0, 0.6);
        z-index: 999;

        /* prevents scroll bleed on mobile */
        overflow: hidden;
    }

    .modal {
        background: var(--surface);
        border: 1px solid var(--border);

        width: 320px;
        max-width: 90vw;

        padding: 24px;

        text-align: center;
        backdrop-filter: blur(10px);

        /* smooth appearance */
        transform: translateY(0);
    }


    h3 {
        color: var(--p1);
    }

    p {
        color: var(--muted);
    }

    .actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    button {
        padding: 8px 14px;
        border: 1px solid var(--p2);
        background: transparent;
        color: var(--p1);
        cursor: pointer;
    }

    .yes:hover {
        background: rgba(146, 77, 191, 0.2);
    }

    .no {
        border-color: #ff4d6d;
        color: #ff4d6d;
    }
    .no:hover {
        background-color: #ff4d6e56;
    }
</style>