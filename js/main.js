/* Инициализация страниц учебного проекта на чистом JavaScript (КР №4).
   Подключаемые файлы: js/data.js (массив товаров), js/render.js (отрисовка
   карточек), js/search.js (поиск), js/filters.js (фильтры и сортировка),
   js/form.js (валидация форм), js/main.js — точка входа.
   Внешние библиотеки не используются. Заявки не отправляются на сервер —
   это демонстрационный режим. */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. Каталог: карточки из массива, поиск, фильтры, сортировка ---------- */
  /* Важно: карточки создаются до привязки обработчиков кнопок «Заказать». */
  initCatalog();

  /* ---------- 2. Всплывающее уведомление (тост) ---------- */
  const toast = document.getElementById("siteToast");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = null;

  function showMessage(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add("toast--visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 5000);
  }

  if (toast) {
    toast
      .querySelector(".toast__close")
      ?.addEventListener("click", () =>
        toast.classList.remove("toast--visible"),
      );
  }

  /* ---------- 2a. Корзина (js/cart.js) ---------- */
  initCart(showMessage);

  /* ---------- 3. Мобильное меню («бургер») ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNavigation");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Открыть меню" : "Закрыть меню",
      );
      mainNav.classList.toggle("site-nav--open", !isOpen);
    });

    // Закрываем меню при переходе по ссылке (удобно на телефоне)
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("site-nav--open");
      });
    });
  }

  /* ---------- 4. Диалог быстрого заказа (нативный <dialog>) ---------- */
  const orderDialog = document.getElementById("orderModal");
  const modalProduct = document.getElementById("quick-product");

  /* Делегирование: обработчик ловит клики и на статичных кнопках,
     и на карточках, созданных заново при перерисовке каталога.
     Связка с товаром: кнопка несёт data-product-id (id из массива
     products), название подставляется из данных, а id запоминается
     на поле формы — после отправки заявки по нему товар попадёт
     в корзину (js/form.js). */
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-dialog]");
    if (!button) return;
    if (modalProduct) {
      const productId = Number(button.dataset.productId);
      const product = products.find((item) => item.id === productId);
      modalProduct.value = product
        ? product.name
        : button.dataset.product || "";
      modalProduct.dataset.productId = product ? String(product.id) : "";
    }
    if (orderDialog) orderDialog.showModal();
  });

  if (orderDialog) {
    // Закрытие по кнопкам «Отмена» и «×»
    orderDialog.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => orderDialog.close());
    });

    // Закрытие по клику на затемнённый фон
    orderDialog.addEventListener("click", (event) => {
      if (event.target === orderDialog) orderDialog.close();
    });
  }

  /* ---------- 5. Валидация форм заявки ---------- */
  initForms(showMessage);

  /* ---------- 6. Карусель на главной ---------- */
  document.querySelectorAll(".carousel").forEach((root) => {
    const slides = [...root.querySelectorAll(".carousel__slide")];
    const indicators = [...root.querySelectorAll(".carousel__indicator")];
    const prevButton = root.querySelector(".carousel__control--prev");
    const nextButton = root.querySelector(".carousel__control--next");
    const interval = Number(root.dataset.interval || 4500);
    let current = 0;
    let timer = null;

    if (slides.length === 0) return;

    function render() {
      slides.forEach((slide, index) => {
        slide.classList.toggle("carousel__slide--active", index === current);
      });
      indicators.forEach((dot, index) => {
        dot.classList.toggle("carousel__indicator--active", index === current);
        dot.setAttribute("aria-current", index === current ? "true" : "false");
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      render();
    }

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    function startAutoplay() {
      stopAutoplay();
      timer = window.setInterval(next, interval);
    }

    function stopAutoplay() {
      if (timer) window.clearInterval(timer);
      timer = null;
    }

    nextButton?.addEventListener("click", () => {
      next();
      startAutoplay();
    });

    prevButton?.addEventListener("click", () => {
      prev();
      startAutoplay();
    });

    indicators.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        goTo(index);
        startAutoplay();
      });
    });

    // Пауза при наведении и фокусе
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);
    root.addEventListener("focusin", stopAutoplay);
    root.addEventListener("focusout", startAutoplay);

    // Свайп на сенсорных экранах
    let startX = null;
    root.addEventListener(
      "touchstart",
      (event) => {
        startX = event.touches[0].clientX;
        stopAutoplay();
      },
      { passive: true },
    );
    root.addEventListener(
      "touchend",
      (event) => {
        if (startX === null) return;
        const deltaX = event.changedTouches[0].clientX - startX;
        if (Math.abs(deltaX) > 40) {
          if (deltaX < 0) next();
          else prev();
        }
        startX = null;
        startAutoplay();
      },
      { passive: true },
    );

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      startAutoplay();
    }
    render();
  });

  /* ---------- 7. Кнопка «Наверх» ---------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const toggleVisibility = () => {
      backToTop.classList.toggle("back-to-top--visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();

    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
