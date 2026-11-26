/** Annuity loan: monthly payment for a price, down payment %, years and yearly rate %. */
export function monthlyPayment(price: number, downPct: number, years: number, ratePct: number): { loan: number; monthly: number; total: number } {
  const loan = price * (1 - downPct / 100);
  const n = years * 12;
  const r = ratePct / 100 / 12;
  const monthly = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n));
  return { loan, monthly, total: monthly * n };
}
