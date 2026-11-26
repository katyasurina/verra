import { useState } from "react";
import { formatPrice } from "../lib/catalog";
import { useT } from "../lib/i18n";
import { monthlyPayment } from "../lib/mortgage";

/** Indicative annuity-loan calculator. */
export function Mortgage({ price }: { price: number }) {
  const t = useT();
  const [down, setDown] = useState(30); // % of price
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(7);

  const { loan, monthly, total } = monthlyPayment(price, down, years, rate);

  return (
    <section className="mort" aria-labelledby="mort-h">
      <h3 id="mort-h">{t("Mortgage calculator")}</h3>
      <div className="mort-grid">
        <div className="mort-in">
          <label>
            <span>
              {t("Down payment")} <b>{down}% · {formatPrice(Math.round((price * down) / 100))}</b>
            </span>
            <input type="range" min={10} max={80} step={5} value={down} onChange={(e) => setDown(+e.target.value)} />
          </label>
          <label>
            <span>
              {t("Term")} <b>{years} {t("years")}</b>
            </span>
            <input type="range" min={5} max={30} step={1} value={years} onChange={(e) => setYears(+e.target.value)} />
          </label>
          <label>
            <span>
              {t("Interest rate")} <b>{rate}%</b>
            </span>
            <input type="range" min={1} max={15} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} />
          </label>
        </div>
        <div className="mort-out">
          <small>{t("Monthly payment")}</small>
          <strong>{formatPrice(Math.round(monthly))}</strong>
          <dl>
            <div>
              <dt>{t("Loan amount")}</dt>
              <dd>{formatPrice(Math.round(loan))}</dd>
            </div>
            <div>
              <dt>{t("Total overpayment")}</dt>
              <dd>{formatPrice(Math.round(total - loan))}</dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="hint">{t("Indicative calculation. Final terms depend on the bank.")}</p>
    </section>
  );
}
