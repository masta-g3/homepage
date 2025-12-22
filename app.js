// Homepage interactions

document.addEventListener('DOMContentLoaded', () => {
  // Modal interactions
  const aboutTrigger = document.querySelector('.about-trigger');
  const aboutModal = document.querySelector('.about-modal');
  const modalClose = document.querySelector('.modal-close');

  if (aboutTrigger && aboutModal) {
    aboutTrigger.addEventListener('click', () => {
      aboutModal.showModal();
    });

    modalClose.addEventListener('click', () => {
      aboutModal.close();
    });

    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) {
        aboutModal.close();
      }
    });
  }

  // Card positioning from data attributes
  const cards = document.querySelectorAll('.project-card');
  const workspace = document.querySelector('.workspace');

  if (workspace && cards.length > 0) {
    cards.forEach((card) => {
      const x = parseFloat(card.dataset.x) || 0;
      const y = parseFloat(card.dataset.y) || 0;
      const rotation = parseFloat(card.dataset.rotation) || 0;

      card.style.left = x + '%';
      card.style.top = y + '%';
      card.style.setProperty('--rotation', rotation + 'deg');
    });
  }

  // Card click to open URL
  cards.forEach((card) => {
    const url = card.dataset.url;
    if (url) {
      card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          window.open(url, '_blank');
        }
      });
    }
  });
});
