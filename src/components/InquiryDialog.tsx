import { useEffect, useRef, useState, type FormEvent } from "react";
import { contact } from "../data/content";
import { track } from "../lib/analytics";
import { useT, useLang } from "../lib/i18n";
import { useInquiryRequest } from "../lib/store";

type Status = "idle" | "sending" | "sent" | "error";

const looksLikeContact = (v: string): boolean => /^\S+@\S+\.\S+$/.test(v.trim()) || v.replace(/\D/g, "").length >= 9;

export function InquiryDialog() {
  const t = useT();
  const lang = useLang();
  const request = useInquiryRequest();
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!request) return;
    setStatus("idle");
    setFieldError("");
    setMessage(request.note ?? "");
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
          message: message.trim(),
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
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder={t("Preferred date or questions")} aria-label={t("Preferred date or questions")} />
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
