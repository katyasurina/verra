/** Legal text. This is a template: have it reviewed by a lawyer before commercial use. */
export interface LegalSection {
  h: { en: string; ua: string };
  p: { en: string; ua: string };
}

export const privacy: LegalSection[] = [
  {
    h: { en: "What we collect", ua: "Які дані ми збираємо" },
    p: {
      en: "When you send an enquiry we receive your name, your phone number or email, the date and time you prefer, the questions you choose and any message you write. We also store your favourites and comparison list in your own browser (localStorage); they never leave your device.",
      ua: "Коли ви надсилаєте запит, ми отримуємо ваше ім'я, телефон або email, бажані дату й час, обрані запитання та повідомлення, якщо ви його напишете. Список обраного й порівняння зберігається лише у вашому браузері (localStorage) і не залишає ваш пристрій.",
    },
  },
  {
    h: { en: "Why we use it", ua: "Навіщо ми це використовуємо" },
    p: {
      en: "Only to answer your enquiry and to arrange a viewing. We do not sell your data and we do not use it for unrelated advertising.",
      ua: "Лише для того, щоб відповісти на ваш запит і домовитись про перегляд. Ми не продаємо ваші дані й не використовуємо їх для сторонньої реклами.",
    },
  },
  {
    h: { en: "Who processes it", ua: "Хто це обробляє" },
    p: {
      en: "Enquiries are delivered to our advisors through Telegram and, if you left an email, a confirmation is sent by an email provider. The site is hosted on Vercel. If analytics is enabled, anonymous page-view statistics are collected with Google Analytics.",
      ua: "Запити доставляються нашим радникам через Telegram, а якщо ви залишили email, підтвердження надсилає поштовий сервіс. Сайт розміщений на Vercel. Якщо увімкнена аналітика, анонімна статистика переглядів збирається через Google Analytics.",
    },
  },
  {
    h: { en: "How long we keep it", ua: "Як довго ми це зберігаємо" },
    p: {
      en: "Enquiries are kept for as long as needed to complete your request and for up to 24 months afterwards, unless you ask us to delete them earlier.",
      ua: "Запити зберігаються стільки, скільки потрібно для виконання вашого запиту, і до 24 місяців після цього, якщо ви не попросите видалити їх раніше.",
    },
  },
  {
    h: { en: "Your rights", ua: "Ваші права" },
    p: {
      en: "You can ask us to show, correct or delete your data at any time by writing to hello@verra.estate.",
      ua: "Ви можете в будь-який час попросити нас показати, виправити чи видалити ваші дані, написавши на hello@verra.estate.",
    },
  },
];

export const terms: LegalSection[] = [
  {
    h: { en: "Information only", ua: "Лише інформація" },
    p: {
      en: "The content of this site is for information and is not a public offer. Prices, areas and availability may change without notice and are confirmed only in a written agreement.",
      ua: "Матеріали цього сайту мають інформаційний характер і не є публічною пропозицією. Ціни, площі та наявність можуть змінюватися без попередження й підтверджуються лише письмовим договором.",
    },
  },
  {
    h: { en: "Calculators and maps", ua: "Калькулятори й карти" },
    p: {
      en: "The mortgage calculator gives an indicative figure only; final terms are set by the bank. Maps show the approximate area, not the exact address.",
      ua: "Іпотечний калькулятор дає лише орієнтовний результат; остаточні умови визначає банк. Карти показують приблизний район, а не точну адресу.",
    },
  },
  {
    h: { en: "Photos and text", ua: "Фото й тексти" },
    p: {
      en: "Photographs, texts and the site design belong to Verra Estates or their respective authors and may not be copied without permission.",
      ua: "Фотографії, тексти та дизайн сайту належать Verra Estates або їхнім авторам і не можуть копіюватися без дозволу.",
    },
  },
  {
    h: { en: "Contact", ua: "Контакти" },
    p: {
      en: "Questions about these terms: hello@verra.estate.",
      ua: "Запитання щодо цих умов: hello@verra.estate.",
    },
  },
];
