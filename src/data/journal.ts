import { photo } from "./media";

export interface Article {
  slug: string;
  date: string;
  minutes: number;
  image: string;
  position?: string;
  title: { en: string; ua: string };
  lead: { en: string; ua: string };
  body: { en: string[]; ua: string[] };
}

export const articles: Article[] = [
  {
    slug: "read-a-floor-plan",
    date: "2026-10-14",
    minutes: 4,
    image: photo.about2,
    position: "50% 55%",
    title: { en: "How to read a floor plan before you visit", ua: "Як читати планування ще до перегляду" },
    lead: {
      en: "Five minutes with the plan tells you more than the first half hour in the flat.",
      ua: "П'ять хвилин із плануванням розкажуть більше, ніж перші пів години в квартирі.",
    },
    body: {
      en: [
        "Start with light. Mark which walls carry windows and which direction they face. A living room that looks east gets the morning; one that faces north will feel calm and cool all day.",
        "Then follow your day through the plan. Where do you drop your keys, where does the coffee happen, how far is the bathroom from the bedroom? A good plan makes the daily route short and quiet.",
        "Look at the corridors. Long hallways are lost square metres. The best apartments use the entrance as a hub and let rooms open directly from it.",
        "Finally, check storage. Built-in wardrobes and a utility niche matter more than an extra bedroom you will use as a box room.",
      ],
      ua: [
        "Почніть зі світла. Позначте, на яких стінах є вікна і куди вони виходять. Вітальня на схід отримує ранок, а північна буде спокійною і прохолодною весь день.",
        "Потім пройдіться планом свого дня. Де ви залишаєте ключі, де буде кава, як далеко ванна від спальні? Хороше планування робить щоденний маршрут коротким і тихим.",
        "Придивіться до коридорів. Довгі коридори це втрачені квадратні метри. Найкращі квартири використовують передпокій як вузол, з якого кімнати відкриваються одразу.",
        "І наостанок перевірте зберігання. Вбудовані шафи й господарська ніша важливіші за зайву спальню, яку ви використовуватимете як комору.",
      ],
    },
  },
  {
    slug: "kyiv-districts",
    date: "2026-09-30",
    minutes: 5,
    image: photo.lypkyL,
    position: "50% 40%",
    title: { en: "Pechersk, Lypky or Podil: which Kyiv district fits you", ua: "Печерськ, Липки чи Поділ: який район Києва вам підійде" },
    lead: {
      en: "Three central districts, three very different ways to live in the city.",
      ua: "Три центральні райони, три зовсім різні способи жити в місті.",
    },
    body: {
      en: [
        "Pechersk is the historic hill: stone buildings, high ceilings, parks and the river views. It suits people who want to be central and quiet at once, and who value architecture with some age.",
        "Lypky is leafy and governmental, with small streets and a village feel a few minutes from the main avenue. Expect period apartments and the best walking in the centre.",
        "Podil is low-rise, creative and close to the water. Brick lofts and new embankment homes sit next to cafés and galleries. It is livelier in the evening than the other two.",
        "Visit each at the hour you would actually be home: the school run, a weekday evening, a Sunday morning. The district you remember kindly is usually the right one.",
      ],
      ua: [
        "Печерськ це історичний пагорб: кам'яні будинки, високі стелі, парки й краєвиди на річку. Він для тих, хто хоче бути в центрі й водночас у тиші, і цінує архітектуру з віком.",
        "Липки зелені й урядові, з маленькими вулицями та відчуттям містечка за кілька хвилин від головної магістралі. Тут історичні квартири й найкращі прогулянки в центрі.",
        "Поділ низькоповерховий, творчий і близький до води. Цегляні лофти й нові будинки на набережній стоять поруч із кафе та галереями. Увечері тут жвавіше, ніж у двох інших.",
        "Відвідайте кожен район у ту годину, коли ви реально були б удома: ранок перед школою, вечір буднього дня, недільний ранок. Район, який ви згадуєте найтепліше, зазвичай і є правильним.",
      ],
    },
  },
  {
    slug: "buying-from-abroad",
    date: "2026-09-12",
    minutes: 4,
    image: photo.odesaL,
    position: "50% 60%",
    title: { en: "Buying a home in Ukraine from abroad: a short checklist", ua: "Купівля житла в Україні з-за кордону: короткий чекліст" },
    lead: {
      en: "Distance changes the process, not the principles. A calm checklist for buyers who cannot be in the room.",
      ua: "Відстань змінює процес, але не принципи. Спокійний чекліст для покупців, які не можуть бути присутні особисто.",
    },
    body: {
      en: [
        "Ask for a full video walk-through, not only photos: every room, the windows, the stairwell, the view and the street outside. Ask to see the meter readings and the heating.",
        "Have documents checked before you pay anything: ownership, encumbrances and the technical passport. Use an independent lawyer, not only the seller's.",
        "Agree the payment route and the date of the deal in writing, and decide who can sign for you if you cannot be present.",
        "Plan the handover: keys, utility accounts and a first visit by someone you trust. This article is general information, not legal advice.",
      ],
      ua: [
        "Просіть повний відеоогляд, а не лише фото: кожна кімната, вікна, сходова клітка, вид і вулиця за вікном. Попросіть показати лічильники й опалення.",
        "Перевірте документи ще до будь-якої оплати: право власності, обтяження й технічний паспорт. Залучайте незалежного юриста, а не лише юриста продавця.",
        "Письмово погодьте спосіб оплати й дату угоди та вирішіть, хто може підписати за вас, якщо ви не зможете бути присутніми.",
        "Сплануйте передачу: ключі, рахунки за комунальні послуги та перший візит людини, якій ви довіряєте. Ця стаття має загальний інформаційний характер і не є юридичною консультацією.",
      ],
    },
  },
];

export const getArticle = (slug: string): Article | undefined => articles.find((a) => a.slug === slug);
