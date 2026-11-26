import { useEffect, useState } from "react";
import { social, contact } from "../data/content";
import { useT } from "../lib/i18n";
import { Link, useLocation } from "../lib/router";
import { compare, openInquiry, useCompare, useToast } from "../lib/store";

/** Floating contact button, compare bar and toast. */
export function Dock() {
  const t = useT();
  const { path } = useLocation();
  const cmp = useCompare();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(path !== "/");

  // on the home page stay out of the way of the hero search
  useEffect(() => {
    if (path !== "/") {
      setShow(true);
      return;
    }
    const update = () => setShow(!document.documentElement.classList.contains("i0") && window.scrollY > window.innerHeight * 0.75);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("verra:intro-done", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("verra:intro-done", update);
    };
  }, [path]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <>
      <div className={`dock${show ? " show" : ""}`}>
        {cmp.length > 0 && path !== "/compare" && (
          <div className="cmpbar glass">
            <Link to="/compare">
              {t("Compare")} ({cmp.length}) →
            </Link>
            <button type="button" aria-label={t("Clear")} onClick={() => compare.clear()}>
              ×
            </button>
          </div>
        )}
        <div className={`fab${open ? " open" : ""}`}>
          <div className="fabmenu" role="menu" aria-hidden={!open}>
            {social.telegram && (
              <a href={social.telegram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                Telegram
              </a>
            )}
            {social.whatsapp && (
              <a href={social.whatsapp} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                WhatsApp
              </a>
            )}
            <a href={contact.phoneHref} tabIndex={open ? 0 : -1}>
              {t("Call")}
            </a>
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false);
                openInquiry();
              }}
            >
              {t("Request a viewing")}
            </button>
          </div>
          <button type="button" className="fabbtn" aria-expanded={open} aria-label={t("Contact us")} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /> : <path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />}
            </svg>
          </button>
        </div>
      </div>
      <div className={`toast${toast ? " on" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  );
}
