import { defineConfig } from 'vite';

export default defineConfig({
  base: '/bookfinder/',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        search: 'search.html',
        currency: 'currency.html',
        weather: 'weather.html',
        about: 'about.html'
      }
    }
  }
});
