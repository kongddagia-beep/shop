// =============================================
//  매직 오브 스톰 — 움직이기(JavaScript)
//  상품 정보는 products.js 에 있어요.
// =============================================


// ----- 1. 쇼핑몰 기본 설정 -----

const FREE_SHIPPING = 50000;  // 이 금액 이상 사면 배송비 무료
const SHIPPING_FEE = 3000;    // 기본 배송비

// 위쪽 메뉴에 보여줄 항목 (이 순서대로 나와요)
const MENU = ['전체', 'NEW', 'BEST', 'SALE', '아우터', '상의', '하의', '원피스', '신발', '잡화'];

// 메뉴를 골랐을 때 상품 목록 위에 보여줄 제목
const TITLES = {
  '전체': '전체 상품',
  'NEW': '새로 들어온 상품',
  'BEST': '가장 많이 팔린 상품',
  'SALE': '지금 할인 중',
  '찜': '찜한 상품'
};

// 화면에 그려 넣는 작은 아이콘 그림 (SVG)
const ICON = {
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.5 8 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.6 0 5.7 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>',
  close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};


// ----- 2. 지금 상태를 기억하는 변수들 -----

let currentMenu = '전체';      // 지금 고른 메뉴
let currentSort = 'recommend'; // 지금 정렬 방법
let searchWord = '';           // 검색창에 쓴 글자
let detail = null;             // 상세 창에서 고른 옵션 { id, color, size, qty }

// 장바구니와 찜 목록은 브라우저에 저장해 둬서 새로고침해도 남아 있어요
let cart = loadData('mos-cart', []);     // [{ key, id, color, size, qty }, ...]
let wishlist = loadData('mos-wish', []); // [상품 id, ...]

// products.js 에서 지운 상품이 남아 있으면 정리
cart = cart.filter(item => findProduct(item.id));
wishlist = wishlist.filter(id => findProduct(id));


// ----- 3. 작은 도우미 함수들 -----

// id 로 화면 요소 찾기
function byId(id) {
  return document.getElementById(id);
}

// 15000 → "15,000원"
function won(number) {
  return number.toLocaleString('ko-KR') + '원';
}

// id 로 상품 찾기
function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

// 할인율 계산 (할인 안 하면 0)
function discountRate(p) {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.originalPrice) * 100);
}

// 브라우저 저장소에서 읽기/쓰기 (저장이 막혀 있어도 쇼핑몰은 그대로 돌아가요)
function loadData(key, fallback) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : fallback;
  } catch (e) {
    return fallback;
  }
}
function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // 저장 못 해도 괜찮아요
  }
}

// 장바구니 합계 계산
function getTotals() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + findProduct(item.id).price * item.qty, 0);
  const shipping = (subtotal === 0 || subtotal >= FREE_SHIPPING) ? 0 : SHIPPING_FEE;
  return { count, subtotal, shipping, total: subtotal + shipping };
}


// ----- 4. 메뉴와 상품 목록 그리기 -----

function renderMenu() {
  byId('nav').innerHTML = MENU.map(menu => `
    <button class="nav-item ${menu === currentMenu ? 'active' : ''} ${menu === 'SALE' ? 'sale' : ''}"
            data-action="menu" data-menu="${menu}">${menu}</button>
  `).join('');
}

// 지금 메뉴/검색/정렬에 맞는 상품만 골라내기
function getVisibleProducts() {
  let list = PRODUCTS.filter(p => {
    if (currentMenu === 'NEW' || currentMenu === 'BEST') return p.badge === currentMenu;
    if (currentMenu === 'SALE') return discountRate(p) > 0;
    if (currentMenu === '찜') return wishlist.includes(p.id);
    if (currentMenu !== '전체') return p.category === currentMenu;
    return true;
  });

  if (searchWord) {
    const word = searchWord.toLowerCase();
    list = list.filter(p => (p.name + ' ' + p.category + ' ' + p.desc).toLowerCase().includes(word));
  }

  list = list.slice(); // 원래 순서는 건드리지 않게 복사해서 정렬
  if (currentSort === 'new') list.sort((a, b) => b.id - a.id);
  if (currentSort === 'low') list.sort((a, b) => a.price - b.price);
  if (currentSort === 'high') list.sort((a, b) => b.price - a.price);
  if (currentSort === 'review') list.sort((a, b) => b.reviews - a.reviews);
  return list;
}

