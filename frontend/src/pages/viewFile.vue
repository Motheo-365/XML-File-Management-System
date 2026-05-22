<!-- Motheo Morena u24666981 -->

<template>
  <div class="viewer">
    <h1>{{ filename }}</h1>
    
    <button @click="saveFile" class="save-btn">
      Save Changes
    </button>


    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- MONACO EDITOR -->
    <div ref="editorContainer" class="monaco-editor"></div>

    <!-- LIVE XML ERRORS -->
    <div v-if="xmlErrors.length" class="error-box">
      <h4>XML Errors</h4>
      <ul>
        <li v-for="(err, i) in xmlErrors" :key="i">
          {{ err }}
        </li>
      </ul>
    </div>

    <div v-if="type === 'xml'" class="transform-section">
      <h3>Transform XML</h3>

      <span>Choose XSLT: </span>
      <select v-model="selectedXslt">
        <option v-for="file in xsltFiles" :key="file">
          {{ file }}
        </option>
      </select>

      <button @click="transformFile" class="transform-btn">
        Transform & Preview
      </button>
      <button @click="goToHtml" class="transform-btn">
        See HTML
      </button>
    </div>

    <!-- PREVIEW -->
    <div v-if="showPreview" class="preview">

      <h3>Output Preview</h3>

      <iframe
        class="preview-frame"
        :srcdoc="outputHtml"
      ></iframe>

    </div>

  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from "vue"
  import { useRoute, useRouter } from "vue-router"
  import * as monaco from "monaco-editor"
  import { $toast } from "@/plugins/ui"

  const route = useRoute()
  const router = useRouter()

  const type = computed(() => route.params.type)
  const filename = computed(() => route.params.name)

  const content = ref("")
  const loading = ref(false)
  const error = ref(null)

  const xmlErrors = ref([])

  const outputHtml = ref("")
  const showPreview = ref(false)
  const xsltFiles = ref([])
  const selectedXslt = ref("")

  const editorContainer = ref(null)
  let editor = null

  const validateXML = (xml) => {
    try {
      const parser = new DOMParser()
      const parsed = parser.parseFromString(xml, "application/xml")

      const errorNode = parsed.querySelector("parsererror")

      xmlErrors.value = errorNode ? [errorNode.textContent] : []

    } catch (err) {
      xmlErrors.value = [err.message]
    }
  }

  const initEditor = (initialValue) => {
    editor = monaco.editor.create(editorContainer.value, {
      value: initialValue,
      language: "xml",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 14,
      fontFamily: "'JetBrains Mono', monospace",
      minimap: { enabled: false }
    })

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue()
      content.value = value
      validateXML(value)
    })
  }

  const fetchFile = async () => {
    loading.value = true
    error.value = null

    try {
      const url = `http://localhost:3000/files/${type.value}/${encodeURIComponent(filename.value)}`
      const res = await fetch(url)

      if (!res.ok) throw new Error("Failed to load file")

      const raw = await res.text()

      content.value = raw
      validateXML(raw)

      if (editor) editor.setValue(raw)
      else initEditor(raw)

    } catch (err) {
      error.value = err.message
      $toast(err.message, "error")

    } finally {
      loading.value = false
    }
  }

  const saveFile = async () => {

    if (xmlErrors.value.length > 0) {
      $toast("Fix XML errors before saving", "error")
      return
    }

    try {
      const blob = new Blob([editor.getValue()], { type: "text/xml" })

      const formData = new FormData()
      formData.append("file", blob, filename.value)

      const res = await fetch(
        `http://localhost:3000/files/${type.value}/${encodeURIComponent(filename.value)}`,
        {
          method: "PUT",
          body: formData
        }
      )

      if (!res.ok) throw new Error("Failed to save file")

      $toast("File updated successfully", "success")

    } catch (err) {
      $toast(err.message, "error")
    }
  }

  const fetchXslt = async () => {
    try {
      const res = await fetch("http://localhost:3000/files/xslt")
      const data = await res.json()

      xsltFiles.value = data
      selectedXslt.value = data[0] || ""

    } catch (err) {
      $toast("Failed to load XSLT files", "error")
    }
  }

  const transformFile = async () => {
    try {
      const url = new URL("http://localhost:3000/transform")

      url.search = new URLSearchParams({
        xml: filename.value,
        xslt: selectedXslt.value
      }).toString()

      console.log("TRANSFORM URL:", url.toString())

      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(await res.text())
      }

      outputHtml.value = await res.text()
      showPreview.value = true

      $toast("Transformation successful", "success")

    } catch (err) {
      $toast("Transformation failed: " + err.message, "error")
    }
  }
  
  const goToHtml = () => {
    localStorage.setItem("htmlPreview", outputHtml.value)

    router.push({ name: "htmlPreview" })
  }

  watch(() => route.params.name, () => {
    fetchFile()
  })

  onMounted(() => {
    fetchFile()

    if (type.value === "xml") {
      fetchXslt()
    }
  })
</script>

<style scoped>  
  .viewer {
    width: 90vw;
    margin: 0 auto;
    padding: 0%;
    border-radius: 8px;
  }

  h1 {
    font-size: 1.8rem;
    text-align: center;
  }

  h3 {
    font-size: 1.5rem;
    text-align: center;
  }

  select {
    padding: 0.8%;
    margin-bottom: 2%;
    margin-right: 3%;
    border-radius: 4px;
    font-weight: bold;

    border: 1px solid rgba(255,255,255,0.2);
    background: var(--p4);
    color: var(--muted);
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0 10px rgb(128, 0, 128);
  }

  .monaco-editor {
    height: 75vh;
    border: 1px solid rgba(0, 252, 255, 0.2);
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
    padding: 1.3%;
    margin-bottom: 5vh;
  }

  .save-btn {
    color: white;
    font-weight: bold;
    font-size: 1.05rem;
    letter-spacing: 3px;
    padding: 5px;
    text-shadow: 0 2px 5px rgba(148, 150, 148, 0.657);
  }

  .transform-btn {
    color: var(--primary);
    font-size: 1.05rem;
    margin-bottom: 5%;
  }


  .save-btn, .transform-btn {
    background: transparent;
    border: 1px solid var(--primary);
    text-transform: uppercase;
    font-family: 'Orbitron';
    padding: 10px 25px;
    clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
    transition: 0.3s;
    cursor: pointer;
    letter-spacing: 1.75px;
  }

  .save-btn:hover, .transform-btn:hover {
    background: var(--primary);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
    box-shadow: 0 0 20px rgba(112, 0, 255, 0.4);
    cursor: pointer;
    transform: translate(-20px);
    font-weight: bold;
  }

  .preview-frame {
    background: #fff;
    border: 4px double rgba(112, 0, 255, 0.4);
    width: 85vw;
    height: 100vh;
    margin-bottom: 5%;
  }
</style>