/* Отрисовка карточек товара из массива products (js/data.js).
   Карточки создаются только через createElement и заполняются
   через textContent — это безопасный вывод данных без innerHTML. */

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

/* Создаёт DOM-узел с классом и текстовым содержимым. */
function createNode(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createProductCard(product) {
  const card = createNode("article", "product-card product-item");
  card.dataset.category = product.category;
  card.dataset.price = String(product.price);

  /* Блок с изображением */
  const media = createNode("div", "product-card__media");
  const image = document.createElement("img");
  image.className = "product-card__image";
  image.src = product.image;
  image.alt = product.name;
  image.loading = "lazy";
  media.append(image);

  /* Блок с описанием */
  const body = createNode("div", "product-card__body");
  body.append(createNode("span", product.badgeClass, product.badge));
  body.append(createNode("h3", "product-card__title", product.name));
  body.append(
    createNode("p", "product-card__description", product.description),
  );
  body.append(
    createNode("p", "product-card__price", formatPrice(product.price)),
  );

  /* Кнопки «В корзину» и «Заказать» — обработчики навешиваются
     делегированием (cart.js и main.js), поэтому переживают перерисовки */
  const actions = createNode("div", "product-card__actions");
  const cartButton = createNode(
    "button",
    "button button--secondary button--block",
    "В корзину",
  );
  cartButton.type = "button";
  cartButton.dataset.addToCart = String(product.id);
  const orderButton = createNode(
    "button",
    "button button--primary button--block",
    "Заказать",
  );
  orderButton.type = "button";
  orderButton.dataset.product = product.name;
  /* Связка карточки с товаром по id из массива products:
     по этому id корзина и заявка находят данные товара */
  orderButton.dataset.productId = String(product.id);
  orderButton.dataset.openDialog = "";
  actions.append(cartButton, orderButton);
  body.append(actions);

  card.append(media, body);
  return card;
}

/* Полностью перерисовывает контейнер с карточками. */
function renderProducts(grid, productList) {
  if (!grid) return;
  grid.replaceChildren();
  const fragment = document.createDocumentFragment();
  productList.forEach((product) => {
    fragment.append(createProductCard(product));
  });
  grid.append(fragment);
}
