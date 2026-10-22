const searchToggle = document.querySelector('.search-toggle');
const searchPanel = document.querySelector('.search-panel');
const searchInput = document.querySelector('#site-search');
const searchClear = document.querySelector('.search-clear');
const mobileToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const productCards = [...document.querySelectorAll('.product-card')];
const emptyResults = document.querySelector('.empty-results');
const toast = document.querySelector('.toast');
const cartCount = document.querySelector('.cart-count');
const cartButton = document.querySelector('.cart-button');
const heroCopy = document.querySelector('.hero-copy');
let cartItems = 0;
let toastTimer;
let slideIndex = 0;

const heroSlides = [
  {
    kicker: '在鹽埕，遇見熟悉的好味道',
    title: '高雄鹽埕老街',
    subtitle: '一味傳承・一份溫度',
    description: '百年老店的烏魚子、遇上清涼甜湯與冰品，<br class="desktop-break" />在鹽埕，品味傳統與創新的美好。',
    primary: '探索烏魚子',
    primaryFilter: 'roe',
    secondary: '探索甜湯冰品',
    secondaryFilter: 'dessert'
  },
  {
    kicker: '把鹽埕的心意，帶回家',
    title: '老味道・新日常',
    subtitle: '在地滋味，細細分享',
    description: '從手工烏魚子到一碗沁涼甜湯，<br class="desktop-break" />每一口，都是鹽埕熟悉的人情味。',
    primary: '看看伴手禮',
    primaryFilter: 'gift',
    secondary: '來店品嚐',
    secondaryFilter: 'local'
  }
];

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2800);
}

function filterProducts(query = '') {
  const normalized = query.trim().toLocaleLowerCase();
  let visible = 0;
  productCards.forEach((card) => {
    const haystack = `${card.dataset.search || ''} ${card.textContent}`.toLocaleLowerCase();
    const matches = !normalized || haystack.includes(normalized);
    card.hidden = !matches;
    if (matches) visible += 1;
  });
  emptyResults.hidden = visible !== 0;
}

function showCategory(category) {
  const matches = productCards.some((card) => card.dataset.category === category);
  if (!matches) return;
  productCards.forEach((card) => { card.hidden = card.dataset.category !== category; });
  emptyResults.hidden = true;
  if (searchInput) searchInput.value = '';
}

function resetProductFilter() {
  filterProducts('');
}

searchToggle.addEventListener('click', () => {
  const opening = searchPanel.hidden;
  searchPanel.hidden = !opening;
  searchToggle.setAttribute('aria-expanded', String(opening));
  if (opening) window.setTimeout(() => searchInput.focus(), 30);
});

searchInput.addEventListener('input', (event) => filterProducts(event.target.value));
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  filterProducts('');
  searchInput.focus();
});

mobileToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  mobileToggle.setAttribute('aria-expanded', String(opening));
  mobileToggle.setAttribute('aria-label', opening ? '關閉選單' : '開啟選單');
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  mobileToggle.setAttribute('aria-expanded', 'false');
  mobileToggle.setAttribute('aria-label', '開啟選單');
}));

document.querySelectorAll('[data-filter-link]').forEach((link) => {
  link.addEventListener('click', () => {
    const category = link.dataset.filterLink;
    if (category) showCategory(category);
    if (!searchPanel.hidden) {
      searchPanel.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

document.querySelectorAll('.quick-add').forEach((button) => {
  button.addEventListener('click', () => {
    cartItems += 1;
    cartCount.textContent = String(cartItems);
    cartButton.setAttribute('aria-label', `購物袋，目前 ${cartItems} 件`);
    const product = button.closest('.product-card').querySelector('h3').textContent;
    showToast(`已將「${product}」放入購物袋`);
  });
});

cartButton.addEventListener('click', () => {
  showToast(cartItems ? `購物袋裡有 ${cartItems} 件商品` : '購物袋還沒有商品，看看今日精選吧。');
});

document.querySelector('.member-button').addEventListener('click', () => showToast('會員服務即將開放，歡迎先來鹽埕走走。'));
document.querySelector('.all-products').addEventListener('click', resetProductFilter);
document.querySelectorAll('.card-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const title = link.closest('.product-card').querySelector('h3').textContent;
    showToast(`「${title}」商品資訊歡迎洽詢門市。`);
  });
});

document.querySelectorAll('.hero-arrow').forEach((button) => {
  button.addEventListener('click', () => {
    slideIndex = button.classList.contains('hero-next') ? (slideIndex + 1) % heroSlides.length : (slideIndex + heroSlides.length - 1) % heroSlides.length;
    const slide = heroSlides[slideIndex];
    heroCopy.classList.add('is-changing');
    window.setTimeout(() => {
      document.querySelector('.hero-kicker').textContent = slide.kicker;
      document.querySelector('#hero-title').innerHTML = `${slide.title}<br /><em>${slide.subtitle}</em>`;
      document.querySelector('.hero-description').innerHTML = slide.description;
      const [primary, secondary] = document.querySelectorAll('.hero-buttons .button');
      primary.innerHTML = `${slide.primary} <span aria-hidden="true">→</span>`;
      primary.dataset.filterLink = slide.primaryFilter;
      secondary.textContent = slide.secondary;
      secondary.dataset.filterLink = slide.secondaryFilter;
      document.querySelector('.hero-count b').textContent = `0${slideIndex + 1}`;
      document.querySelector('.hero-count').lastChild.textContent = `0${heroSlides.length}`;
      heroCopy.classList.remove('is-changing');
    }, 170);
  });
});

document.querySelector('#current-year').textContent = String(new Date().getFullYear());
