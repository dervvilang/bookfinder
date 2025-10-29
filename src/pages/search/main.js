import '../../shared/style.css';
import { fetchJSON } from '../../shared/fetcher.js';

const form = document.getElementById('book-form');
const input = document.getElementById('query');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) return;

  resultsEl.innerHTML = '';
  setStatus('Загрузка…');

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=24`;
    const data = await fetchJSON(url);

    if (!data.docs || data.docs.length === 0) {
      setStatus('Ничего не найдено.');
      return;
    }

    setStatus(`Найдено: ${data.numFound.toLocaleString('ru-RU')}`);
    renderBooks(data.docs);
  } catch (err) {
    setStatus(`Ошибка: ${err.message}`, true);
  }
});

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

function coverUrl(doc) {
  return doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : null;
}

function renderBooks(docs) {
  const frag = document.createDocumentFragment();

  docs.forEach((d) => {
    const el = document.createElement('article');
    el.className = 'book';

    const img = document.createElement('img');
    const imgUrl = coverUrl(d);
    if (imgUrl) {
      img.src = imgUrl;
      img.alt = d.title;
    } else {
      img.alt = 'Обложка отсутствует';
      img.style.background = '#0b0c10';
      img.style.height = '280px';
    }

    const meta = document.createElement('div');
    meta.className = 'meta';

    const h3 = document.createElement('h3');
    h3.textContent = d.title ?? 'Без названия';

    const author = document.createElement('p');
    author.textContent = (d.author_name && d.author_name.length)
      ? `Автор: ${d.author_name.slice(0, 2).join(', ')}`
      : 'Автор неизвестен';

    const year = document.createElement('p');
    year.textContent = d.first_publish_year ? `Год: ${d.first_publish_year}` : 'Год неизвестен';

    meta.append(h3, author, year);
    el.append(img, meta);

    frag.append(el);
  });

  resultsEl.innerHTML = '';
  resultsEl.append(frag);
}

console.info('Search page ready.');
