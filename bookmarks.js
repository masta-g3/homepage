// Bookmarks page interactions

const state = {
  bookmarks: [],
  filter: 'all',
  offset: 0,
  limit: 20,
  total: 0,
  loading: false
};

async function fetchBookmarks(reset = false) {
  if (state.loading) return;

  const page = document.querySelector('.bookmarks-page');
  state.loading = true;
  page.classList.add('loading');
  page.classList.remove('empty');

  if (reset) {
    state.offset = 0;
    state.bookmarks = [];
  }

  const params = new URLSearchParams({
    limit: state.limit,
    offset: state.offset
  });

  if (state.filter !== 'all') {
    params.set('filter', state.filter);
  }

  const response = await fetch(`/api/bookmarks?${params}`);
  const { data, total } = await response.json();

  if (reset) {
    state.bookmarks = data;
  } else {
    state.bookmarks.push(...data);
  }

  state.total = total;
  state.offset += data.length;
  state.loading = false;

  page.classList.remove('loading');

  if (state.bookmarks.length === 0) {
    page.classList.add('empty');
  }

  render();
}

function createBookmarkCard(bookmark) {
  const card = document.createElement('article');
  card.className = `bookmark-card ${bookmark.read_at ? 'read' : 'unread'}`;
  card.dataset.id = bookmark.x_id;
  card.tabIndex = 0;
  card.setAttribute('role', 'link');

  const timeAgo = formatTimeAgo(bookmark.created_at);
  const isProfilePic = bookmark.thumbnail_url?.includes('/profile_images/');
  const showThumbnail = bookmark.thumbnail_url && !isProfilePic;

  let thumbnailHtml = '';
  if (showThumbnail) {
    thumbnailHtml = `
      <figure class="card-thumbnail">
        <img src="${bookmark.thumbnail_url}" alt="" loading="lazy">
      </figure>
    `;
  }

  card.innerHTML = `
    ${thumbnailHtml}
    <h2 class="card-title">${bookmark.title}</h2>
    ${bookmark.description ? `<p class="card-description">${bookmark.description}</p>` : ''}
    <footer class="card-meta">
      ${bookmark.author ? `<span class="card-author">${bookmark.author}</span>` : ''}
      <span class="card-type">${bookmark.source_type}</span>
      <time datetime="${bookmark.created_at}">${timeAgo}</time>
    </footer>
  `;

  card.addEventListener('click', () => openBookmark(bookmark, card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBookmark(bookmark, card);
    }
  });

  const img = card.querySelector('img');
  if (img) {
    img.addEventListener('error', () => {
      img.parentElement.style.display = 'none';
    });
  }

  return card;
}

async function openBookmark(bookmark, card) {
  window.open(bookmark.url, '_blank');

  if (!bookmark.read_at) {
    await fetch(`/api/bookmarks/${bookmark.x_id}/read`, { method: 'POST' });
    bookmark.read_at = new Date().toISOString();
    card.classList.remove('unread');
    card.classList.add('read');
  }
}

function render() {
  const grid = document.querySelector('.bookmarks-grid');
  grid.innerHTML = '';

  state.bookmarks.forEach(bookmark => {
    grid.appendChild(createBookmarkCard(bookmark));
  });

  const loadMoreContainer = document.querySelector('.load-more-container');
  if (state.offset >= state.total) {
    loadMoreContainer.classList.add('hidden');
  } else {
    loadMoreContainer.classList.remove('hidden');
  }
}

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

document.addEventListener('DOMContentLoaded', () => {
  initializeModal();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      fetchBookmarks(true);
    });
  });

  // Load more
  document.querySelector('.load-more').addEventListener('click', () => {
    fetchBookmarks(false);
  });

  // Initial load
  fetchBookmarks(true);
});
