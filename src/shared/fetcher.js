export async function fetchJSON(url, { timeout = 10000, ...options } = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${new URL(url).pathname}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('Превышено время ожидания запроса');
    throw err;
  } finally {
    clearTimeout(id);
  }
}
