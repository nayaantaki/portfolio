document.addEventListener('DOMContentLoaded', async () => {
  const slug = document.body.dataset.caseStudy;
  if (!slug) return;

  const dataUrl = new URL('../../data/case-studies.json', window.location.href);

  let allCaseStudies;
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) return;
    allCaseStudies = await response.json();
  } catch (error) {
    console.error('Case study data load failed:', error);
    return;
  }

  const caseStudy = allCaseStudies[slug];
  if (!caseStudy) return;

  const titleEl = document.querySelector('[data-cs-title]');
  const overviewEl = document.querySelector('[data-cs-overview]');
  const secondaryTitleEl = document.querySelector('[data-cs-secondary-title]');
  const secondaryBodyEl = document.querySelector('[data-cs-secondary-body]');
  const toolsEl = document.querySelector('[data-cs-tools]');
  const mediaHost = document.querySelector('[data-cs-media]');

  const secondarySection = caseStudy.secondarySection || {
    title: 'process',
    body: caseStudy.process || ''
  };

  if (titleEl && caseStudy.title) titleEl.textContent = caseStudy.title;
  if (overviewEl && caseStudy.overview) overviewEl.textContent = caseStudy.overview;
  if (secondaryTitleEl && secondarySection.title) secondaryTitleEl.textContent = secondarySection.title;
  if (secondaryBodyEl && secondarySection.body) secondaryBodyEl.textContent = secondarySection.body;

  if (toolsEl) {
    const toolLines = document.createElement('div');
    toolLines.className = 'tool-lines';
    toolLines.setAttribute('aria-label', 'Software used');

    (caseStudy.tools || []).forEach((tool) => {
      const row = document.createElement('div');
      row.className = 'tool-line';

      if (tool.icon) {
        const icon = document.createElement('img');
        icon.className = 'tool-line-icon';
        icon.src = tool.icon;
        icon.alt = tool.alt || tool.name || 'Tool icon';
        row.appendChild(icon);
      }

      const label = document.createElement('span');
      label.className = 'tool-line-label';
      label.textContent = tool.name || '';
      row.appendChild(label);

      toolLines.appendChild(row);
    });

    toolsEl.innerHTML = '';
    toolsEl.appendChild(toolLines);
  }

  if (mediaHost) {
    let mediaItems = [];
    const stackItems = Array.isArray(caseStudy.videos)
      ? caseStudy.videos
      : (Array.isArray(caseStudy.media) ? caseStudy.media : []);

    if (Array.isArray(caseStudy.images)) {
      mediaItems = caseStudy.images;
    } else if (caseStudy.images && typeof caseStudy.images === 'object') {
      mediaItems = Object.entries(caseStudy.images).map(([slot, imageData]) => ({
        slot,
        ...(imageData || {})
      }));
    }

    const mediaLayout = caseStudy.mediaLayout || 'mosaic';

    const isPdfSource = (value) => (
      typeof value === 'string' && /\.pdf(?:$|[?#])/i.test(value.trim())
    );

    const isImageSource = (value) => (
      typeof value === 'string' && /\.(?:png|jpe?g|webp|gif|avif|svg)(?:$|[?#])/i.test(value.trim())
    );

    const resolveYouTubeId = (videoEntry) => {
      if (!videoEntry) return null;

      const readId = (value) => {
        if (!value || typeof value !== 'string') return null;
        const trimmed = value.trim();
        return /^[a-zA-Z0-9_-]{11}$/.test(trimmed) ? trimmed : null;
      };

      if (typeof videoEntry === 'string') {
        const directId = readId(videoEntry);
        if (directId) return directId;

        try {
          const url = new URL(videoEntry);
          if (url.hostname.includes('youtu.be')) {
            return readId(url.pathname.slice(1));
          }

          if (url.hostname.includes('youtube.com')) {
            const watchId = readId(url.searchParams.get('v'));
            if (watchId) return watchId;

            const pathParts = url.pathname.split('/').filter(Boolean);
            const embedIndex = pathParts.findIndex((part) => part === 'embed' || part === 'shorts');
            if (embedIndex >= 0 && pathParts[embedIndex + 1]) {
              return readId(pathParts[embedIndex + 1]);
            }
          }
        } catch (_error) {
          return null;
        }

        return null;
      }

      if (typeof videoEntry === 'object') {
        const byId = readId(videoEntry.videoId);
        if (byId) return byId;

        if (videoEntry.url && typeof videoEntry.url === 'string') {
          return resolveYouTubeId(videoEntry.url);
        }
      }

      return null;
    };

    const resolveStackEmbed = (entry, index) => {
      if (!entry) return null;

      if (typeof entry === 'string') {
        const trimmed = entry.trim();
        if (!trimmed) return null;

        if (isPdfSource(trimmed)) {
          return {
            type: 'pdf',
            src: trimmed,
            title: `Case study PDF ${index + 1}`
          };
        }

        if (isImageSource(trimmed)) {
          return {
            type: 'image',
            src: trimmed,
            alt: `Case study image ${index + 1}`
          };
        }

        const ytId = resolveYouTubeId(trimmed);
        if (!ytId) return null;
        return {
          type: 'youtube',
          src: `https://www.youtube-nocookie.com/embed/${ytId}`,
          title: `Case study video ${index + 1}`
        };
      }

      if (typeof entry === 'object') {
        const type = String(entry.type || '').toLowerCase();
        const source = typeof entry.url === 'string'
          ? entry.url.trim()
          : (typeof entry.src === 'string' ? entry.src.trim() : '');
        const title = entry.title || `Case study media ${index + 1}`;

        if ((type === 'pdf' || isPdfSource(source)) && source) {
          return {
            type: 'pdf',
            src: source,
            title
          };
        }

        if ((type === 'image' || isImageSource(source)) && source) {
          return {
            type: 'image',
            src: source,
            alt: entry.alt || title
          };
        }

        const ytId = resolveYouTubeId(entry);
        if (!ytId) return null;
        return {
          type: 'youtube',
          src: `https://www.youtube-nocookie.com/embed/${ytId}`,
          title
        };
      }

      return null;
    };

    const createMediaItem = (item, slotClass = '') => {
      if (!item || !item.src) return null;

      const mediaItem = document.createElement('div');
      mediaItem.className = 'case-study-media-item';
      if (slotClass) {
        mediaItem.classList.add(slotClass);
      }

      const img = document.createElement('img');
      img.className = 'media-img';
      img.src = item.src;
      img.alt = item.alt || '';

      mediaItem.appendChild(img);
      return mediaItem;
    };

    mediaHost.innerHTML = '';

    if (mediaLayout === 'media-stack-2' || mediaLayout === 'video-stack-2') {
      const mediaGrid = document.createElement('div');
      mediaGrid.className = 'case-study-media layout-media-stack-2';

      stackItems.slice(0, 2).forEach((entry, index) => {
        const embed = resolveStackEmbed(entry, index);
        if (!embed) return;

        const mediaItem = document.createElement('div');
        mediaItem.className = 'case-study-media-item media-stack-item';

        if (embed.type === 'image') {
          const img = document.createElement('img');
          img.className = 'media-img';
          img.src = embed.src;
          img.alt = embed.alt || `Case study image ${index + 1}`;

          mediaItem.appendChild(img);
          mediaGrid.appendChild(mediaItem);
          return;
        }

        const iframe = document.createElement('iframe');
        iframe.className = embed.type === 'pdf' ? 'media-pdf' : 'media-youtube';
        iframe.src = embed.src;
        iframe.title = embed.title;
        iframe.loading = 'lazy';

        if (embed.type === 'youtube') {
          iframe.allowFullscreen = true;
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        }

        mediaItem.appendChild(iframe);
        mediaGrid.appendChild(mediaItem);
      });

      mediaHost.appendChild(mediaGrid);
      return;
    }

    if (mediaLayout === 'mosaic') {
      const mediaGrid = document.createElement('div');
      mediaGrid.className = 'case-study-media layout-mosaic';

      const leftStack = document.createElement('div');
      leftStack.className = 'mosaic-left';

      const bottomRow = document.createElement('div');
      bottomRow.className = 'mosaic-bottom-row';

      const rightStack = document.createElement('div');
      rightStack.className = 'mosaic-right';

      const itemBySlot = Object.fromEntries(
        mediaItems
          .filter((item) => item && item.slot)
          .map((item) => [item.slot, item])
      );

      const feature = createMediaItem(itemBySlot.feature, 'slot-feature');
      const thumb1 = createMediaItem(itemBySlot.thumb1, 'slot-thumb1');
      const thumb2 = createMediaItem(itemBySlot.thumb2, 'slot-thumb2');
      const sideTop = createMediaItem(itemBySlot.sideTop, 'slot-sideTop');
      const sideTall = createMediaItem(itemBySlot.sideTall, 'slot-sideTall');

      if (feature) leftStack.appendChild(feature);
      if (thumb1) bottomRow.appendChild(thumb1);
      if (thumb2) bottomRow.appendChild(thumb2);
      if (bottomRow.childElementCount) leftStack.appendChild(bottomRow);
      if (sideTop) rightStack.appendChild(sideTop);
      if (sideTall) rightStack.appendChild(sideTall);

      if (leftStack.childElementCount) mediaGrid.appendChild(leftStack);
      if (rightStack.childElementCount) mediaGrid.appendChild(rightStack);

      mediaHost.appendChild(mediaGrid);
      return;
    }

    if (mediaLayout === 'mosaic-2') {
      const mediaGrid = document.createElement('div');
      mediaGrid.className = 'case-study-media layout-mosaic-2';

      const itemBySlot = Object.fromEntries(
        mediaItems
          .filter((item) => item && item.slot)
          .map((item) => [item.slot, item])
      );

      const topLeft = createMediaItem(itemBySlot.feature, 'slot-feature-main');
      const topRight = createMediaItem(itemBySlot.sideTall, 'slot-side-rail');
      const bottomFull = createMediaItem(itemBySlot.bottomWide, 'slot-bottom-strip');

      if (topLeft) mediaGrid.appendChild(topLeft);
      if (topRight) mediaGrid.appendChild(topRight);
      if (bottomFull) mediaGrid.appendChild(bottomFull);

      mediaHost.appendChild(mediaGrid);
      return;
    }

    const mediaGrid = document.createElement('div');
    mediaGrid.className = `case-study-media layout-${mediaLayout}`;

    mediaItems.forEach((item) => {
      const mediaItem = createMediaItem(item, item.slot ? `slot-${item.slot}` : '');
      if (mediaItem) {
        mediaGrid.appendChild(mediaItem);
      }
    });

    mediaHost.appendChild(mediaGrid);
  }
});
