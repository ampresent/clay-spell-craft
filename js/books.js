/**
 * books.js — In-game book collection and reading system
 */
const Books = (() => {
  const collected = new Set();
  const readingPanel = document.createElement('div');

  function init() {
    // Create reading panel DOM
    readingPanel.id = 'book-reading-panel';
    readingPanel.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(10,8,16,0.92);z-index:200;
      display:none;overflow-y:auto;
      font-family:'Noto Serif SC',Georgia,serif;
    `;
    readingPanel.innerHTML = `
      <div style="max-width:600px;margin:40px auto;padding:30px;background:#1a1520;border:1px solid #3a2a4a;border-radius:8px;">
        <div id="book-header" style="text-align:center;margin-bottom:20px;">
          <div id="book-rarity" style="font-size:0.75rem;color:#8a7a6a;margin-bottom:4px;"></div>
          <h2 id="book-title" style="color:#e8c87a;font-size:1.4rem;margin:0 0 8px;"></h2>
          <div id="book-category" style="font-size:0.8rem;color:#6a8aaa;"></div>
        </div>
        <div id="book-content" style="color:#c8b8a8;line-height:1.9;font-size:0.95rem;white-space:pre-wrap;"></div>
        <div style="text-align:center;margin-top:30px;">
          <button id="book-close-btn" style="background:#2a2030;color:#e8c87a;border:1px solid #4a3a5a;padding:8px 24px;border-radius:4px;cursor:pointer;font-size:0.9rem;">
            合上书本 ✕
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(readingPanel);
    document.getElementById('book-close-btn').addEventListener('click', close);

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && readingPanel.style.display === 'block') {
        close();
      }
    });
  }

  function collect(bookId) {
    if (collected.has(bookId)) return false;
    collected.add(bookId);
    const book = Lore.getBook(bookId);
    if (book) {
      Notify.success(`📖 获得书籍：${book.title}`);
      AudioSystem.playSFX('quest');
    }
    return true;
  }

  function read(bookId) {
    const book = Lore.getBook(bookId);
    if (!book) return;

    const rarityColors = { common: '#8a8a8a', uncommon: '#4a8aaa', rare: '#aa8aff', legendary: '#ffaa44' };
    const rarityNames = { common: '普通', uncommon: '优良', rare: '稀有', legendary: '传说' };

    document.getElementById('book-title').textContent = book.title;
    document.getElementById('book-category').textContent = `📜 ${book.category}`;
    document.getElementById('book-rarity').textContent = `${rarityNames[book.rarity] || '普通'} | 发现于：${book.location}`;
    document.getElementById('book-rarity').style.color = rarityColors[book.rarity] || '#8a8a8a';
    document.getElementById('book-content').textContent = book.text;
    readingPanel.style.display = 'block';
    AudioSystem.playSFX('click');
  }

  function close() {
    readingPanel.style.display = 'none';
  }

  function isOpen() {
    return readingPanel.style.display === 'block';
  }

  function hasCollected(bookId) {
    return collected.has(bookId);
  }

  function getCollectedCount() {
    return collected.size;
  }

  function getAllCollected() {
    return [...collected];
  }

  function renderLibrary() {
    const container = document.getElementById('book-list');
    if (!container) return;
    container.innerHTML = '';

    Lore.BOOKS.forEach(book => {
      const isCollected = collected.has(book.id);
      const rarityColors = { common: '#8a8a8a', uncommon: '#4a8aaa', rare: '#aa8aff', legendary: '#ffaa44' };
      const div = document.createElement('div');
      div.style.cssText = `padding:8px 12px;margin:4px 0;border-radius:4px;cursor:pointer;${isCollected ? 'background:#1a1520;' : 'background:#0a0810;opacity:0.5;'}border:1px solid ${isCollected ? (rarityColors[book.rarity] || '#333') : '#222'};`;
      div.innerHTML = `
        <div style="color:${isCollected ? '#e8c87a' : '#555'};font-weight:bold;">${isCollected ? book.title : '??? 未发现的书籍'}</div>
        ${isCollected ? `<div style="color:#8a7a6a;font-size:0.75rem;margin-top:2px;">${book.category} · ${book.location}</div>` : ''}
      `;
      if (isCollected) {
        div.addEventListener('click', () => read(book.id));
      }
      container.appendChild(div);
    });
  }

  return { init, collect, read, close, isOpen, hasCollected, getCollectedCount, getAllCollected, renderLibrary };
})();
