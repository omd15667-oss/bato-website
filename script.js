const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
const filters = document.querySelectorAll('.filter');
const searchInput = document.getElementById('search');
const stories = [...document.querySelectorAll('.story')];
const year = document.getElementById('year');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (year) year.textContent = new Date().getFullYear();

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

let activeFilter = 'الكل';

function renderStories() {
  const query = (searchInput?.value || '').trim().toLowerCase();
  let visibleCount = 0;

  stories.forEach((story) => {
    const categoryMatch = activeFilter === 'الكل' || story.dataset.category === activeFilter;
    const text = `${story.dataset.title || ''} ${story.textContent || ''}`.toLowerCase();
    const searchMatch = !query || text.includes(query);
    const show = categoryMatch && searchMatch;

    story.hidden = !show;
    if (show) visibleCount += 1;
  });

  if (visibleCount === 0 && searchInput) {
    const emptyState = document.getElementById('emptyState');
    if (!emptyState) {
      const el = document.createElement('p');
      el.id = 'emptyState';
      el.className = 'empty-state';
      el.textContent = 'لا توجد نتائج تطابق البحث الحالي.';
      searchInput.closest('.toolbar')?.parentElement?.appendChild(el);
    }
  } else {
    const emptyState = document.getElementById('emptyState');
    if (emptyState) emptyState.remove();
  }
}

filters.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'الكل';
    filters.forEach((item) => item.classList.toggle('active', item === button));
    renderStories();
  });
});

searchInput?.addEventListener('input', renderStories);

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      formStatus.textContent = 'يرجى تعبئة جميع الحقول قبل الإرسال.';
      formStatus.style.color = '#ffca75';
      return;
    }

    formStatus.textContent = 'تم استلام النموذج بنجاح. هذا نموذج تجريبي، ويجب ربطه بخدمة بريدية حقيقية عند النشر.';
    formStatus.style.color = '#5ce1e6';
    contactForm.reset();
  });
}

renderStories();
