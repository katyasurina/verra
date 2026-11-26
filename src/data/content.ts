import { photo } from "./media";

export interface Location {
  name: string;
  note: string;
  alt: string;
  image: string;
  /** CSS background-position for the arch photo */
  position: string;
}

export const locations: Location[] = [
  { name: "Pechersk", note: "Historic core", alt: "Historic street in Pechersk", image: photo.pechersk, position: "50% 60%" },
  { name: "Lypky", note: "Quiet, leafy, central", alt: "Leafy street in Lypky", image: photo.lypky, position: "50% 50%" },
  { name: "Podil", note: "Riverside lofts", alt: "Riverside lofts in Podil", image: photo.podil, position: "28% center" },
  { name: "Koncha-Zaspa", note: "Forest and lakes", alt: "Modern house on a forest lake", image: photo.koncha, position: "48% center" },
  { name: "Kozyn", note: "Dnipro waterfront", alt: "Dnipro waterfront in Kozyn", image: photo.kozyn, position: "60% center" },
  { name: "Odesa", note: "Sea-facing villas", alt: "Sea-facing villa in Odesa", image: photo.odesa, position: "50% 60%" },
];

export interface Testimonial {
  quote: string;
  author: string;
  home: string;
  /** initial tilt in degrees for the "dropping note" entrance */
  tilt: number;
}

export const testimonials: Testimonial[] = [
  { quote: "They talked us out of the first apartment we liked. Three weeks later we understood why.", author: "Olena & Maksym K.", home: "The Quiet Apartment, Lypky", tilt: -3 },
  { quote: "Every number was in one file before the viewing. No surprises at the notary.", author: "Andriy S.", home: "Linea Townhouse, Kozyn", tilt: 2.5 },
  { quote: "We bought from abroad and never felt the distance. One advisor, one number, keys on the day.", author: "Iryna V.", home: "Casa Verde, Odesa", tilt: -2 },
];

export const reasons: { title: string; text: string }[] = [
  { title: "Architecture first.", text: "We read structure, light and site before we read the price." },
  { title: "Visited and measured.", text: "Every home is seen by us in person. The plans you receive are our own." },
  { title: "One advisor, start to finish.", text: "From the first viewing to the handover of the keys, with legal support in-house." },
  { title: "Quiet market access.", text: "Part of our portfolio is never listed publicly." },
];

export const stats: { to: number; pre?: string; suf?: string; label: string }[] = [
  { to: 14, label: "Years on the market" },
  { to: 240, label: "Homes placed" },
  { to: 310, pre: "€", suf: "M", label: "Transaction volume" },
  { to: 96, suf: "%", label: "Clients who return or refer" },
];

export const contact = {
  phone: "+380 44 000 00 00",
  phoneHref: "tel:+380440000000",
  email: "hello@verra.estate",
  address: ["12 Lypska Street", "Kyiv 01001, Ukraine"],
  hours: "Mon–Sat, 9:00–19:00",
  /** TODO: replace with the real profile links */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
};

/** Set VITE_TELEGRAM_URL (https://t.me/your_username) and VITE_WHATSAPP_URL (https://wa.me/380...) in Vercel env.
 *  Empty value = the item is hidden. */
export const social = {
  telegram: (import.meta.env.VITE_TELEGRAM_URL as string | undefined) || "",
  whatsapp: (import.meta.env.VITE_WHATSAPP_URL as string | undefined) || "",
};
