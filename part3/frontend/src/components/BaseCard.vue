<!-- Motheo Morena u24666981 -->
<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<style scoped>
.base-card {
  width: 18vw;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  backdrop-filter: blur(12px);
  padding: 5%;
  border-radius: 14px;
  text-align: left;
  margin: 2%;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  transition: 0.25s;
}

.base-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px var(--glow);
}

.base-card::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 15px;
  border-bottom: 3px solid var(--p2);
  border-right: 3px solid var(--p2);
}
</style>