// 가격 부분 HTML (할인율 · 판매가 · 원래 가격)
function priceHtml(p) {
  const rate = discountRate(p);
  return `
    <div class="price">
      ${rate ? `<span class="rate">${rate}%</span>` : ''}
      <span class="now">${won(p.price)}</span>
      ${rate ? `<s>${won(p.originalPrice)}</s>` : ''}
    </div>`;
}

// 상품 카드 1개 HTML
function productCard(p) {
  const wished = wishlist.includes(p.id);
  const tags = [];
  if (p.badge) tags.push(`<span class="tag tag-${p.badge.toLowerCase()}">${p.badge}</span>`);
  if (discountRate(p)) tags.push('<span class="tag tag-sale">SALE</span>');

  return `
    <article class="card">
      <div class="card-img" style="background:${p.bg}" data-action="open" data-id="${p.id}"
           role="button" tabindex="0" aria-label="${p.name} 자세히 보기">
        <span class="card-emoji">${p.emoji}</span>
        <div class="card-tags">${tags.join('')}</div>
        <button class="wish ${wished ? 'on' : ''}" data-action="wish" data-id="${p.id}"
                aria-label="찜하기" aria-pressed="${wished}">${ICON.heart}</button>
        <button class="quick-add" data-action="quick" data-id="${p.id}">장바구니 담기</button>
      </div>
      <div class="card-body" data-action="open" data-id="${p.id}">
        <p class="card-cat">${p.category}</p>
        <h3 class="card-name">${p.name}</h3>
        ${priceHtml(p)}
        <p class="rating"><span class="star">★</span> ${p.rating}<span class="reviews">리뷰 ${p.reviews.toLocaleString('ko-KR')}</span></p>
      </div>
    </article>`;
}

function renderProducts() {
  const list = getVisibleProducts();
  byId('grid').innerHTML = list.map(productCard).join('');

  // 제목과 개수 (검색어는 textContent 로 넣어야 안전해요)
  byId('list-title').textContent = searchWord
    ? `‘${searchWord}’ 검색 결과`
    : (TITLES[currentMenu] || currentMenu);
  byId('list-count').textContent = `총 ${list.length}개`;

  // 상품이 하나도 없을 때 안내
  const empty = byId('empty');
  empty.hidden = list.length > 0;
  empty.textContent = (currentMenu === '찜' && !searchWord)
    ? '아직 찜한 상품이 없어요. 마음에 드는 상품의 ♥ 를 눌러 보세요.'
    : '찾는 상품이 없어요. 다른 검색어로 찾아보세요.';
}

// 메뉴 바꾸기
function setMenu(menu, scroll) {
  currentMenu = menu;
  searchWord = '';
  byId('search').value = '';
  renderMenu();
  renderProducts();
  if (scroll) scrollToProducts();
}

// 상품 목록 위치로 부드럽게 이동 (위에 붙어 있는 헤더 높이만큼 빼고)
function scrollToProducts() {
  const top = byId('products').getBoundingClientRect().top + window.scrollY - byId('header').offsetHeight - 8;
  window.scrollTo({ top: top, behavior: 'smooth' });
}


// ----- 5. 찜하기 -----

function toggleWish(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    showToast('찜 목록에서 뺐어요');
  } else {
    wishlist.push(id);
    showToast('찜 목록에 담았어요 ♥');
    bump('wish-count');
  }
  saveData('mos-wish', wishlist);
  updateCounts();
  renderProducts();
  if (isOpen('modal') && detail && detail.id === id) renderDetail();
}


// ----- 6. 상품 상세 창 -----

function openDetail(id) {
  const p = findProduct(id);
  detail = {
    id: id,
    color: p.colors[0],                                // 색상은 첫 번째로 미리 골라 두기
    size: p.sizes.length === 1 ? p.sizes[0] : null,    // 사이즈가 하나뿐이면 자동 선택
    qty: 1,
    needSize: false                                    // 사이즈 안 고르고 담으려 하면 true
  };
  renderDetail();
  openLayer('modal');
}

