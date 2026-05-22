<!-- Motheo Morena u24666981 -->
<template>
  <BaseCard>

    <h3>{{ title }}</h3>

    <input
      type="file"
      :accept="accept"
      @change="handleFile"
    />

    <button @click="upload">
      {{ buttonText }}
    </button>

  </BaseCard>
</template>

<script setup>
  import { ref } from "vue"
  import BaseCard from "@/components/BaseCard.vue"
  import { $toast } from "@/plugins/ui"

  const props = defineProps({
    title: String,
    uploadUrl: String,
    accept: String,
    buttonText: {
      type: String,
      default: "Upload"
    }
  })

  const file = ref(null)

  function handleFile(event) {
    const selectedFile = event.target.files[0]

    if (!selectedFile) return

    const fileName = selectedFile.name.toLowerCase()

    const allowedExtensions = props.accept
      .split(",")
      .map(ext => ext.trim().toLowerCase())

    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext))

    if (!isValid) {
      $toast(`Invalid file type. Allowed: ${props.accept}`, "error")
      event.target.value = "" // reset input
      file.value = null
      return
    }

    file.value = selectedFile
  }

  async function upload() {
    if (!file.value) {
      $toast("Please upload a file.", "error")
      return
    }

    const formData = new FormData()
    formData.append("file", file.value)

    try {
      const response = await fetch(props.uploadUrl, {
        method: "POST",
        body: formData
      })

      const data = await response.json()

      $toast(data.message || "Upload successful.", "success")
    } 
    catch (err) {
      $toast("Upload failed: " + err.message, "error")
    }
  }
</script>

<style scoped>
  h3 {
    text-align: left;
    margin-bottom: 20px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 2px;
    color: var(--p1);
    text-transform: uppercase;
  }

  input[type="file"] {
    width: 100%;
    padding: 15px;
    background: rgba(146, 77, 191, 0.05);
    border: 1px dashed var(--p3);
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    cursor: pointer;
    transition: 0.3s;
    box-sizing: border-box;
  }

  input[type="file"]:hover {
    background: rgba(146, 77, 191, 0.15);
    box-shadow: 0 0 20px var(--glow);
    color: #fff;
  }

  button {
    margin-top: 20px;
    padding: 12px;
    border: 1px solid #7c3aed;
    background: transparent;
    border: 1px solid var(--p2);
    color: var(--p1);
    font-family: 'Orbitron', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    width: 100%;
    transition: all 0.3s ease;
    /* Beveled corner effect */
    clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%);
  }

  button:hover:not(:disabled) {
    background: rgba(146, 77, 191, 0.15);
    box-shadow: 0 0 20px var(--glow);
    transform: translateY(-2px);
  }

  button:disabled {
    border-color: #444;
    color: #444;
    cursor: not-allowed;
  }


  input[type="file"] {
    background: rgba(124, 58, 237, 0.05);
    border: 1px dashed var(--primary);
    color: var(--muted);
  }

  input[type="file"]:hover {
    background: rgba(124, 58, 237, 0.2);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  }

  button {
    border: 1px solid var(--primary);
    color: var(--primary-glow);
  }

  button:hover:not(:disabled) {
    background: rgba(124, 58, 237, 0.1);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
  }
</style>