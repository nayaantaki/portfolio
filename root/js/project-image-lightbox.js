document.addEventListener('DOMContentLoaded', () => {
  const mediaRoot = document.querySelector('.case-study-right');
  if (!mediaRoot) return;

  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.setAttribute('aria-hidden', 'true');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'image-lightbox-close';
  closeButton.setAttribute('aria-label', 'Close image preview');

  const closeIcon = document.createElement('img');
  closeIcon.className = 'image-lightbox-close-icon';
  closeIcon.src = '../../../assets/icons/close_small_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
  closeIcon.alt = '';
  closeIcon.setAttribute('aria-hidden', 'true');

  closeButton.appendChild(closeIcon);

  const fullImage = document.createElement('img');
  fullImage.className = 'image-lightbox-img';
  fullImage.alt = '';

  overlay.appendChild(closeButton);
  overlay.appendChild(fullImage);
  document.body.appendChild(overlay);

  const openLightbox = (src, altText) => {
    fullImage.src = src;
    fullImage.alt = altText || 'Expanded project image';
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };

  const closeLightbox = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    fullImage.src = '';
  };

  mediaRoot.addEventListener('click', (event) => {
    const image = event.target.closest('.media-img');
    if (!image || !image.src) return;
    openLightbox(image.currentSrc || image.src, image.alt);
  });

  closeButton.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeLightbox();
    }
  });
});
