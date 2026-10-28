/* Интерактивность учебного проекта. Заявки не отправляются на сервер. */
document.addEventListener("DOMContentLoaded", () => {
  const modalProduct = document.getElementById("quick-product");
  const orderModal = document.getElementById("orderModal");
  const quickForm = document.getElementById("quickOrderForm");
  const fullForm = document.getElementById("fullOrderForm");
  const toastElement = document.getElementById("siteToast");
  const toastMessage = document.getElementById("toastMessage");

  function showMessage(message) {
    if (!toastElement || !window.bootstrap) {
      window.alert(message);
      return;
    }
    if (toastMessage) toastMessage.textContent = message;
    window.bootstrap.Toast.getOrCreateInstance(toastElement).show();
  }

  document
    .querySelectorAll("[data-product][data-bs-target]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (modalProduct) modalProduct.value = button.dataset.product || "";
      });
    });

  function validateForm(form) {
    if (!form) return false;
    form.classList.add("was-validated");
    return form.checkValidity();
  }

  if (quickForm) {
    quickForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!validateForm(quickForm)) {
        quickForm.querySelector(":invalid")?.focus();
        return;
      }
      const product = modalProduct?.value || "выбранный товар";
      quickForm.reset();
      quickForm.classList.remove("was-validated");
      if (orderModal && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(orderModal).hide();
      }
      showMessage(
        `Заявка на «${product}» оформлена в демонстрационном режиме.`,
      );
    });
  }

  if (fullForm) {
    fullForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!validateForm(fullForm)) {
        fullForm.querySelector(":invalid")?.focus();
        return;
      }
      const formData = new FormData(fullForm);
      const product = formData.get("product") || "товар";
      fullForm.reset();
      fullForm.classList.remove("was-validated");
      showMessage(
        `Заявка на «${product}» проверена. Данные не отправлялись на сервер.`,
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const filterForm = document.getElementById("catalogFilter");
  if (filterForm) {
    const items = [...document.querySelectorAll(".product-item")];
    const count = document.getElementById("productCount");
    const empty = document.getElementById("noProducts");

    function applyFilters(event) {
      if (event) event.preventDefault();
      const selected = [
        ...filterForm.querySelectorAll('input[name="category"]:checked'),
      ].map((input) => input.value);
      const fromValue = document.getElementById("priceFrom")?.value;
      const toValue = document.getElementById("priceTo")?.value;
      const min = fromValue === "" || fromValue == null ? 0 : Number(fromValue);
      const max =
        toValue === "" || toValue == null ? Infinity : Number(toValue);
      let visible = 0;

      items.forEach((item) => {
        const categoryMatches =
          selected.length === 0 || selected.includes(item.dataset.category);
        const price = Number(item.dataset.price);
        const priceMatches = price >= min && price <= max;
        const show = categoryMatches && priceMatches;
        item.hidden = !show;
        if (show) visible += 1;
      });
      if (count)
        count.textContent = `${visible} ${visible === 1 ? "товар" : visible >= 2 && visible <= 4 ? "товара" : "товаров"}`;
      if (empty) empty.hidden = visible !== 0;
    }

    filterForm.addEventListener("submit", applyFilters);
    filterForm.addEventListener("reset", () =>
      window.setTimeout(() => {
        items.forEach((item) => {
          item.hidden = false;
        });
        if (count) count.textContent = `${items.length} товаров`;
        if (empty) empty.hidden = true;
      }, 0),
    );
  }
});
