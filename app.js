// Homepage interactions

// Drag state management
const dragState = {
  card: null,
  offsetX: 0,
  offsetY: 0,
  startX: 0,
  startY: 0,
  moved: false
};

const DRAG_THRESHOLD = 5;
const STORAGE_KEY = 'mg3_card_positions';

function isMobileLayout() {
  return window.matchMedia('(max-width: 768px)').matches;
}

function loadPositionsFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    return {};
  }
}

function savePositionToStorage(cardId, x, y) {
  try {
    const positions = loadPositionsFromStorage();
    positions[cardId] = { x, y };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
  } catch (e) {
    // Fail silently
  }
}

function getCardId(card) {
  return card.dataset.id || card.id || Array.from(card.parentNode.children).indexOf(card);
}

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

  // Card positioning from data attributes and storage
  const cards = document.querySelectorAll('.project-card');
  const workspace = document.querySelector('.workspace');

  if (workspace && cards.length > 0 && !isMobileLayout()) {
    const storedPositions = loadPositionsFromStorage();

    cards.forEach((card) => {
      const cardId = getCardId(card);

      // Prefer stored position, fall back to data attributes
      const stored = storedPositions[cardId];
      const x = stored ? stored.x : (parseFloat(card.dataset.x) || 0);
      const y = stored ? stored.y : (parseFloat(card.dataset.y) || 0);
      const rotation = parseFloat(card.dataset.rotation) || 0;

      card.style.left = x + '%';
      card.style.top = y + '%';
      card.style.setProperty('--rotation', rotation + 'deg');
    });

    // Initialize drag listeners on each card
    cards.forEach((card) => {
      card.addEventListener('pointerdown', onCardPointerDown);
    });

    // Global drag handlers
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }

  // Card click to open URL
  cards.forEach((card) => {
    const url = card.dataset.url;
    if (url) {
      card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A' && !dragState.moved) {
          window.open(url, '_blank');
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.open(url, '_blank');
        }
      });
    }
  });
});

function onCardPointerDown(e) {
  if (dragState.card) return;

  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();

  dragState.card = card;
  dragState.offsetX = e.clientX - rect.left;
  dragState.offsetY = e.clientY - rect.top;
  dragState.startX = e.clientX;
  dragState.startY = e.clientY;
  dragState.moved = false;

  card.style.zIndex = '100';
  card.style.cursor = 'grabbing';
}

function onPointerMove(e) {
  if (!dragState.card) return;

  const card = dragState.card;
  const workspace = document.querySelector('.workspace');

  const distX = e.clientX - dragState.startX;
  const distY = e.clientY - dragState.startY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  if (distance > DRAG_THRESHOLD) {
    dragState.moved = true;
  }

  let newX = e.clientX - dragState.offsetX;
  let newY = e.clientY - dragState.offsetY;

  newX = Math.max(0, Math.min(newX, workspace.clientWidth - card.offsetWidth));
  newY = Math.max(0, Math.min(newY, workspace.clientHeight - card.offsetHeight));

  card.style.left = newX + 'px';
  card.style.top = newY + 'px';
}

function onPointerUp(e) {
  if (!dragState.card) return;

  const card = dragState.card;
  const workspace = document.querySelector('.workspace');

  if (dragState.moved) {
    const percentX = (card.offsetLeft / workspace.clientWidth) * 100;
    const percentY = (card.offsetTop / workspace.clientHeight) * 100;

    card.dataset.x = percentX.toFixed(1);
    card.dataset.y = percentY.toFixed(1);

    // Save to localStorage
    const cardId = getCardId(card);
    savePositionToStorage(cardId, percentX.toFixed(1), percentY.toFixed(1));
  }

  card.style.zIndex = '';
  card.style.cursor = '';

  dragState.card = null;
  dragState.offsetX = 0;
  dragState.offsetY = 0;
  // Delay reset so click handler can check the moved flag
  setTimeout(() => { dragState.moved = false; }, 0);
}
