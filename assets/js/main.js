// Small enhancements only: the page works without JavaScript.
(() => {
  const root = document.documentElement;

  // Theme toggle: follows the system until the visitor picks one.
  const themeBtn = document.querySelector('.theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  themeBtn?.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked: still switches for this visit */ }
  });

  // Mobile menu
  const navBtn = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  navBtn?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    navBtn.setAttribute('aria-expanded', String(open));
  });
  links?.addEventListener('click', (e) => {
    if (e.target.closest('a')) { links.classList.remove('open'); navBtn?.setAttribute('aria-expanded', 'false'); }
  });

  // Highlight the section in view
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.toggleAttribute('aria-current', a.getAttribute('href') === `#${en.target.id}`));
        navLinks.forEach((a) => { if (a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Islands on the route map jump to their project card
  document.querySelectorAll('.isle').forEach((isle) => {
    const target = document.getElementById(isle.dataset.target);
    if (!target) return;
    isle.setAttribute('tabindex', '0');
    isle.setAttribute('role', 'link');
    isle.setAttribute('aria-label', `Go to project: ${target.querySelector('h3')?.textContent || ''}`);
    const go = () => {
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
      target.classList.add('flash');
      setTimeout(() => target.classList.remove('flash'), 1600);
    };
    isle.addEventListener('click', go);
    isle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
