<template>
  <nav class="navbar">

    <button class="back-btn" @click="$router.back()">
      BACK
    </button>

    <div class="links">

      <RouterLink to="/" class="link">
        Files
      </RouterLink>

      <RouterLink to="/upload" class="link">
        Upload
      </RouterLink>

    </div>

  </nav>
</template>

<style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 12px 40px;

    background: rgba(15, 5, 41, 0.85);
    backdrop-filter: blur(12px);
    color: white;

    border-bottom: 1px solid var(--border);
    box-shadow: 0 0 20px rgba(146, 77, 191, 0.15);
  }

  .back-btn {
    border: 1px solid var(--p3);
    background: rgba(146, 77, 191, 0.1);

    color: var(--muted);

    padding: 6px 14px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 2px;

    cursor: pointer;

    clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);

    transition: all 0.25s ease;
  }

  .back-btn:hover {
    color: var(--p1);
    background: rgba(146, 77, 191, 0.15);
    box-shadow: 0 0 12px var(--glow);
  }

  .links {
    display: flex;
    gap: 28px;
  }

  .link {
    position: relative;

    text-decoration: none;
    text-transform: uppercase;

    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;

    color: var(--muted);

    transition: all 0.25s ease;
  }

  .link:hover {
    color: var(--p1);
    text-shadow: 0 0 10px var(--glow);
  }

  .router-link-active {
    color: var(--p1);
    text-shadow: 0 0 10px var(--glow);
  }

  .link::after {
    content: "";
    position: absolute;

    left: 0;
    bottom: -6px;

    width: 0%;
    height: 2px;

    background: var(--p1);
    box-shadow: 0 0 8px var(--glow);

    transition: width 0.3s ease;
  }

  .router-link-active::after {
    width: 100%;
  }
</style>