function renderDetail() {
  const p = findProduct(detail.id);
  const wished = wishlist.includes(p.id);

  byId('modal-body').innerHTML = `
    <div class="detail">
      <div class="detail-img" style="background:${p.bg}"><span>${p.emoji}</span></div>
      <div class="detail-info">
        <p class="card-cat">${p.category}${p.badge ? ' · ' + p.badge : ''}</p>
        <h2>${p.name}</h2>
        <p class="rating"><span class="star">★</span> ${p.rating}<span class="reviews">리뷰 ${p.reviews.toLocaleString('ko-KR')}개</span></p>
        ${priceHtml(p)}
        <p class="detail-desc">${p.desc}</p>

        <div class="option">
          <p class="option-label">색상 <span>${detail.color}</span></p>
          <div class="chips">
            ${p.colors.map(c => `<button class="chip ${c === detail.color ? 'on' : ''}" data-action="color" data-value="${c}">${c}</button>`).join('')}
          </div>
        </div>

        <div class="option ${detail.needSize ? 'need' : ''}">
          <p class="option-label">사이즈 <span>${detail.size || '사이즈를 선택해 주세요'}</span></p>
          <div class="chips">
            ${p.sizes.map(s => `<button class="chip ${s === detail.size ? 'on' : ''}" data-action="size" data-value="${s}">${s}</button>`).join('')}
          </div>
        </div>

        <div class="qty-row">
          <p class="option-label">수량</p>
          <div class="stepper">
            <button data-action="detail-minus" aria-label="수량 줄이기" ${detail.qty <= 1 ? 'disabled' : ''}>−</button>
            <span>${detail.qty}</span>
            <button data-action="detail-plus" aria-label="수량 늘리기" ${detail.qty >= 10 ? 'disabled' : ''}>+</button>
          </div>
        </div>

        <div class="detail-total">
          <span>총 상품금액</span>
          <b>${won(p.price * detail.qty)}</b>
        </div>

        <div class="detail-buttons">
          <button class="btn btn-line wish-big ${wished ? 'on' : ''}" data-action="wish" data-id="${p.id}"
                  aria-label="찜하기" aria-pressed="${wished}">${ICON.heart}</button>
          <button class="btn btn-line" data-action="detail-add">장바구니</button>
          <button class="btn btn-dark" data-action="detail-buy">바로 구매</button>
        </div>

        <ul class="detail-notes">
          <li>🚚 ${won(FREE_SHIPPING)} 이상 무료배송 (기본 배송비 ${won(SHIPPING_FEE)})</li>
          <li>📦 오후 2시 전 주문 시 오늘 출발</li>
          <li>↩️ 받은 날로부터 7일 안에 무료 반품</li>
        </ul>
      </div>
    </div>`;
}

// 상세 창에서 장바구니 담기 (goToCart 가 true 면 바로 장바구니 열기)
function addFromDetail(goToCart) {
  if (!detail.size) {
    detail.needSize = true;
    renderDetail();
    showToast('사이즈를 선택해 주세요');
    return;
  }
  addToCart(detail.id, detail.color, detail.size, detail.qty, goToCart);
  closeLayers();
  if (goToCart) openLayer('drawer');
}


// ----- 7. 장바구니 -----

function addToCart(id, color, size, qty, silent) {
  const key = id + '|' + color + '|' + size;   // 같은 상품이라도 옵션이 다르면 따로 담겨요
  const found = cart.find(item => item.key === key);
  if (found) {
    found.qty = Math.min(found.qty + qty, 99);
  } else {
    cart.push({ key: key, id: id, color: color, size: size, qty: qty });
  }
  saveData('mos-cart', cart);
  renderCart();
  bump('cart-count');
  if (!silent) showToast('장바구니에 담았어요', '보러가기', () => openLayer('drawer'));
}

// 카드 위 "장바구니 담기" — 옵션이 하나뿐이면 바로 담고, 아니면 상세 창 열기
function quickAdd(id) {
  const p = findProduct(id);
  if (p.colors.length === 1 && p.sizes.length === 1) {
    addToCart(id, p.colors[0], p.sizes[0], 1);
  } else {
    openDetail(id);
  }
}

function changeQty(key, change) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(1, Math.min(99, item.qty + change));
  saveData('mos-cart', cart);
  renderCart();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  saveData('mos-cart', cart);
  renderCart();
}

