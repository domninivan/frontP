/* Валидация форм заявки (КР №4, требования 6 и 7).
   Проверка выполняется в браузере: обязательные поля, минимальная длина
   имени, формат e-mail, формат телефона (+7 (900) 000-00-00), согласие
   на обработку данных. Сообщения об ошибках выводятся на страницу рядом
   с полями (классы .was-validated / .invalid-feedback), а подтверждение
   отправки — всплывающим уведомлением. alert() не используется. */

/* Проверка телефона: +7 (900) 123-45-67 */
function isValidPhone(phone) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone);
}

/* Помечает форму проверенной — ошибки становятся видимыми на странице. */
function validateForm(form) {
  if (!form) return false;
  form.classList.add("was-validated");
  return form.checkValidity();
}

/* Заполняет селект «Товар» на странице заявки из массива products.
   Статичные варианты («Выберите товар», «Консультация») сохраняются,
   товары вставляются перед «Консультацией». */
function fillProductSelect() {
  const select = document.getElementById("page-product");
  if (!select) return;
  const before = [...select.options].find(
    (option) => option.textContent === "Консультация",
  );
  products.forEach((product) => {
    const exists = [...select.options].some(
      (option) => option.value === product.name,
    );
    if (exists) return;
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = `${product.name} — ${formatPrice(product.price)}`;
    select.insertBefore(option, before || null);
  });
}

function initForms(showMessage) {
  /* Дополнительная проверка телефона поверх нативной: если браузер
     не поймал неверный формат, подсвечиваем поле вручную. */
  function checkPhone(form) {
    const phone = form.querySelector('input[name="phone"]');
    if (!phone) return;
    if (phone.value !== "" && !isValidPhone(phone.value)) {
      phone.setCustomValidity("Неверный формат телефона");
    } else {
      phone.setCustomValidity("");
    }
  }

  const quickForm = document.getElementById("quickOrderForm");
  if (quickForm) {
    quickForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!validateForm(quickForm)) {
        quickForm.querySelector(":invalid")?.focus();
        return;
      }
      /* Связка заявки с корзиной: id товара запоминает main.js при
         открытии диалога (data-product-id на поле #quick-product).
         Заявка на товар из каталога добавляет его в корзину. */
      const productInput = document.getElementById("quick-product");
      const productId = Number(productInput?.dataset.productId);
      const knownProduct = products.some((item) => item.id === productId);
      if (knownProduct) addItemToCart(productId);
      const product = productInput?.value || "выбранный товар";
      quickForm.reset();
      quickForm.classList.remove("was-validated");
      document.getElementById("orderModal")?.close();
      showMessage(
        knownProduct
          ? `Заявка на «${product}» оформлена, товар добавлен в корзину (демонстрационный режим).`
          : `Заявка на «${product}» оформлена в демонстрационном режиме.`,
      );
    });
  }

  const fullForm = document.getElementById("fullOrderForm");
  if (fullForm) {
    fullForm.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      checkPhone(fullForm);
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

  fillProductSelect();
}
