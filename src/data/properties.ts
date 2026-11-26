import { photo } from "./media";

export type PropertyType = "Apartment" | "Penthouse" | "House" | "Villa" | "Townhouse";
export type PropertyStatus = "Available" | "New" | "Under offer";

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
  /** "District, City" — the part before the comma is the filter value */
  location: string;
  price: number;
  area: number;
  beds: number;
  baths: number;
  year: number;
  status: PropertyStatus;
  image: string;
  /** CSS background-position of the cover photo */
  position?: string;
  /** Aspect-ratio tone class used by the photo placeholder gradient */
  tone: "t2" | "t3" | "t4" | "t5";
  /** photos for the detail page (the first one is the cover) */
  gallery: string[];
  /** approximate coordinates, used only for the map area */
  lat: number;
  lng: number;
  desc: { en: string; ua: string };
  features: string[];
}

export const PROPERTY_TYPES: PropertyType[] = ["Apartment", "Penthouse", "House", "Villa", "Townhouse"];

// NOTE: photos 6–14 re-use the existing picture pool. Replace `image` / `gallery` with real photos
// (upload to Cloudinary and paste the URL) when they are available.
const P = photo;

export const properties: Property[] = [
  {
    id: 0, name: "The Aurel Residence", type: "Apartment", location: "Pechersk, Kyiv", price: 1180000, area: 142, beds: 3, baths: 2, year: 2019, status: "Available",
    image: P.aurel, tone: "t2", gallery: [P.aurel, P.about2, P.quiet], lat: 50.4285, lng: 30.5460,
    desc: {
      en: "A calm three-bedroom apartment in a stone building on a quiet Pechersk street. High ceilings, oak floors and a living room that opens onto a south-facing balcony.",
      ua: "Спокійна трикімнатна квартира в кам'яному будинку на тихій вулиці Печерська. Високі стелі, дубова підлога та вітальня з виходом на південний балкон.",
    },
    features: ["Elevator", "Parking", "Concierge", "Underfloor heating"],
  },
  {
    id: 1, name: "Skyline Penthouse", type: "Penthouse", location: "Pechersk, Kyiv", price: 2950000, area: 268, beds: 4, baths: 4, year: 2022, status: "New",
    image: P.skyline, tone: "t3", gallery: [P.skyline, P.about2, P.about1M], lat: 50.4310, lng: 30.5390,
    desc: {
      en: "A glass-and-concrete penthouse above the Dnipro hills with a wrap-around terrace. Floor-to-ceiling windows, a private lift lobby and views of the river and the lavra.",
      ua: "Пентхаус зі скла й бетону над дніпровськими схилами з терасою по периметру. Панорамні вікна, приватний ліфтовий хол та краєвиди на річку й лавру.",
    },
    features: ["Terrace", "Panoramic windows", "Smart home", "Parking", "Concierge"],
  },
  {
    id: 2, name: "Forest House", type: "House", location: "Koncha-Zaspa", price: 3400000, area: 410, beds: 5, baths: 5, year: 2021, status: "Under offer",
    image: P.forest, tone: "t4", gallery: [P.forest, P.about2, P.konchaL], lat: 50.2650, lng: 30.5600,
    desc: {
      en: "A dark timber-and-stone house set among pines. Open living areas, a fireplace, a sauna and a deep terrace that looks straight into the forest.",
      ua: "Будинок із темного дерева й каменю серед сосен. Відкриті житлові зони, камін, сауна та глибока тераса з виглядом прямо в ліс.",
    },
    features: ["Fireplace", "Sauna", "Forest view", "Garden", "Smart home", "Parking"],
  },
  {
    id: 3, name: "Linea Townhouse", type: "Townhouse", location: "Kozyn", price: 690000, area: 186, beds: 3, baths: 3, year: 2023, status: "Available",
    image: P.linea, tone: "t5", gallery: [P.linea, P.quiet, P.kozynL], lat: 50.2330, lng: 30.6800,
    desc: {
      en: "A new three-level townhouse on the Dnipro embankment with its own entrance, a small garden and a roof terrace. Quiet, family-friendly and 35 minutes from the centre.",
      ua: "Новий триповерховий таунхаус на набережній Дніпра з окремим входом, садом і терасою на даху. Тихо, комфортно для родини, 35 хвилин до центру.",
    },
    features: ["Private entrance", "Garden", "Terrace", "Parking", "River view"],
  },
  {
    id: 4, name: "The Quiet Apartment", type: "Apartment", location: "Lypky, Kyiv", price: 540000, area: 96, beds: 2, baths: 1, year: 1912, status: "Available",
    image: P.quiet, tone: "t2", gallery: [P.quiet, P.lypkyL, P.about2], lat: 50.4400, lng: 30.5350,
    desc: {
      en: "A restored two-bedroom in a historic building in Lypky: tall windows, original mouldings and a bright, quiet courtyard side.",
      ua: "Відреставрована двокімнатна квартира в історичному будинку на Липках: високі вікна, оригінальна ліпнина й світлий тихий двір.",
    },
    features: ["Elevator", "Storage", "Home office"],
  },
  {
    id: 5, name: "Casa Verde", type: "Villa", location: "Odesa", price: 1850000, area: 320, beds: 5, baths: 4, year: 2020, status: "Available",
    image: P.casa, tone: "t3", gallery: [P.casa, P.odesaL, P.about2], lat: 46.4400, lng: 30.7700,
    desc: {
      en: "A terraced villa above the sea in Arcadia: an infinity pool, olive trees and five bedrooms that all face the water.",
      ua: "Вілла-тераса над морем в Аркадії: басейн з переливом, оливкові дерева та п'ять спалень із виглядом на воду.",
    },
    features: ["Pool", "Sea view", "Terrace", "Garden", "Parking", "Smart home"],
  },
  {
    id: 6, name: "Riverside Loft", type: "Apartment", location: "Podil, Kyiv", price: 485000, area: 118, beds: 2, baths: 2, year: 2018, status: "New",
    image: P.podilL, tone: "t5", position: "50% 50%", gallery: [P.podilL, P.quiet, P.about2], lat: 50.4660, lng: 30.5150,
    desc: {
      en: "A converted brick warehouse loft on the Podil embankment. Double-height windows, exposed brick and a walkable river promenade at the door.",
      ua: "Лофт у відремонтованому цегляному складі на набережній Подолу. Вікна у двох рівнях, відкрита цегла та прогулянкова набережна біля дверей.",
    },
    features: ["River view", "Storage", "Home office", "Elevator"],
  },
  {
    id: 7, name: "Dnipro Terrace", type: "Penthouse", location: "Podil, Kyiv", price: 1420000, area: 205, beds: 3, baths: 3, year: 2021, status: "Available",
    image: P.skyline, position: "80% 30%", tone: "t3", gallery: [P.skyline, P.about2, P.podilL], lat: 50.4700, lng: 30.5200,
    desc: {
      en: "A top-floor apartment with a 60 m² terrace over the Dnipro and the left bank. Built-in storage, a dressing room and full smart-home control.",
      ua: "Квартира на верхньому поверсі з терасою 60 м² над Дніпром і лівим берегом. Вбудовані системи зберігання, гардеробна та повне розумне керування домом.",
    },
    features: ["Terrace", "River view", "Smart home", "Parking", "Elevator"],
  },
  {
    id: 8, name: "Lypky Gallery Apartment", type: "Apartment", location: "Lypky, Kyiv", price: 890000, area: 128, beds: 3, baths: 2, year: 2016, status: "Available",
    image: P.lypkyL, tone: "t2", position: "50% 40%", gallery: [P.lypkyL, P.quiet, P.about2], lat: 50.4420, lng: 30.5330,
    desc: {
      en: "A three-bedroom with a long gallery hall and wall space for art, in a leafy street a few minutes from the government quarter.",
      ua: "Трикімнатна квартира з довгим холом-галереєю та стінами для мистецтва, на зеленій вулиці за кілька хвилин від урядового кварталу.",
    },
    features: ["Elevator", "Concierge", "Underfloor heating", "Storage"],
  },
  {
    id: 9, name: "Pechersk Courtyard House", type: "Townhouse", location: "Pechersk, Kyiv", price: 1650000, area: 230, beds: 4, baths: 3, year: 2020, status: "Available",
    image: P.pecherskL, tone: "t4", position: "50% 60%", gallery: [P.pecherskL, P.about2, P.quiet], lat: 50.4250, lng: 30.5510,
    desc: {
      en: "A private townhouse inside a gated courtyard in historic Pechersk: four bedrooms, a garden and a garage, a rare find in the centre.",
      ua: "Приватний таунхаус у закритому дворі історичного Печерська: чотири спальні, сад і гараж — рідкісна знахідка в центрі.",
    },
    features: ["Garden", "Parking", "Private entrance", "Fireplace"],
  },
  {
    id: 10, name: "Lakeside Villa", type: "Villa", location: "Koncha-Zaspa", price: 2750000, area: 380, beds: 5, baths: 4, year: 2022, status: "New",
    image: P.konchaL, tone: "t4", position: "48% center", gallery: [P.konchaL, P.forest, P.about2], lat: 50.2710, lng: 30.5580,
    desc: {
      en: "A low modern villa on the water's edge: glass living room, a private jetty, a pine garden and a spa floor with sauna.",
      ua: "Низька сучасна вілла на березі води: скляна вітальня, приватний пірс, сосновий сад і спа-поверх із сауною.",
    },
    features: ["Sauna", "Garden", "Forest view", "Smart home", "Parking", "Pool"],
  },
  {
    id: 11, name: "Olive Hill House", type: "House", location: "Koncha-Zaspa", price: 1980000, area: 295, beds: 4, baths: 3, year: 2019, status: "Available",
    image: P.whyM, tone: "t5", position: "70% center", gallery: [P.whyM, P.about2, P.konchaL], lat: 50.2600, lng: 30.5700,
    desc: {
      en: "A sculpted plaster house on a hill with soft curved walls, olive trees and long evening light. Quiet, private and unlike anything else on the market.",
      ua: "Скульптурний будинок із м'якими вигнутими стінами на пагорбі, з оливковими деревами та довгим вечірнім світлом. Тихий, приватний і несхожий на інші.",
    },
    features: ["Garden", "Terrace", "Fireplace", "Parking"],
  },
  {
    id: 12, name: "Waterfront Loft", type: "Apartment", location: "Kozyn", price: 420000, area: 84, beds: 2, baths: 1, year: 2023, status: "Available",
    image: P.kozynL, tone: "t5", position: "60% center", gallery: [P.kozynL, P.quiet, P.about2], lat: 50.2300, lng: 30.6860,
    desc: {
      en: "A bright two-bedroom on the Kozyn waterfront. Walk to the promenade, the marina and the beach; the best price per square metre in our selection.",
      ua: "Світла двокімнатна квартира на набережній Козина. Пішки до променаду, марини та пляжу; найкраща ціна за квадратний метр у нашій підбірці.",
    },
    features: ["River view", "Parking", "Storage"],
  },
  {
    id: 13, name: "Kozyn Garden House", type: "House", location: "Kozyn", price: 1150000, area: 260, beds: 4, baths: 3, year: 2018, status: "Under offer",
    image: P.about1M, tone: "t3", position: "50% 60%", gallery: [P.about1M, P.about2, P.linea], lat: 50.2250, lng: 30.6750,
    desc: {
      en: "A single-storey house with a deep garden. Every room opens to the terrace; warm lighting and wood details make it feel lived in from day one.",
      ua: "Одноповерховий будинок із глибоким садом. Кожна кімната виходить на терасу; тепле освітлення й дерев'яні деталі створюють відчуття дому з першого дня.",
    },
    features: ["Garden", "Terrace", "Underfloor heating", "Parking", "Home office"],
  },
  {
    id: 14, name: "Arcadia Sea Villa", type: "Villa", location: "Odesa", price: 1290000, area: 190, beds: 3, baths: 3, year: 2021, status: "New",
    image: P.odesaL, tone: "t3", position: "50% 60%", gallery: [P.odesaL, P.casa, P.about2], lat: 46.4290, lng: 30.7640,
    desc: {
      en: "A white terraced villa among cypress and lavender, five minutes from the Arcadia beaches, with sea views from every floor.",
      ua: "Біла вілла-тераса серед кипарисів і лаванди, п'ять хвилин до пляжів Аркадії, з видом на море з кожного поверху.",
    },
    features: ["Sea view", "Terrace", "Garden", "Parking"],
  },
];

export const getProperty = (id: number): Property | undefined => properties.find((p) => p.id === id);
