<script setup>
    import UploadCard from '@/components/UploadCard.vue'
</script>

<template>
  <div class="upload-page">
    <h1>Data Uploads</h1> <!-- Futuristic Title -->
    
    <div class="upload-row">
      <UploadCard
        title="Upload XML"
        accept=".xml"
        upload-url="http://localhost:3000/upload/xml"
        button-text="Upload XML"
      />

      <UploadCard
        title="Upload XSD"
        accept=".xsd"
        upload-url="http://localhost:3000/upload/xsd"
        button-text="Upload XSD"
      />

      <UploadCard
        title="Upload XSLT"
        accept=".xsl,.xslt"
        upload-url="http://localhost:3000/upload/xslt"
        button-text="Upload XSLT"
      />

    </div>
  </div>
</template>

<style scoped>
  .upload-page {
    margin: 40px auto;
    width: 85vw;
    background: var(--p5);
    color: var(--text);
    padding: 3%;
    border-radius: 8px;
  }

  h1 {
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    letter-spacing: 5px;
    color: var(--p1);
    text-shadow: 0 0 15px var(--glow);
    margin-bottom: 30px;
  }

  .upload-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 25px;
  }

  @media (max-width: 768px) {
    .upload-row { grid-template-columns: 1fr; }
  }
</style>