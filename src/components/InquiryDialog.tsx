import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact } from "../data/content";
import { track } from "../lib/analytics";
import { translate, useLang, useT } from "../lib/i18n";
import { Link } from "../lib/router";
import { useInquiryRequest } from "../lib/store";

type Status = "idle" | "sending" | "sent" | "error";

const QUESTIONS = [
  "Is the price negotiable?",
  "Can I see the floor plans and documents?",
  "Is a mortgage or instalment plan possible?",
  "Can we do the viewing by video call?",
  "What are the monthly utility costs?",
  "Is parking included?",
];
const TIMES = ["Any time", "Morning (9:00–12:00)", "Afternoon (12:00–16:00)", "Evening (16:00–19:00)"];
const today = (): string => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const looksLikeContact = (v: string): boolean => /^\S+@\S+\.\S+$/.test(v.trim()) || v.replace(/\D/g, "").length >= 9;

export function InquiryDialog() {
  const t = useT();
  const lang = useLang();
  const request = useInquiryRequest();
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [other, setOther] = useState(false);

  useEffect(() => {
    if (!request) return;
    setStatus("idle");
    setFieldError("");
    setMessage(request.note ?? "");
    setPicked([]);
    setOther(!!request.note);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, [request]);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("n") ?? "").trim();
    const phoneOrEmail = String(data.get("p") ?? "").trim();
    if (name.length < 2) return setFieldError(t("Please enter your name."));
    if (!looksLikeContact(phoneOrEmail)) return setFieldError(t("Please enter a valid phone number or email."));
    setFieldError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact: phoneOrEmail,
          date: String(data.get("date") ?? ""),
          time: String(data.get("time") ?? ""),
          // questions are sent in Ukrainian, the language of the agent who reads them
          questions: picked.map((q) => translate(q, "ua")),
          message: other ? message.trim() : "",
          subject: request?.title ?? "",
          propertyId: request?.propertyId ?? null,
          page: window.location.href,
          lang,
          website: String(data.get("website") ?? ""), // honeypot: real people leave it empty
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { property_id: request?.propertyId ?? "none" });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const close = () => dialog.current?.close();

  return (
    <dialog id="dlg" ref={dialog} aria-labelledby="d-t">
      {status !== "sent" ? (
        <form id="inq" onSubmit={submit} noValidate>
          <h3 id="d-t">{t(request?.title ?? "Request a private viewing")}</h3>
          <p>{request?.subtitle && request.propertyId == null && !request.note ? t(request.subtitle) : request?.subtitle ?? t("Leave your details. An advisor replies within one working day.")}</p>
          <input name="n" placeholder={t("Full name")} required aria-label={t("Full name")} autoComplete="name" />
          <input name="p" placeholder={t("Phone or email")} required aria-label={t("Phone or email")} autoComplete="tel" />
          <fieldset>
            <legend>{t("1. Choose a date")}</legend>
            <div className="dt">
              <input type="date" name="date" min={today()} aria-label={t("Preferred date")} />
              <select name="time" aria-label={t("Preferred time")}>
                {TIMES.map((x) => (
                  <option key={x} value={x}>
                    {t(x)}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t("2. Ask a question")}</legend>
            <div className="qchips">
              {QUESTIONS.map((q) => (
                <button key={q} type="button" className={picked.includes(q) ? "on" : ""} aria-pressed={picked.includes(q)} onClick={() => setPicked((p) => (p.includes(q) ? p.filter((x) => x !== q) : [...p, q]))}>
                  {t(q)}
                </button>
              ))}
              <button type="button" className={other ? "on" : ""} aria-pressed={other} onClick={() => setOther((o) => !o)}>
                {t("Another question…")}
              </button>
            </div>
            {other && <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder={t("Write your own question")} aria-label={t("Write your own question")} />}
          </fieldset>
          <p className="consent">
            {t("By sending this form you agree to the")}{" "}
            <Link to="/privacy" onClick={() => dialog.current?.close()}>
              {t("Privacy policy")}
            </Link>
            .
          </p>
          <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          {fieldError && (
            <p className="err" role="alert">
              {fieldError}
            </p>
          )}
          {status === "error" && (
            <p className="err" role="alert">
              {t("Could not send the request. Please call")} <a href={contact.phoneHref}>{contact.phone}</a> {t("or write to")} <a href={`mailto:${contact.email}`}>{contact.email}</a>.
            </p>
          )}
          <div className="row2">
            <button type="button" className="x" onClick={close}>
              {t("Close")}
            </button>
            <button className="btn" disabled={status === "sending"}>
              {status === "sending" ? t("Sending…") : t("Send request")} <i>↗</i>
            </button>
          </div>
        </form>
      ) : (
        <div id="ok">
          <h3 id="d-t">{t("Request sent")}</h3>
          <p>{t("Thank you. An advisor will contact you within one working day.")}</p>
          <div className="row2">
            <span />
            <button type="button" className="btn" onClick={close}>
              {t("Done")}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
