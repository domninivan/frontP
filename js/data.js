/* Массив товаров каталога (КР №4).
   Данные хранятся в JavaScript — карточки каталога генерируются
   из этого массива с помощью js/render.js. */

const products = [
  {
    id: 1,
    name: "Pro Mouse X1",
    category: "mouse",
    price: 3990,
    image: "images/product-mouse-x1.webp",
    description:
      "Лёгкая игровая мышь (68 г) с сенсором 12 000 DPI и переключателями на 20 млн нажатий.",
    badge: "Мышки",
    badgeClass: "badge badge--primary",
  },
  {
    id: 2,
    name: "Speed M2",
    category: "mouse",
    price: 4990,
    image: "images/product-mouse-speed.webp",
    description:
      "Симметричный корпус под любую руку, шесть программируемых кнопок и гибкая настройка чувствительности.",
    badge: "Мышки",
    badgeClass: "badge badge--primary",
  },
  {
    id: 3,
    name: "HyperType K87",
    category: "keyboard",
    price: 7990,
    image: "images/product-keyboard-hypertype.webp",
    description:
      "Механическая клавиатура формата TKL со съёмным кабелем USB-C и настраиваемой RGB-подсветкой.",
    badge: "Клавиатуры",
    badgeClass: "badge badge--soft",
  },
  {
    id: 4,
    name: "Office Type 100",
    category: "keyboard",
    price: 2990,
    image: "images/product-keyboard-office.webp",
    description:
      "Полноразмерная мембранная клавиатура с тихим ходом клавиш и защитой от пролитой жидкости.",
    badge: "Клавиатуры",
    badgeClass: "badge badge--soft",
  },
  {
    id: 5,
    name: "Sound Pro H5",
    category: "headset",
    price: 5490,
    image: "images/product-headset-soundpro.webp",
    description:
      "Полноразмерная гарнитура с шумоподавляющим микрофоном и мягкими амбушюрами для долгих сессий.",
    badge: "Гарнитуры",
    badgeClass: "badge badge--warning",
  },
  {
    id: 6,
    name: "Gaming Voice G1",
    category: "headset",
    price: 6490,
    image: "images/product-headset-voice.webp",
    description:
      "Гарнитура с объёмным звуком 7.1 и микрофоном на выдвижной штанге — для игр и стримов.",
    badge: "Гарнитуры",
    badgeClass: "badge badge--warning",
  },
];

/* Подписи категорий — используются при фильтрации и в селекте формы заявки. */
const categoryLabels = {
  mouse: "Мышки",
  keyboard: "Клавиатуры",
  headset: "Гарнитуры",
};
