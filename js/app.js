/**
 * DINO WIKI — JavaScript Principal
 * Parsează fișierul XML și construiește enciclopedia dinamic
 */

// ===== STATE =====
let allDinosaurs = [];
let currentFilter = 'all';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadDinosaurData();
  setupEventListeners();
});

// ===== LOAD & PARSE XML =====
async function loadDinosaurData() {
  try {
    const response = await fetch('xml/dinosaurs.xml');
    if (!response.ok) throw new Error('Nu s-a putut încărca XML-ul');

    const xmlText = await response.text();
    const parser  = new DOMParser();
    const xmlDoc  = parser.parseFromString(xmlText, 'application/xml');

    // Verificăm erori de parsare
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) throw new Error('Eroare la parsarea XML');

    // Extragem datele din XML
    const dinoNodes = xmlDoc.querySelectorAll('dinosaur');

    allDinosaurs = Array.from(dinoNodes).map(node => ({
      id:          node.getAttribute('id'),
      name:        getText(node, 'name'),
      period:      getText(node, 'period'),
      years:       getText(node, 'years'),
      diet:        getText(node, 'diet'),
      length:      getText(node, 'length'),
      weight:      getText(node, 'weight'),
      region:      getText(node, 'region'),
      description: getText(node, 'description'),
      funFact:     getText(node, 'fun_fact'),
      emoji:       getText(node, 'emoji'),
      color:       getText(node, 'color'),
      image:       getText(node, 'image'), // optional image tag in XML
    }));

    // Actualizăm statisticile din header
    document.getElementById('dinoCount').textContent = allDinosaurs.length;
    document.getElementById('eraCount').textContent  = new Set(allDinosaurs.map(d => d.period)).size;

    // Ascundem loading, afișăm grid
    document.getElementById('loadingMsg').style.display = 'none';
    renderGrid(allDinosaurs);

  } catch (err) {
    console.error('Eroare la încărcarea datelor:', err);
    document.getElementById('loadingMsg').textContent =
      '⚠ Eroare la încărcarea enciclopediei. Verificați că fișierul XML există.';
  }
}

// Helper: extrage textul unui tag din XML
function getText(node, tag) {
  const el = node.querySelector(tag);
  return el ? el.textContent.trim() : '';
}

// ===== RENDER GRID =====
function renderGrid(dinos) {
  const grid = document.getElementById('dinoGrid');
  grid.innerHTML = '';

  if (dinos.length === 0) {
    grid.innerHTML = '<div class="no-results">🦕 Niciun dinozaur nu a supraviețuit acestei căutări...</div>';
    return;
  }

  dinos.forEach((dino, index) => {
    const card = createCard(dino, index);
    grid.appendChild(card);
  });

  // After rendering attempt to verify images and fallback on errors
  verifyImages();
}

// Verify that background image URLs are reachable; on error replace with emoji fallback
function verifyImages() {
  document.querySelectorAll('.dino-image').forEach(el => {
    const bg = el.style.backgroundImage || '';
    const m = bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
    if (!m) return;
    const url = m[1];
    const img = new Image();
    img.onload = () => { /* image OK */ };
    img.onerror = () => {
      const emoji = document.createElement('span');
      emoji.className = 'dino-emoji';
      // use data-emoji fallback if provided
      const fallbackEmoji = el.dataset && el.dataset.emoji ? el.dataset.emoji : '🦕';
      emoji.textContent = fallbackEmoji;
      el.replaceWith(emoji);
    };
    img.src = url;
  });
}

