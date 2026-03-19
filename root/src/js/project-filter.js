const filterLinks = Array.from(document.querySelectorAll('.home-project-link[data-filter]'));
const snapshotCards = Array.from(document.querySelectorAll('.snapshot-card[data-categories]'));
const snapshotTags = Array.from(document.querySelectorAll('.snapshot-tag[data-category]'));

if (filterLinks.length && snapshotCards.length) {
  let activeFilter = null;

  const normalize = (value) => value.trim().toLowerCase();

  const applyFilter = () => {
    snapshotCards.forEach((card) => {
      const raw = card.dataset.categories || '';
      const categories = raw.split(',').map(normalize).filter(Boolean);
      const shouldShow = !activeFilter || categories.includes(activeFilter);

      card.classList.toggle('is-filter-hidden', !shouldShow);
    });

    filterLinks.forEach((link) => {
      const isActive = normalize(link.dataset.filter || '') === activeFilter;
      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-pressed', String(isActive));
    });

    snapshotTags.forEach((tag) => {
      const isHighlighted = normalize(tag.dataset.category || '') === activeFilter;
      tag.classList.toggle('is-highlighted', isHighlighted);
    });
  };

  filterLinks.forEach((link) => {
    link.setAttribute('role', 'button');
    link.setAttribute('aria-pressed', 'false');

    link.addEventListener('click', (event) => {
      event.preventDefault();

      const clickedFilter = normalize(link.dataset.filter || '');
      activeFilter = activeFilter === clickedFilter ? null : clickedFilter;
      applyFilter();
    });
  });

  applyFilter();
}
