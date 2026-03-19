// Theme Toggle
(function() {
  const html = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  // Check for saved theme preference or default to dark
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    
    // Optional: Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    
    return 'dark';
  }

  // Apply theme
  function setTheme(theme) {
    if (theme === 'light') {
      html.setAttribute('data-theme', 'light');
    } else {
      html.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');

    // Initialize theme on page load
    setTheme(getInitialTheme());

    // Add click listener
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
  });
})();
