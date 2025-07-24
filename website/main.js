// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !expanded);
    navLinks.classList.toggle('open');
  });
}

// Dark mode toggle with persistence
const darkModeToggle = document.getElementById('darkModeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const storedTheme = localStorage.getItem('theme');
if (darkModeToggle) {
  function setDarkMode(on) {
    document.body.classList.toggle('dark-mode', on);
    localStorage.setItem('theme', on ? 'dark' : 'light');
  }
  // Initial state
  if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
    setDarkMode(true);
  }
  darkModeToggle.addEventListener('click', () => {
    setDarkMode(!document.body.classList.contains('dark-mode'));
  });
}

// Back to top button
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Tooltip for deprecated badges (for accessibility)
document.querySelectorAll('.deprecated-badge').forEach(badge => {
  badge.setAttribute('tabindex', '0');
  badge.setAttribute('role', 'tooltip');
});