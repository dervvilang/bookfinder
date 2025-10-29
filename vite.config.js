import { defineConfig } from 'vite';

const isProduction = process.env.NODE_ENV === 'production';

function normalizeBase(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const hasLeadingSlash = pathname.startsWith('/');
  const hasTrailingSlash = pathname.endsWith('/');

  return `${hasLeadingSlash ? '' : '/'}${pathname}${hasTrailingSlash ? '' : '/'}`;
}

function resolveBase() {
  if (!isProduction) {
    return '/';
  }

  const homepage = process.env.npm_package_homepage;
  if (homepage) {
    try {
      const { pathname } = new URL(homepage);
      const normalized = normalizeBase(pathname);
      if (normalized !== '/') {
        return normalized;
      }
    } catch (error) {
    }
  }

  const repoName = process.env.npm_package_name;
  if (repoName) {
    return normalizeBase(repoName);
  }

  return '/';
}

export default defineConfig({
  base: resolveBase(),
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
