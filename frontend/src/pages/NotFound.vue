<!-- Motheo Morena u24666981 -->

<template>
  <div class="not-found">

    <h1>404</h1>
    <h2>Page Not Found</h2>

    <p>The page you are looking for does not exist.</p>

    <RouterLink to="/" class="home-btn">
      Go back Home
    </RouterLink>

  </div>
</template>

<style scoped>
  .not-found {
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-family: Arial, sans-serif;

    background: #f9fafb;
    color: #1f2937;
  }

  h1 {
    font-size: 6rem;
    margin: 0;

    background: linear-gradient(135deg, #8b5cf6, #c084fc);
  }

  h2 {
    margin: 10px 0;
    color: #111827;
  }

  p {
    color: #6b7280;
    margin-bottom: 20px;
  }

  .home-btn {
    padding: 10px 20px;
    background: linear-gradient(135deg, #8b5cf6, #c084fc);
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;

    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
    transition: all 0.25s ease;
  }

  .home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 18px rgba(139, 92, 246, 0.35);
  }

  .viewer {
    background: var(--p5);
    color: var(--text);
  }

  .monaco-editor {
    border: 1px solid var(--border);
  }

  .save-btn, .transform-btn {
    border: 1px solid var(--p2);
    color: var(--p1);
  }

  .save-btn:hover, .transform-btn:hover {
    background: var(--p2);
    box-shadow: 0 0 20px var(--glow);
  }
</style>