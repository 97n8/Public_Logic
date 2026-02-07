// Minimal enhancements for accessibility and UX
window.addEventListener('DOMContentLoaded', () => {
  // Mark current nav link
  const here = location.pathname.replace(/\/index\.html$/, '/');
  document.querySelectorAll('.nav a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if ((here === '/' && href === '/') || (href && here.endsWith(href))) {
      a.setAttribute('aria-current','page');
    }
  });
});