function renderCart() {
  updateCounts();
  const t = getTotals();
  byId('drawer-count').textContent = t.count ? t.count : '';

  // 장바구니가 비었을 때
  if (cart.length === 0) {
    byId('ship').innerHTML = '';
    byId('cart-summary').innerHTML = '';
    byId('cart-items').innerHTML = `
      <div class="cart-empty">
        <div class="big">🛍️</div>
        <p>장바구니가 비어 있어요</p>
        <button class="btn btn-line" data-action="close">쇼핑 계속하기</button>
      </div>`;
    return;
  }

  // 무료배송까지 얼마 남았는지
  const left = FREE_SHIPPING - t.subtotal;
  const percent = Math.min(100, Math.round(t.subtotal / FREE_SHIPPING * 100));
  byId('ship').innerHTML = `
    ${left > 0 ? `<b>${won(left)}</b> 더 담으면 무료배송!` : '🎉 무료배송 조건을 채웠어요!'}
    <div class="ship-bar"><i style="width:${percent}%"></i></div>`;

  // 담은 상품 목록
  byId('cart-items').innerHTML = cart.map(item => {
    const p = findProduct(item.id);
    return `
      <div class="cart-item">
        <div class="cart-thumb" style="background:${p.bg}">${p.emoji}</div>
        <div>
          <p class="cart-name">${p.name}</p>
          <p class="cart-opt">${item.color} / ${item.size}</p>
          <div class="cart-bottom">
            <div class="stepper small">
              <button data-action="cart-minus" data-key="${item.key}" aria-label="수량 줄이기" ${item.qty <= 1 ? 'disabled' : ''}>−</button>
              <span>${item.qty}</span>
              <button data-action="cart-plus" data-key="${item.key}" aria-label="수량 늘리기">+</button>
            </div>
            <b>${won(p.price * item.qty)}</b>
          </div>
        </div>
        <button class="cart-remove" data-action="cart-remove" data-key="${item.key}" aria-label="${p.name} 빼기">${ICON.close}</button>
      </div>`;
  }).join('');

  // 합계
  byId('cart-summary').innerHTML = `
    <div class="sum-row"><span>상품 금액</span><span>${won(t.subtotal)}</span></div>
    <div class="sum-row"><span>배송비</span><span>${t.shipping ? won(t.shipping) : '무료'}</span></div>
    <div class="sum-row total"><span>결제 예정 금액</span><b>${won(t.total)}</b></div>
    <button class="btn btn-dark btn-block" data-action="checkout">${won(t.total)} 주문하기</button>`;
}

// 주문하기 (연습용이라 실제 결제는 하지 않고 완료 화면만 보여줘요)
function checkout() {
  if (cart.length === 0) return;
  const t = getTotals();
  const now = new Date();
  const orderNo = 'MOS' + now.getFullYear()
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0')
    + '-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0');

  const lines = cart.map(item => {
    const p = findProduct(item.id);
    return `<li><span>${p.name} (${item.color}/${item.size}) × ${item.qty}</span><b>${won(p.price * item.qty)}</b></li>`;
  }).join('');

  byId('modal-body').innerHTML = `
    <div class="done">
      <div class="done-icon">✓</div>
      <h2>주문이 완료되었어요</h2>
      <p class="done-no">주문번호 ${orderNo}</p>
      <ul class="done-list">
        ${lines}
        <li><span>배송비</span><b>${t.shipping ? won(t.shipping) : '무료'}</b></li>
      </ul>
      <div class="done-total"><span>결제 금액</span><b>${won(t.total)}</b></div>
      <p class="done-note">※ 연습용 쇼핑몰이라 실제 결제나 배송은 되지 않아요.</p>
      <button class="btn btn-dark btn-block" data-action="close">쇼핑 계속하기</button>
    </div>`;

  cart = [];
  detail = null;
  saveData('mos-cart', cart);
  renderCart();
  openLayer('modal', true);
}


// ----- 8. 숫자 배지, 알림, 창 열고 닫기 -----

