import type { ReactNode } from "react";
import { Footer } from "../Footer";
import { SiteNav } from "../SiteNav";

/** Layout of every inner page: sticky glass nav, content, footer. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="subhead">
        <SiteNav />
      </div>
      <main className="page wrap" id="content" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
