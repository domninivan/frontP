/* Поиск по названию товара (КР №4, требование 3).
   Регистр букв и буква «ё» не влияют на результат: запрос
   «мышь», «Mouse», «HYPER» находят одни и те же товары. */

function normalizeText(text) {
  return text.toLowerCase().replaceAll("ё", "е").trim();
}

/* Проверяет, подходит ли товар под поисковый запрос. */
function matchesQuery(product, query) {
  const search = normalizeText(query);
  if (search === "") return true;
  return normalizeText(product.name).includes(search);
}