function updateCounts() {
  setCount('cart-count', getTotals().count);
  setCount('wish-count', wishlist.length);
}
function setCount(id, number) {
  const el = byId(id);
  el.textContent = number > 99 ? '99+' : number;
  el.hidden = number === 0;
}
// 숫자가 톡 튀어오르는 효과
function bump(id) {
  const el = byId(id);
  el.classList.remove('bump');
  void el.offsetWidth; // 애니메이션을 처음부터 다시 시작하게 하는 요령
  el.classList.add('bump');
}

let toastTimer;
function showToast(message, buttonText, onButtonClick) {
  const toast = byId('toast');
  toast.innerHTML = '';
  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);
  if (buttonText) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.addEventListener('click', () => {
      toast.classList.remove('show');
      onButtonClick();
    });
    toast.appendChild(button);
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

function isOpen(id) {
  return byId(id).classList.contains('open');
}
// name = 'modal' (상세 창) 또는 'drawer' (장바구니)
function openLayer(name, small) {
  closeLayers();
  byId(name).classList.add('open');
  byId('modal').classList.toggle('small', name === 'modal' && !!small);
  byId('overlay').classList.add('open');
  document.body.classList.add('locked');
  if (name === 'modal') byId('modal').scrollTop = 0;
}
function closeLayers() {
  ['modal', 'drawer', 'overlay'].forEach(id => byId(id).classList.remove('open'));
  document.body.classList.remove('locked');
}


// ----- 9. 클릭 처리 -----
// 버튼마다 data-action="이름" 을 붙여 두고, 여기서 한 번에 처리해요.

document.addEventListener('click', function (event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;
  const id = Number(target.dataset.id);
  const key = target.dataset.key;
  const value = target.dataset.value;

  if (action === 'home') {
    event.preventDefault();
    setMenu('전체');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  else if (action === 'menu') {
    event.preventDefault();
    setMenu(target.dataset.menu, true);
  }
  else if (action === 'search-toggle') {
    const opened = byId('header').classList.toggle('show-search');
    if (opened) byId('search').focus();
  }
  else if (action === 'open') openDetail(id);
  else if (action === 'quick') quickAdd(id);
  else if (action === 'wish') toggleWish(id);
  else if (action === 'color') { detail.color = value; renderDetail(); }
  else if (action === 'size') { detail.size = value; detail.needSize = false; renderDetail(); }
  else if (action === 'detail-minus') { detail.qty = Math.max(1, detail.qty - 1); renderDetail(); }
  else if (action === 'detail-plus') { detail.qty = Math.min(10, detail.qty + 1); renderDetail(); }
  else if (action === 'detail-add') addFromDetail(false);
  else if (action === 'detail-buy') addFromDetail(true);
  else if (action === 'cart') openLayer('drawer');
  else if (action === 'cart-minus') changeQty(key, -1);
  else if (action === 'cart-plus') changeQty(key, 1);
  else if (action === 'cart-remove') removeFromCart(key);
  else if (action === 'checkout') checkout();
  else if (action === 'close') closeLayers();
});

// 키보드: Esc 로 창 닫기, Enter 로 상품 카드 열기
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') closeLayers();
  if (event.key === 'Enter' && event.target.matches('[role="button"][data-action]')) event.target.click();
});

// 검색창에 글자를 쓸 때마다 바로 찾기
byId('search').addEventListener('input', function () {
  searchWord = this.value.trim();
  currentMenu = '전체';
  renderMenu();
  renderProducts();
});
// 검색창에서 Enter 를 누르면 결과 위치로 이동
byId('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  scrollToProducts();
});

// 정렬 바꾸기
byId('sort').addEventListener('change', function () {
  currentSort = this.value;
  renderProducts();
});


// ----- 10. 배너에 눈 내리게 하기 -----

function makeSnow() {
  let html = '';
  for (let i = 0; i < 30; i++) {
    const size = 6 + Math.random() * 10;
    const duration = 7 + Math.random() * 8;
    const delay = -Math.random() * 15;
    const opacity = 0.25 + Math.random() * 0.55;
    html += `<span class="snowflake" style="left:${Math.random() * 100}%; font-size:${size}px; animation-duration:${duration}s; animation-delay:${delay}s; opacity:${opacity}">❄</span>`;
  }
  byId('snow').innerHTML = html;
}


// ----- 11. 처음 화면 그리기 -----

renderMenu();
renderProducts();
renderCart();
makeSnow();
