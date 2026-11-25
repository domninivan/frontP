/* Корзина товаров (добавление к КР №4).
   Товары хранятся в localStorage — корзина переживает перезагрузку
   страницы и доступна с любой страницы сайта. Интерфейс корзины
   (кнопка-счётчик в шапке и диалог) создаётся из JavaScript через
   createElement и заполняется через textContent — без innerHTML.
   Оплата не реализуется: это демонстрационный режим. */

const CART_STORAGE_KEY = "shopProjectCart";

/* ---------- Хранение: JSON-массив [{id, qty}] в localStorage ---------- */

function loadCart() {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // повреждённые данные не должны ломать страницу
  }
}

function saveCart(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

/* ---------- Чтение состояния корзины ---------- */

function cartCount(items) {
  return items.reduce((sum, entry) => sum + entry.qty, 0);
}

function cartTotalSum(items) {
  return items.reduce(
    (sum, entry) =>
      sum + entry.qty * (products.find((p) => p.id === entry.id)?.price || 0),
    0,
  );
}

/* ---------- Интерфейс корзины ---------- */

let cartItemsElement = null;
let cartTotalElement = null;
let cartBadgeElement = null;
let cartDialogElement = null;
let cartEmptyElement = null;
let cartCheckoutElement = null;

/* Кнопка-счётчик в шапке: видна на всех страницах. */
function createCartButton(header) {
  const button = createNode("button", "cart-button");
  button.type = "button";
  button.id = "cartButton";
  button.setAttribute("aria-label", "Открыть корзину");

  const icon = createNode("span", "cart-button__icon", "🛒");
  icon.setAttribute("aria-hidden", "true");
  cartBadgeElement = createNode("span", "cart-button__badge");
  cartBadgeElement.hidden = true;

  button.append(icon, cartBadgeElement);
  header.append(button);
}

/* Диалог корзины: список товаров, итог, кнопки действий. */
function createCartDialog() {
  const dialog = document.createElement("dialog");
  dialog.className = "cart-dialog";
  dialog.id = "cartDialog";
  dialog.setAttribute("aria-labelledby", "cartDialogTitle");

  const header = createNode("div", "cart-dialog__header");
  const title = createNode("h2", "cart-dialog__title", "Корзина");
  title.id = "cartDialogTitle";
  header.append(title);
  const close = createNode("button", "cart-dialog__close", "×");
  close.type = "button";
  close.dataset.cartClose = "";
  close.setAttribute("aria-label", "Закрыть корзину");
  header.append(close);

  cartItemsElement = createNode("ul", "cart-dialog__items");
  cartEmptyElement = createNode(
    "p",
    "cart-dialog__empty",
    "Корзина пуста. Добавьте товары из каталога.",
  );

  const footer = createNode("div", "cart-dialog__footer");
  const totalLine = createNode("p", "cart-dialog__total");
  totalLine.append(createNode("span", null, "Итого: "));
  cartTotalElement = createNode("strong", null, "0 ₽");
  totalLine.append(cartTotalElement);

  const actions = createNode("div", "cart-dialog__actions");
  const clearButton = createNode(
    "button",
    "button button--secondary",
    "Очистить",
  );
  clearButton.type = "button";
  clearButton.dataset.cartClear = "";
  cartCheckoutElement = createNode(
    "a",
    "button button--primary",
    "Оформить заявку",
  );
  cartCheckoutElement.href = "order.html";
  actions.append(clearButton, cartCheckoutElement);
  footer.append(totalLine, actions);

  const body = createNode("div", "cart-dialog__body");
  body.append(cartItemsElement, cartEmptyElement, footer);
  dialog.append(header, body);
  document.body.append(dialog);
  return dialog;
}

/* Полная перерисовка корзины: список позиций, итог, счётчик в шапке. */
function renderCart() {
  const items = loadCart();

  cartItemsElement.replaceChildren();
  items.forEach((entry) => {
    const product = products.find((p) => p.id === entry.id);
    if (!product) return;

    const row = createNode("li", "cart-item");
    row.append(createNode("span", "cart-item__name", product.name));
    row.append(
      createNode(
        "span",
        "cart-item__price",
        `${formatPrice(product.price)} × ${entry.qty}`,
      ),
    );

    const qtyControls = createNode("span", "cart-item__controls");
    const minus = createNode("button", "cart-item__step", "−");
    minus.type = "button";
    minus.dataset.cartDec = String(product.id);
    minus.setAttribute("aria-label", "Убрать одну штуку");
    const plus = createNode("button", "cart-item__step", "+");
    plus.type = "button";
    plus.dataset.cartInc = String(product.id);
    plus.setAttribute("aria-label", "Добавить одну штуку");
    qtyControls.append(
      minus,
      plus,
      createNode("span", "cart-item__qty", String(entry.qty)),
    );
    row.append(qtyControls);

    const remove = createNode("button", "cart-item__remove", "Удалить");
    remove.type = "button";
    remove.dataset.cartRemove = String(product.id);
    row.append(remove);

    cartItemsElement.append(row);
  });

  const isEmpty = items.length === 0;
  cartEmptyElement.hidden = !isEmpty;
  cartCheckoutElement.classList.toggle("button--disabled", isEmpty);
  cartTotalElement.textContent = formatPrice(cartTotalSum(items));

  const count = cartCount(items);
  cartBadgeElement.textContent = String(count);
  cartBadgeElement.hidden = count === 0;
}

/* ---------- Операции с корзиной ---------- */

/* Добавляет товар в состояние корзины и перерисовывает её.
   Используется и кнопкой «В корзину», и отправкой заявки (form.js). */
function addItemToCart(id) {
  const items = loadCart();
  const entry = items.find((item) => item.id === id);
  if (entry) entry.qty += 1;
  else items.push({ id, qty: 1 });
  saveCart(items);
  renderCart();
}

function addToCart(id, showMessage) {
  addItemToCart(id);
  const product = products.find((p) => p.id === id);
  showMessage?.(`«${product ? product.name : "Товар"}» добавлен в корзину.`);
}

function changeQuantity(id, delta) {
  const items = loadCart();
  const entry = items.find((item) => item.id === id);
  if (!entry) return;
  entry.qty += delta;
  if (entry.qty <= 0) {
    // уходим в минус — позиция удаляется из корзины
    saveCart(items.filter((item) => item.id !== id));
  } else {
    saveCart(items);
  }
  renderCart();
}

function removeFromCart(id) {
  saveCart(loadCart().filter((item) => item.id !== id));
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

/* ---------- Инициализация ---------- */

function initCart(showMessage) {
  const header = document.querySelector(".site-header__inner");
  if (header) createCartButton(header);
  cartDialogElement = createCartDialog();
  renderCart();

  /* Делегирование кликов: работает и для кнопок внутри карточек,
     которые пересоздаются при каждой перерисовке каталога. */
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-to-cart]");
    if (add) {
      addToCart(Number(add.dataset.addToCart), showMessage);
      return;
    }

    if (event.target.closest("#cartButton")) {
      renderCart();
      cartDialogElement.showModal();
      return;
    }

    if (event.target.closest("[data-cart-close]")) {
      cartDialogElement.close();
      return;
    }

    if (event.target === cartDialogElement) {
      // клик по затемнённому фону вокруг диалога
      cartDialogElement.close();
      return;
    }

    const inc = event.target.closest("[data-cart-inc]");
    if (inc) {
      changeQuantity(Number(inc.dataset.cartInc), 1);
      return;
    }

    const dec = event.target.closest("[data-cart-dec]");
    if (dec) {
      changeQuantity(Number(dec.dataset.cartDec), -1);
      return;
    }

    const remove = event.target.closest("[data-cart-remove]");
    if (remove) {
      removeFromCart(Number(remove.dataset.cartRemove));
      return;
    }

    if (event.target.closest("[data-cart-clear]")) {
      clearCart();
      return;
    }

    if (event.target.closest("#cartDialog .button--primary")) {
      // пустую корзину оформить нельзя
      if (loadCart().length === 0) event.preventDefault();
      else cartDialogElement.close(); // переход по ссылке на order.html произойдёт сам
    }
  });
}
