// Homepage interactions

document.addEventListener('DOMContentLoaded', () => {
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
});
