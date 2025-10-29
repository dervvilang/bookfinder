import './style.css';
import { fetchJSON } from './fetcher.js';

const form = document.getElementById('fx-form');
const amountInput = document.getElementById('amount');
const fromSel = document.getElementById('from');
const toSel = document.getElementById('to');
const statusEl = document.getElementById('fx-status');
const resultEl = document.getElementById('fx-result');

init();

async function init() {
  setStatus('Загрузка списка валют…');
  try {
    const currencies = await fetchJSON('https://api.frankfurter.app/currencies');
    const entries = Object.entries(currencies).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [code, name] of entries) {
      fromSel.append(new Option(`${code} — ${name}`, code));
      toSel.append(new Option(`${code} — ${name}`, code));
    }
    fromSel.value = 'EUR';
    toSel.value = 'USD';
    setStatus('Готово.');
    convert();
  } catch (e) {
    setStatus(`Ошибка: ${e.message}`, true);
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  convert();
});

async function convert() {
  const amount = Number(amountInput.value);
  const from = fromSel.value;
  const to = toSel.value;

  if (!Number.isFinite(amount) || amount < 0) {
    setStatus('Введите корректную сумму (0 и больше).', true);
    return;
  }
  if (from === to) {
    resultEl.innerHTML = `<p class="result-block">Результат: ${amount.toFixed(2)} ${to}</p>`;
    setStatus('Одинаковые валюты.');
    return;
  }

  setStatus('Конвертация…');

  try {
    const url = `https://api.frankfurter.app/latest?amount=${encodeURIComponent(amount)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const data = await fetchJSON(url);

    const rate = data.rates?.[to];
    if (rate == null) {
      setStatus('Курс не найден.', true);
      return;
    }
    resultEl.innerHTML = `
      <div class="result-block">
        <p><strong>${amount.toFixed(2)} ${from}</strong> = <strong>${rate.toFixed(2)} ${to}</strong></p>
        <small>Дата курсов: ${data.date}</small>
      </div>`;
    setStatus('Готово.');
  } catch (e) {
    setStatus(`Ошибка: ${e.message}`, true);
  }
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

console.info('Currency page ready.');