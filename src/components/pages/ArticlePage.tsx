import { getArticle } from "../../data/journal";
import { useLang, useT } from "../../lib/i18n";
import { usePageMeta } from "../../lib/meta";
import { Link } from "../../lib/router";
import { openInquiry } from "../../lib/store";
import { Photo } from "../Photo";
import { formatDate } from "./JournalPage";
import { NotFound } from "./NotFound";
import { PageShell } from "./PageShell";

export function ArticlePage({ slug }: { slug: string }) {
  const a = getArticle(slug);
  return a ? <Article slug={slug} /> : <NotFound />;
}

function Article({ slug }: { slug: string }) {
  const t = useT();
  const lang = useLang();
  const a = getArticle(slug)!;
  usePageMeta(`${a.title[lang]} — Verra Estates`, a.lead[lang], a.image, {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title.en,
    datePublished: a.date,
    image: a.image,
  });
  return (
    <PageShell>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/journal">← {t("Journal")}</Link>
        <span>
          {formatDate(a.date, lang)} · {a.minutes} {t("min read")}
        </span>
      </nav>
      <article className="article">
        <h1 className="pd-h">{a.title[lang]}</h1>
        <p className="lead">{a.lead[lang]}</p>
        <Photo className="cover" tone="t3" src={a.image} position={a.position} label={a.title[lang]} eager />
        {a.body[lang].map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <div className="article-cta glass light">
          <strong>{t("Questions about your own search?")}</strong>
          <button type="button" className="btn" onClick={() => openInquiry({ title: "Talk to an advisor", subtitle: a.title[lang] })}>
            {t("Talk to an advisor")} <i>↗</i>
          </button>
        </div>
      </article>
    </PageShell>
  );
}
