import { setLang, useLang } from "../lib/i18n";

export function LangSwitch() {
  const lang = useLang();
  return (
    <span className="lang" role="group" aria-label="Language">
      <button type="button" aria-pressed={lang === "ua"} onClick={() => setLang("ua")}>
        UA
      </button>
      {" / "}
      <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")}>
        EN
      </button>
    </span>
  );
}
