document.addEventListener('DOMContentLoaded', () => {
  const mounts = document.querySelectorAll('[data-site-nav]');
  if (!mounts.length) return;

  mounts.forEach((mount) => {
    const assetsPrefix = mount.getAttribute('data-assets-prefix') || '../../assets';
    const homeHref = mount.getAttribute('data-home-href') || '../index.html';
    const homeLabel = mount.getAttribute('data-home-label') || 'NoA';

    mount.innerHTML = `
      <nav>
        <a href="${homeHref}" class="nav-logo">${homeLabel}</a>
        <div class="nav-links">
          <div class="home-icon-links">
            <a href="https://github.com/nayaantaki" class="home-icon-link github" aria-label="GitHub">
              <img src="${assetsPrefix}/icons/nav/Octicons-mark-github.svg" alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/nayaoantaki/" class="home-icon-link" aria-label="LinkedIn">
              <img src="${assetsPrefix}/icons/nav/LinkedIn_icon.svg" alt="LinkedIn" />
            </a>
            <a href="mailto:antaki.n@northeastern.edu" class="home-icon-link" aria-label="Northeastern University">
              <img src="${assetsPrefix}/icons/nav/NU_RGB_monogram_R.png" alt="Northeastern University" />
            </a>
          </div>
          <a href="${assetsPrefix}/Naya_Antaki_-_Resume.pdf" class="home-link" target="_blank" rel="noopener noreferrer">
            résumé
            <img src="${assetsPrefix}/icons/nav/description_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg" alt="Document" />
          </a>
          <button id="themeToggle" class="theme-toggle" aria-label="Toggle theme">
            <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
        </div>
      </nav>
    `;
  });
});
