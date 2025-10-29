import './style.css';
import { fetchJSON } from './fetcher.js';

const form = document.getElementById('city-form');
const cityInput = document.getElementById('city');
const statusEl = document.getElementById('weather-status');
const currentEl = document.getElementById('current');
const dailyEl = document.getElementById('daily');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  await loadWeather(city);
});

async function loadWeather(city) {
  resetUI();
  setStatus('Определяем координаты…');

  try {
    // 1) Геокодинг
    const geo = await fetchJSON(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`);
    if (!geo.results || geo.results.length === 0) {
      setStatus('Город не найден.', true);
      return;
    }
    const { latitude, longitude, name, country } = geo.results[0];

    // 2) Погода
    setStatus('Получаем прогноз…');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`;
    const meteo = await fetchJSON(url);

    renderCurrent(name, country, meteo);
    renderDaily(meteo);
    setStatus('Готово.');
  } catch (e) {
    setStatus(`Ошибка: ${e.message}`, true);
  }
}

function resetUI() {
  currentEl.innerHTML = '';
  dailyEl.innerHTML = '';
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('error', isError);
}

function renderCurrent(city, country, data) {
  const t = data.current?.temperature_2m;
  const wind = data.current?.wind_speed_10m;
  const block = document.createElement('div');
  block.className = 'weather-current';
  block.innerHTML = `
    <h2>${city}${country ? `, ${country}` : ''}</h2>
    <p><strong>Сейчас:</strong> ${fmt(t)}°C</p>
    <p><strong>Ветер:</strong> ${fmt(wind)} м/с</p>
  `;
  currentEl.append(block);
}

function renderDaily(data) {
  const days = data.daily?.time || [];
  const tmax = data.daily?.temperature_2m_max || [];
  const tmin = data.daily?.temperature_2m_min || [];
  const prcp = data.daily?.precipitation_sum || [];

  for (let i = 0; i < days.length; i++) {
    const el = document.createElement('article');
    el.className = 'weather-day';
    el.innerHTML = `
      <h4>${days[i]}</h4>
      <p>🌡️ Макс: ${fmt(tmax[i])}°C</p>
      <p>🌡️ Мин: ${fmt(tmin[i])}°C</p>
      <p>🌧️ Осадки: ${fmt(prcp[i])} мм</p>
    `;
    dailyEl.append(el);
  }
}

function fmt(x) {
  return (x == null || Number.isNaN(x)) ? '—' : Number(x).toFixed(1);
}

console.info('Weather page ready.');