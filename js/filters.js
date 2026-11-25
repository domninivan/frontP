/* Фильтрация и сортировка каталога (КР №4, требования 4 и 5).
   Каталог управляется единым состоянием: поиск по названию,
   категории, диапазон цены и порядок сортировки применяются вместе. */

const SORTERS = {
  default: (a, b) => a.id - b.id,
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "name-asc": (a, b) => a.name.localeCompare(b.name, "ru"),
  "name-desc": (a, b) => b.name.localeCompare(a.name, "ru"),
};

/* Правильная форма слова «товар»: 1 товар, 2 товара, 5 товаров. */
function pluralProducts(count) {
  if (count === 1) return "товар";
  if (count >= 2 && count <= 4) return "товара";
  return "товаров";
}

function initCatalog() {
  const filterForm = document.getElementById("catalogFilter");
  const searchInput = document.getElementById("catalogSearch");
  const sortSelect = document.getElementById("catalogSort");
  const grid = document.getElementById("catalogGrid");
  const count = document.getElementById("productCount");
  const empty = document.getElementById("noProducts");
  if (!filterForm || !grid) return;

  const state = {
    query: "",
    categories: [],
    min: 0,
    max: Infinity,
    sort: "default",
  };

  /* Отбирает товары по текущему состоянию и рисует каталог. */
  function applyFilters() {
    const visible = products
      .filter((product) => matchesQuery(product, state.query))
      .filter(
        (product) =>
          state.categories.length === 0 ||
          state.categories.includes(product.category),
      )
      .filter((product) => product.price >= state.min && product.price <= state.max)
      .sort(SORTERS[state.sort] || SORTERS.default);

    renderProducts(grid, visible);

    if (count) count.textContent = `${visible.length} ${pluralProducts(visible.length)}`;
    if (empty) empty.hidden = visible.length !== 0;
  }

  /* Считывает состояние из элементов управления на странице. */
  function readControls() {
    state.query = searchInput ? searchInput.value : "";
    state.categories = [...filterForm.querySelectorAll('input[name="category"]:checked')].map(
      (input) => input.value,
    );
    const fromValue = document.getElementById("priceFrom")?.value;
    const toValue = document.getElementById("priceTo")?.value;
    state.min = fromValue === "" || fromValue == null ? 0 : Number(fromValue);
    state.max = toValue === "" || toValue == null ? Infinity : Number(toValue);
    if (sortSelect) state.sort = sortSelect.value;
  }

  /* Кнопка «Применить» в панели фильтров */
  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    readControls();
    applyFilters();
  });

  /* Сброс: очищаем и поиск с сортировкой, чтобы вернуть каталог к исходному виду */
  filterForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "default";
      readControls();
      applyFilters();
    }, 0);
  });

  /* Поиск применяется сразу при вводе */
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value;
      applyFilters();
    });
  }

  /* Сортировка применяется сразу при выборе */
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      applyFilters();
    });
  }

  /* Первичная отрисовка: все товары из массива */
  applyFilters();
}
