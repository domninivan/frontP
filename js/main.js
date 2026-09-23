// Получаем модальное окно по id
const orderDialog = document.getElementById("order-dialog");

// Получаем все кнопки заказа в карточках товаров
const orderButtons = document.querySelectorAll(".product-card__button");

// Получаем кнопку закрытия модального окна
const closeDialogButton = document.getElementById("close-order-dialog");

// Получаем скрытое поле для товара
const selectedProductInput = document.getElementById("selected-product");

// Перебираем все кнопки «Заказать»
orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.product;
    selectedProductInput.value = productName;
    orderDialog.showModal();
  });
});

// Закрываем модальное окно по кнопке «Закрыть»
closeDialogButton.addEventListener("click", () => {
  orderDialog.close();
});

// Получаем форму заявки
const orderForm = document.getElementById("order-form");

// Получаем сообщение об успешной отправке
const successMessage = document.getElementById("success-message");

// Обрабатываем отправку формы
orderForm.addEventListener("submit", (event) => {
  // 1. Отменяем стандартную отправку формы,
  // потому что backend пока не подключён
  event.preventDefault();

  // 2. Сбрасываем предыдущие признаки ошибок
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute("aria-invalid");
    }
  });

  // 3. Проверяем встроенные HTML-ограничения формы
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute("aria-invalid", "true");
      }
    });

    // Показываем стандартные сообщения браузера
    orderForm.reportValidity();
    return;
  }

  // 4. Если всё ок — показываем сообщение об успехе
  successMessage.hidden = false;

  // 5. Очищаем форму
  orderForm.reset();

  // 6. Закрываем модальное окно
  orderDialog.close();
});
