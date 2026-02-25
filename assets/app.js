const body = document.body;
const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function lockScroll(lock) { body.style.overflow = lock ? 'hidden' : ''; }

function trapFocus(container, active) {
  if (!active) return;
  const focusables = [...container.querySelectorAll(focusableSelector)];
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  first.focus();
}

document.querySelectorAll('[data-dropdown]').forEach((wrap) => {
  const btn = wrap.querySelector('.lang-active');
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', wrap.classList.contains('open'));
  });
});
document.addEventListener('click', () => document.querySelectorAll('[data-dropdown]').forEach((d) => d.classList.remove('open')));

const drawer = document.querySelector('.drawer');
const burger = document.querySelector('.burger');
const drawerPanel = document.querySelector('.drawer-panel');
const closeDrawerBtn = document.querySelector('.drawer-close');
const openDrawer = () => {
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  burger.setAttribute('aria-expanded', 'true');
  lockScroll(true);
  trapFocus(drawerPanel, true);
};
const closeDrawer = () => {
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  burger.setAttribute('aria-expanded', 'false');
  lockScroll(false);
};
burger?.addEventListener('click', openDrawer);
closeDrawerBtn?.addEventListener('click', closeDrawer);
drawer?.addEventListener('click', (e) => { if (e.target === drawer) closeDrawer(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDrawer();
    closeModal();
  }
});

document.querySelectorAll('.faq-item').forEach((item) => {
  item.querySelector('.faq-trigger')?.addEventListener('click', () => {
    document.querySelectorAll('.faq-item').forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.toggle('open');
    item.querySelector('.faq-trigger')?.setAttribute('aria-expanded', item.classList.contains('open'));
  });
});

const modal = document.getElementById('privacy-modal');
const modalPanel = modal?.querySelector('.modal-panel');
const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  lockScroll(true);
  trapFocus(modalPanel, true);
};
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  lockScroll(false);
}
document.querySelectorAll('[data-open-privacy]').forEach((btn) => btn.addEventListener('click', openModal));
document.querySelectorAll('[data-close-privacy]').forEach((btn) => btn.addEventListener('click', closeModal));
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
