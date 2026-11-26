/** Placeholder team. Replace names, roles and bios with the real people. */
export interface Advisor {
  id: string;
  name: string;
  role: { en: string; ua: string };
  area: { en: string; ua: string };
  bio: { en: string; ua: string };
  languages: string;
}

export const team: Advisor[] = [
  {
    id: "olena",
    name: "Olena Marchenko",
    role: { en: "Founding partner", ua: "Співзасновниця" },
    area: { en: "Pechersk · Lypky · Podil", ua: "Печерськ · Липки · Поділ" },
    bio: {
      en: "Fourteen years in Kyiv residential property. Olena reads a building before she reads the price and still measures every flat herself.",
      ua: "Чотирнадцять років у житловій нерухомості Києва. Олена спершу «читає» будівлю, а потім ціну, і досі сама міряє кожну квартиру.",
    },
    languages: "UA · EN",
  },
  {
    id: "andrii",
    name: "Andrii Kovalenko",
    role: { en: "Senior advisor, houses", ua: "Старший радник, будинки" },
    area: { en: "Koncha-Zaspa · Kozyn", ua: "Конча-Заспа · Козин" },
    bio: {
      en: "Specialises in houses and plots around Kyiv: land rights, utilities and the things a viewing never shows.",
      ua: "Спеціалізується на будинках і ділянках навколо Києва: права на землю, комунікації та все, чого не видно на перегляді.",
    },
    languages: "UA · EN · PL",
  },
  {
    id: "iryna",
    name: "Iryna Savchenko",
    role: { en: "Advisor, Odesa and the coast", ua: "Радниця, Одеса й узбережжя" },
    area: { en: "Odesa · Arcadia", ua: "Одеса · Аркадія" },
    bio: {
      en: "Works with buyers abroad. One advisor, one number and a full video walk-through before anyone travels.",
      ua: "Працює з покупцями з-за кордону. Один радник, один номер і повний відеоогляд ще до того, як хтось вирушить у дорогу.",
    },
    languages: "UA · EN · DE",
  },
];
