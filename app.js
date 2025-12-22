// Homepage interactions

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

let originalPositions = {};

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

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'link');
  card.dataset.id = project.id;
  card.dataset.url = project.url;
  card.dataset.x = project.position.x;
  card.dataset.y = project.position.y;
  card.dataset.rotation = project.position.rotation;

  card.innerHTML = `
    <time datetime="${project.date}">${project.date}</time>
    <h2>${project.title}</h2>
    <p class="description">${project.description}</p>
  `;

  return card;
}

function initializeCards(cards, workspace) {
  const storedPositions = loadPositionsFromStorage();

  cards.forEach((card) => {
    const cardId = card.dataset.id;

    // Store original position
    originalPositions[cardId] = {
      x: parseFloat(card.dataset.x) || 0,
      y: parseFloat(card.dataset.y) || 0
    };

    // Apply position (stored or original)
    const stored = storedPositions[cardId];
    const x = stored ? stored.x : originalPositions[cardId].x;
    const y = stored ? stored.y : originalPositions[cardId].y;
    const rotation = parseFloat(card.dataset.rotation) || 0;

    card.style.left = x + '%';
    card.style.top = y + '%';
    card.style.setProperty('--rotation', rotation + 'deg');

    // Drag listener
    card.addEventListener('pointerdown', onCardPointerDown);

    // Click to open URL
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A' && !dragState.moved) {
        window.open(card.dataset.url, '_blank');
      }
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.open(card.dataset.url, '_blank');
      }
    });
  });

  // Global drag handlers
  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);
}

function initializeReset(resetTrigger, cards) {
  if (!resetTrigger) return;

  resetTrigger.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);

    cards.forEach((card) => {
      const cardId = card.dataset.id;
      const original = originalPositions[cardId];
      card.style.left = original.x + '%';
      card.style.top = original.y + '%';
    });
  });
}

function initializeModal() {
  const aboutTrigger = document.querySelector('.about-trigger');
  const aboutModal = document.querySelector('.about-modal');
  const modalClose = document.querySelector('.modal-close');

  if (!aboutTrigger || !aboutModal) return;

  aboutTrigger.addEventListener('click', () => aboutModal.showModal());
  modalClose.addEventListener('click', () => aboutModal.close());
  aboutModal.addEventListener('click', (e) => {
    if (e.target === aboutModal) aboutModal.close();
  });
}

function renderAbout(aboutData) {
  const modalContent = document.querySelector('.modal-content');
  if (!modalContent || !aboutData.content) return;

  modalContent.innerHTML = `<p>${aboutData.content}</p>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  initializeModal();

  const workspace = document.querySelector('.workspace');
  const resetTrigger = document.querySelector('.reset-trigger');

  // Fetch project data
  const response = await fetch('data.json');
  const data = await response.json();

  // Render about content
  if (data.about) {
    renderAbout(data.about);
  }

  // Render project cards
  data.projects.forEach((project) => {
    const card = createProjectCard(project);
    workspace.appendChild(card);
  });

  const cards = document.querySelectorAll('.project-card');

  if (workspace && cards.length > 0 && !isMobileLayout()) {
    initializeCards(cards, workspace);
    initializeReset(resetTrigger, cards);
  }
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

    savePositionToStorage(card.dataset.id, percentX.toFixed(1), percentY.toFixed(1));
  }

  card.style.zIndex = '';
  card.style.cursor = '';

  dragState.card = null;
  dragState.offsetX = 0;
  dragState.offsetY = 0;
  setTimeout(() => { dragState.moved = false; }, 0);
}
