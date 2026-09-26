const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const searchButton = document.querySelector('.search-toggle');
const searchBar = document.querySelector('.search-bar');
const searchInput = document.querySelector('#site-search');
const searchClose = document.querySelector('.search-bar button');
const toast = document.querySelector('.toast');
let toastTimer;

document.querySelector('#year').textContent = new Date().getFullYear();

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

searchButton.addEventListener('click', () => {
  searchBar.classList.toggle('open');
  searchBar.setAttribute('aria-hidden', String(!searchBar.classList.contains('open')));
  if (searchBar.classList.contains('open')) searchInput.focus();
});
searchClose.addEventListener('click', () => {
  searchBar.classList.remove('open');
  searchBar.setAttribute('aria-hidden', 'true');
  searchInput.value = '';
  filterCards('');
});
function filterCards(query) {
  const cards = [...document.querySelectorAll('.collection-card')];
  const normalized = query.trim().toLowerCase();
  let matches = 0;
  cards.forEach(card => {
    const visible = !normalized || `${card.dataset.category} ${card.innerText}`.toLowerCase().includes(normalized);
    card.hidden = !visible;
    if (visible) matches++;
  });
  if (normalized) {
    document.querySelector('#collections').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (matches === 0) showToast('No collection matches that search. Try “rings” or “gold”.');
  }
}
let searchDebounce;
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => filterCards(searchInput.value), 350);
});
searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') filterCards(searchInput.value);
  if (event.key === 'Escape') searchClose.click();
});

document.querySelector('.hero-arrow').addEventListener('click', () => {
  document.querySelector('#heritage').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#enquiry-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const request = {
    name: data.get('name'),
    email: data.get('email'),
    interest: data.get('interest'),
    createdAt: new Date().toISOString()
  };
  const saved = JSON.parse(localStorage.getItem('aljalil-enquiries') || '[]');
  saved.push(request);
  localStorage.setItem('aljalil-enquiries', JSON.stringify(saved));
  form.querySelector('.form-note').textContent = `Thank you, ${request.name}. Your ${request.interest.toLowerCase()} enquiry has been saved in this browser.`;
  form.reset();
  showToast('Your enquiry has been saved on this device.');
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
}
