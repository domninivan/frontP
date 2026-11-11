/* Интерактивность учебного проекта на чистом JavaScript.
   Внешние библиотеки (Bootstrap и аналоги) не используются.
   Заявки не отправляются на сервер — это демонстрационный режим. */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. Мобильное меню («бургер») ---------- */
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

  /* ---------- 2. Диалог быстрого заказа (нативный <dialog>) ---------- */
  const orderDialog = document.getElementById("orderModal");
  const modalProduct = document.getElementById("quick-product");

  document.querySelectorAll("[data-open-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      if (modalProduct) modalProduct.value = button.dataset.product || "";
      if (orderDialog) orderDialog.showModal();
    });
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

  /* ---------- 3. Всплывающее уведомление (тост) ---------- */
  const toast = document.getElementById("siteToast");
  const toastMessage = document.getElementById("toastMessage");
  let toastTimer = null;

  function showMessage(message) {
    if (!toast || !toastMessage) {
      window.alert(message);
      return;
    }
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

  /* ---------- 4. Проверка форм ---------- */
  function validateForm(form) {
    if (!form) return false;
    form.classList.add("was-validated");
    return form.checkValidity();
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
      const product = modalProduct?.value || "выбранный товар";
      quickForm.reset();
      quickForm.classList.remove("was-validated");
      orderDialog?.close();
      showMessage(
        `Заявка на «${product}» оформлена в демонстрационном режиме.`,
      );
    });
  }

  const fullForm = document.getElementById("fullOrderForm");
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

  /* ---------- 5. Карусель на главной ---------- */
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

  /* ---------- 6. Фильтры каталога ---------- */
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

      if (count) {
        count.textContent = `${visible} ${
          visible === 1
            ? "товар"
            : visible >= 2 && visible <= 4
              ? "товара"
              : "товаров"
        }`;
      }
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
