<!-- Motheo Morena u24666981 -->
<template>
  <div class="files-page">

    <h1>File Manager</h1>

    <!-- TOP ROW: FILTER + DELETE -->
    <div class="top-row">

      <div class="panel">
        <div class="section-label">Filter</div>

        <div class="filter-bar">
          <button :class="{ active: selectedFilter === 'all' }" @click="selectedFilter = 'all'">
            All
          </button>

          <button :class="{ active: selectedFilter === 'xml' }" @click="selectedFilter = 'xml'">
            XML
          </button>

          <button :class="{ active: selectedFilter === 'xslt' }" @click="selectedFilter = 'xslt'">
            XSLT
          </button>

          <button :class="{ active: selectedFilter === 'xsd' }" @click="selectedFilter = 'xsd'">
            XSD
          </button>
        </div>
      </div>

      <div class="panel">
        <div class="section-label">Delete</div>

        <div class="action-bar">
          <button @click="deleteAll" class="danger">All</button>
          <button @click="deleteAllXML" class="danger">XML</button>
          <button @click="deleteAllXSLT" class="danger">XSLT</button>
          <button @click="deleteAllXSD" class="danger">XSD</button>
        </div>
      </div>

    </div>

    <p v-if="loading" class="status">Loading files...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <!-- FILE LIST HEADER -->
    <div v-if="!loading && !error" class="section-label">
      Available files ({{ filteredFiles.length }})
    </div>

    <!-- FILE GRID -->
    <ul v-if="!loading && !error && filteredFiles.length" class="files-grid">
      <li v-for="file in filteredFiles" :key="file.id">
        <BaseCard>
          <div class="file-card">
            <span class="badge" :class="file.type">
              {{ file.type.toUpperCase() }}
            </span>

            <!-- ICON -->
            <div class="avatar" :class="file.type">
              <component :is="getIcon(file.type)" size="26" />
            </div>
            <!-- INFO -->
            <div class="info">

              <div class="file-top">
                <strong>{{ file.name }}</strong>

              </div>

              <!-- ACTIONS -->
              <div class="file-actions">

                <RouterLink
                  :to="{ name: 'viewFile', params: { type: file.type, name: file.name } }"
                  class="action-link"
                >
                  Open →
                </RouterLink>

                <button class="icon-btn" @click="deleteFile(file)">
                  <Trash2 size="18" />
                </button>

              </div>

            </div>
          </div>
        </BaseCard>
      </li>
    </ul>

    <!-- EMPTY STATE -->
    <p v-if="!loading && !error && !filteredFiles.length" class="empty">
      No files found for this filter.
    </p>

  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from "vue"
  import { Trash2, FileCode2, FileJson, FileText } from "lucide-vue-next"
  import BaseCard from "@/components/BaseCard.vue"
  import { $toast, $confirm } from "@/plugins/ui"

  const files = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedFilter = ref("all")

  const filteredFiles = computed(() => {
    if (selectedFilter.value === "xml") {
      return files.value.filter(f => f.type === "xml")
    }

    if (selectedFilter.value === "xslt") {
      return files.value.filter(f => f.type === "xslt")
    }

    if (selectedFilter.value === "xsd") {
      return files.value.filter(f => f.type === "xsd")
    }


    return files.value
  })

  const fetchFiles = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch("http://localhost:3000/files")

      if (!response.ok) {
        throw new Error("Failed to fetch files")
      }

      const data = await response.json()

      files.value = [
        ...data.xml.map((name, index) => ({
          id: `xml-${index}`,
          name,
          type: "xml"
        })),
        ...data.xslt.map((name, index) => ({
          id: `xslt-${index}`,
          name,
          type: "xslt"
        })),
        ...data.xsd.map((name, index) => ({
          id: `xsd-${index}`,
          name,
          type: "xsd"
        }))
      ]

    } catch (err) {
      error.value = err.message
      ui.message(err.message, "error")

    } finally {
      loading.value = false
    }
  }

  const deleteFile = async (file) => {
    const ok = await $confirm({
      title: "Delete File",
      message: `Delete ${file.name}?`
    })
    if (!ok) return

    try {
      const endpoint =
        `http://localhost:3000/files/${file.type}/${encodeURIComponent(file.name)}`

      const res = await fetch(endpoint, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")

      $toast("File deleted", "success")
      await fetchFiles()

    } catch (err) {
      $toast("Delete failed: " + err.message, "error")
    }
  }

  const deleteAll = async () => {
    const ok = await $confirm({
      title: "Danger Zone",
      message: "Delete ALL files? This cannot be undone."
    })
    if (!ok) return

    try {
      await fetch("http://localhost:3000/files/xml",  { method: "DELETE" })
      await fetch("http://localhost:3000/files/xslt", { method: "DELETE" })
      await fetch("http://localhost:3000/files/xsd",  { method: "DELETE" })

      $toast("All files deleted", "success")
      await fetchFiles()

    } catch (err) {
      $toast("Delete failed: " + err.message, "error")
    }
  }

  const deleteAllXML = async () => {
    const ok = await $confirm({
      title: "Delete XML",
      message: "Delete all XML files?"
    })

    if (!ok) return

    try {
      await fetch("http://localhost:3000/files/xml", {
        method: "DELETE"
      })

      ui.message("XML files deleted", "success")

      await fetchFiles()

    } catch (err) {
      ui.message("Delete failed: " + err.message, "error")
    }
  }

  const deleteAllXSLT = async () => {
    const ok = await $confirm({
      title: "Delete XSLT",
      message: "Delete all XSLT files?"
    })

    if (!ok) return

    try {
      await fetch("http://localhost:3000/files/xslt", {
        method: "DELETE"
      })

      ui.message("XSLT files deleted", "success")

      await fetchFiles()

    } catch (err) {
      ui.message("Delete failed: " + err.message, "error")
    }
  }

  const deleteAllXSD = async () => {
    const ok = await $confirm({
      title: "Delete XSD",
      message: "Delete all XSD files?"
    })

    if (!ok) return

    try {
      await fetch("http://localhost:3000/files/xsd", {
        method: "DELETE"
      })

      ui.message("XSD files deleted", "success")

      await fetchFiles()

    } 
    catch (err) {
      ui.message("Delete failed: " + err.message, "error")
    }    
  }

  function getIcon(type) {
    if (type === "xml") return FileCode2
    if (type === "xslt") return FileText
    if (type === "xsd") return FileJson
  }

  onMounted(() => {
    fetchFiles()
  })
</script>

<style scoped>
  .files-page {
    margin: 4vh auto;
    width: 85vw;
    padding: 2vw;

    background: var(--bg);
    color: var(--text);

    border-radius: 0.8vw;
  }


  .file-top {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin: 3vh 0 3vh 0;
  }

  h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: 2vw;
    letter-spacing: 0.3vw;

    color: #a78bfa;
    text-shadow: 0 0 1vw rgba(124, 58, 237, 0.4);
  }

  /* SLIM CONTROLS */
  .top-row {
    display: flex;
    gap: 1vw;
    margin-bottom: 3vh;
  }


  .panel {
    background: var(--surface);
    border: 0.1vw solid var(--border);
    padding: 1vw;

    font-size: 0.8vw;
  }

  .filter-bar, .action-bar {
    display: flex;
    gap: 5px;
  }

  button {
    border: 0.1vw solid rgba(255,255,255,0.2);
    background: var(--p4);
    color: var(--muted);

    padding: 0.5vh 1vw;
    font-size: 0.7vw;

    cursor: pointer;
    transition: 0.2s;
  }

  button.active,
  button:hover:not(.danger) {
    border-color: var(--primary);
    color: var(--primary-glow);
    background: rgba(124, 58, 237, 0.1);
  }

  .danger {
    border-color: #ff0055;
    color: #ff0055;
    background-color: var(--p5);
  }

  .danger:hover {
    background: rgba(255, 0, 85, 0.1);
    box-shadow: 0 0 10px rgba(255, 0, 85, 0.2);
  }

  /* THE NEW FILE CARD LAYOUT */
  .files-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1vw;

    list-style: none;
    padding: 0;
  }

  .file-card {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 1.5vh;
  }

  .avatar {
    width: 15vw;
    height: 30vh;

    border-radius: 1vw;

    display: flex;
    align-items: center;
    justify-content: center;

    background: linear-gradient(135deg, #7c3aed2f, #c084fc3b);
    color: #3b82f6;

    box-shadow: 0 0 1vw rgba(59,130,246,0.4);

    transition: 0.3s;
  }


  .avatar svg {
    width: 4vw;
    height: 4vw;
  }
  /* hover glow */
  .avatar:hover {
    transform: scale(1.05);
  }

  .badge {
    margin: 0 0.7vw;
    margin-bottom: 2.5vh;

    font-size: 0.7vw;
    font-weight: bold;

    padding: 0.2vh 0.5vw;

    border: 0.1vw solid currentColor;
    box-shadow: 0 0 0.6vw purple;
  }

  .info strong {
    font-family: 'Orbitron';
    font-size: 0.8vw;

    letter-spacing: 0.2vw;
    margin: 1vh 0;

    color: #fff;
  }

  .section-label {
    font-size: 0.7vw;

    color: #a78bfa;
    font-family: 'Orbitron';

    margin-bottom: 1vh;
    opacity: 0.8;
  }

  .file-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-top: 0.1vw solid rgba(255,255,255,0.05);
    padding-top: 1vh;
  }

  .action-link {
    color: #a78bfa;
    font-size: 0.7vw;

    text-decoration: none;
    text-transform: uppercase;
  }
</style>