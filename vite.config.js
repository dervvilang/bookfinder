import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        search: "search.html",
        currency: "currency.html",
        weather: "weather.html",
        about: "about.html",
      },
    },
  },
});