// ===== CREATE CARD =====
function createCard(dino, index) {
  const card = document.createElement('article');
  card.className = 'dino-card';
  card.style.animationDelay = `${index * 0.07}s`;

  const dietClass  = dino.diet.toLowerCase().includes('carnivor') ? 'diet-carnivor' : 'diet-ierbivor';
  const shortDesc  = dino.description.length > 200
    ? dino.description.substring(0, 200) + '…'
    : dino.description;

  // Build header image (use image if available, otherwise fallback to images/{id}.jpg, then emoji)
  let visualHTML = '';
  // prefer explicit image tag, otherwise try images/{id}.jpg; attach data-emoji for fallback
  const inferredImage = dino.image ? dino.image.replace(/'/g, "%27") : `images/${dino.id}.jpg`;
  visualHTML = `<span class="dino-image" style="background-image: url('${inferredImage}')" aria-hidden="true" data-emoji="${dino.emoji || '🦕'}"></span>`;

  card.innerHTML = `
    <div class="card-inner">
      <div class="card-header">
        ${visualHTML}
        <div class="card-title-group">
          <h2 class="dino-name">${dino.name}</h2>
          <span class="dino-period">${dino.period}</span><br>
          <span class="dino-diet-badge ${dietClass}">${dino.diet}</span>
        </div>
      </div>
      <div class="card-separator"></div>
      <p class="dino-description">${shortDesc}</p>
      <div class="card-stats">
        <div class="stat-item">
          <span class="stat-label">Lungime</span>
          <span class="stat-value">${dino.length}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Greutate</span>
          <span class="stat-value">${dino.weight}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Regiune</span>
          <span class="stat-value">${dino.region.split(',')[0]}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Epocă</span>
          <span class="stat-value">${dino.years.split('–')[0]}M ani</span>
        </div>
      </div>
      <p class="card-cta">✦ Click pentru mai multe detalii ✦</p>
    </div>
  `;

  card.addEventListener('click', () => openModal(dino));
  return card;
}

// ===== MODAL =====
function openModal(dino) {
  const overlay = document.getElementById('modalOverlay');
  const content = document.getElementById('modalContent');

  const dietClass = dino.diet.toLowerCase().includes('carnivor') ? 'diet-carnivor' : 'diet-ierbivor';

  // modal visual (image or emoji)
  let modalVisual = '';
  // prefer explicit image tag, otherwise try images/{id}.jpg; attach data-emoji for fallback
  const inferredModal = dino.image ? dino.image.replace(/'/g, "%27") : `images/${dino.id}.jpg`;

  // Adjust vertical positioning for specific dinos so the head is visible in the hero area
  // default: center 50%
  let heroPosY = '50%';
  if (dino.id === 'trex') {
    // T. Rex photos often have the head near the top — align image toward the top so the head appears inside the hero
    // use a slightly lower offset so the head is more centered in the hero
    heroPosY = '25%';
  } else if (dino.id === 'brachiosaurus') {
    // Brachiosaurus has a very tall neck — nudge image a bit to show the head
    // show more of the upper body/neck
    heroPosY = '10%';
  }

  // apply the computed background-position inline so each modal can vary independently
  modalVisual = `<span class="modal-emoji" style="background-image: url('${inferredModal}'); background-position: center ${heroPosY};" aria-hidden="true" data-emoji="${dino.emoji || '🦕'}" data-id="${dino.id}"></span>`;

  // hero image (full-width background at top of modal)
  const modalHeroHTML = `<div class="modal-hero" style="background-image: url('${inferredModal}'); background-position: center ${heroPosY};" data-emoji="${dino.emoji || '🦕'}" data-id="${dino.id}"></div>`;

  content.innerHTML = `
    ${modalHeroHTML}
    <button class="modal-close" id="modalClose" aria-label="Închide">✕</button>
    <div class="modal-header">
      ${modalVisual}
      <div class="modal-title-block">
        <h2 class="modal-dino-name">${dino.name}</h2>
        <div class="modal-badges">
          <span class="dino-period">${dino.period}</span>
          <span class="dino-diet-badge ${dietClass}">${dino.diet}</span>
        </div>
      </div>
    </div>

    <div class="modal-divider"></div>

    <div class="modal-stats-grid">
      <div class="modal-stat">
        <div class="modal-stat-label">Lungime</div>
        <div class="modal-stat-value">${dino.length}</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">Greutate</div>
        <div class="modal-stat-value">${dino.weight}</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">Regiune</div>
        <div class="modal-stat-value">${dino.region}</div>
      </div>
      <div class="modal-stat">
        <div class="modal-stat-label">Perioadă</div>
        <div class="modal-stat-value">${dino.years}</div>
      </div>
      <div class="modal-stat" style="grid-column: 2 / 4;">
        <div class="modal-stat-label">Epocă Geologică</div>
        <div class="modal-stat-value">${dino.period}</div>
      </div>
    </div>

    <p class="modal-description">${dino.description}</p>

    <div class="fun-fact-box">
      <div class="fun-fact-label">💡 Faptul Zilei</div>
      <p class="fun-fact-text">${dino.funFact}</p>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('modalClose').addEventListener('click', closeModal);

  // After layout, compute hero height up to the divider and verify images
  // Use setTimeout to wait for layout/paint
  setTimeout(() => {
    const hero = content.querySelector('.modal-hero');
    const divider = content.querySelector('.modal-divider');
    if (hero && divider) {
      const contentRect = content.getBoundingClientRect();
      const dividerRect = divider.getBoundingClientRect();
      // height from top of content to top of divider (leave small overlap)
      const heroHeight = Math.max(100, dividerRect.top - contentRect.top + 8);
      hero.style.setProperty('--modal-hero-height', `${heroHeight}px`);
      hero.style.height = `${heroHeight}px`;
    }
    // verify both hero and modal-emoji images
    verifyModalImage();
  }, 40);
}

// call verifyModalImage when modal opens by hooking into mutation (or call directly in openModal)
// We will call it directly after injecting modal content
// when opening a modal, verify its background image immediately and fallback to emoji if it fails
function verifyModalImage() {
  // check modal-emoji
  const el = document.querySelector('.modal-emoji');
  if (el) {
    const bg = el.style.backgroundImage || '';
    const m = bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
    if (m) {
      const url = m[1];
      const img = new Image();
      img.onload = () => { /* ok */ };
      img.onerror = () => {
        const fallback = document.createElement('span');
        fallback.className = 'modal-emoji fallback';
        const fallbackEmoji = el.dataset && el.dataset.emoji ? el.dataset.emoji : '🦕';
        fallback.textContent = fallbackEmoji;
        el.replaceWith(fallback);
      };
      img.src = url;
    }
  }

  // check hero image
  const hero = document.querySelector('.modal-hero');
  if (hero) {
    const bg2 = hero.style.backgroundImage || '';
    const m2 = bg2.match(/url\((?:"|')?(.*?)(?:"|')?\)/);
    if (m2) {
      const url2 = m2[1];
      const img2 = new Image();
      img2.onload = () => { /* ok */ };
      img2.onerror = () => {
        // if hero fails, remove it so content shows normally
        hero.remove();
      };
      img2.src = url2;
    }
  }
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Căutare live
  document.getElementById('searchInput').addEventListener('input', filterDinos);

  // Filtre perioadă
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      filterDinos();
    });
  });

  // Închide modal la click pe overlay
  document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Închide modal cu ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ===== FILTER & SEARCH =====
function filterDinos() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

  let filtered = allDinosaurs;

  // Filtrare după perioadă
  if (currentFilter !== 'all') {
    filtered = filtered.filter(d => d.period.toLowerCase() === currentFilter.toLowerCase());
  }

  // Filtrare după text
  if (searchTerm) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchTerm) ||
      d.description.toLowerCase().includes(searchTerm) ||
      d.diet.toLowerCase().includes(searchTerm) ||
      d.region.toLowerCase().includes(searchTerm)
    );
  }

  renderGrid(filtered);
}
