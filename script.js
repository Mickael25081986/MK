// Burger menu (mobile)
const navToggle = document.querySelector('.nav-toggle');


const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// Header + navbar qui suivent le scroll
const topBar = document.querySelector('.top-bar');
const mainNav = document.querySelector('.main-nav');
const siteHeader = document.querySelector('.site-header');

let rafId = null;
const syncHeaderAndNav = () => {
  rafId = null;
  if (!topBar || !mainNav || !siteHeader) return;

  const y = window.scrollY;
  const headerH = siteHeader.offsetHeight;
  const navH = mainNav.offsetHeight;

  // On fait "glisser" le header progressivement jusqu'à disparition complète.
  const offset = Math.min(y, headerH);

  // Header se déplace vers le haut.
  topBar.style.transform = `translateY(-${offset}px)`;

  // La navbar reste collée sous le header visuel.
  mainNav.style.top = `${headerH - offset}px`;

  // Le contenu commence juste sous la navbar, sans laisser de gap quand le header disparaît.
  document.body.style.paddingTop = `${(headerH - offset + navH)}px`;

  // Optionnel (classe gardée pour styles éventuels)
  topBar.classList.toggle('hidden', y >= headerH);
};

const scheduleSync = () => {
  if (rafId) return;
  rafId = window.requestAnimationFrame(syncHeaderAndNav);
};

window.addEventListener('scroll', () => {
  scheduleSync();
});

// Init (après le premier layout)
scheduleSync();

// Full responsive: si le layout change (orientation/zoom/images), on recalcule.
window.addEventListener('resize', scheduleSync);
window.addEventListener('orientationchange', scheduleSync);
window.addEventListener('load', scheduleSync);

// Smooth scroll
document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const headerH = document.querySelector('.site-header').offsetHeight;
    const navH = document.querySelector('.main-nav').offsetHeight;
    const offset = Math.min(window.scrollY, headerH);
    const navTop = headerH - offset;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - (navTop + navH) - 16,
      behavior: 'smooth',
    });
  });
});

// Active nav link au scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => observer.observe(s));

// Reveal animations au scroll
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card').forEach(card => {
  revealObserver.observe(card);
});

// Toggle des détails d'expérience et formation
const pageLang = document.documentElement.lang || 'fr';
const i18n = {
  fr: { more: 'Détails', less: 'Masquer' },
  en: { more: 'Details', less: 'Hide' },
  de: { more: 'Details', less: 'Ausblenden' }
};
const t = i18n[pageLang] || i18n.fr;

document.querySelectorAll('.job, .edu').forEach(item => {
  const btn = item.querySelector('.toggle-job');
  const details = item.querySelector('.job-details');

  if (!btn || !details) return;

  details.style.display = 'none';
  btn.textContent = t.more;

  btn.addEventListener('click', () => {
    const visible = details.style.display !== 'none';
    details.style.display = visible ? 'none' : 'block';
    btn.textContent = visible ? t.more : t.less;
  });
});

// Attacher les événements burger
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    scheduleSync();
  });

  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      scheduleSync();
    });
  });
}
