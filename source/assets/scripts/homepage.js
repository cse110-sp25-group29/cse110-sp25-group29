document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    toggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-theme');

      toggleBtn.textContent = body.classList.contains('dark-theme') ? '🔆' : '🌙';
    });
});