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
    import { ref } from "vue"

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
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
    }

    .modal {
        background: var(--surface);
        border: 1px solid var(--border);
        padding: 5%;
        width: 20%;
        text-align: center;
        backdrop-filter: blur(10px);
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
</style>