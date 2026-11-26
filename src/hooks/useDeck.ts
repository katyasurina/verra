import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { prefersReducedMotion } from "../lib/motion";

/** off → stacked (all cards in one pile) → pile (visible) → w1 (first row dealt) → w2 (second row dealt) → done */
export type DeckPhase = "off" | "stacked" | "pile" | "w1" | "w2" | "quick" | "done";

const ROTATE = [-6, 5, 0, -3, 3, 1];
const OFFSET_X = [-7, 7, 0, -3, 4, 0];
const OFFSET_Y = [-7, -1, 5, 9, 11, 14];
const Z = [6, 5, 4, -1, -2, -3];
const DELAY = [".04s", ".24s", "0s", "0s", ".2s", ".1s"];

/**
 * "Deck of cards" entrance for the catalog grid (desktop only, played once).
 * All six cards start in one pile; the first row is dealt out, then the second row once it is on screen.
 * Returns the current phase; <PropertyCard> turns it into classes. Custom properties (--dx, --dy …) are
 * written straight onto the card elements because they come from layout measurements.
 */
export function useDeck(grid: RefObject<HTMLElement | null>, total: number, getVelocity: () => number): DeckPhase {
  const [phase, setPhase] = useState<DeckPhase>("off");
  const finished = useRef(false);
  const started = useRef(false);

  // 1) set the stage before first paint
  useLayoutEffect(() => {
    if (finished.current || started.current) return;
    const canPlay = !prefersReducedMotion() && matchMedia("(min-width:861px)").matches && total >= 6;
    if (!canPlay) {
      finished.current = true;
      return;
    }
    started.current = true;
    setPhase("stacked");
  }, [total]);

  // 2) if the user filtered the list before the deck started, give up quietly
  useEffect(() => {
    if (total < 6 && !finished.current && phase !== "off") {
      finished.current = true;
      setPhase("done");
    }
  }, [total, phase]);

  // 3) measurement + trigger
  const armed = phase !== "off";
  useEffect(() => {
    if (!armed) return;
    const g = grid.current;
    if (!g) return;
    const cards = Array.from(g.querySelectorAll<HTMLElement>(".card")).slice(0, 6);
    if (cards.length < 6) return;

    const setVars = () => {
      const anchor = cards[2];
      const cx = anchor.offsetLeft + anchor.offsetWidth / 2;
      const cy = anchor.offsetTop + anchor.offsetHeight / 2;
      cards.forEach((el, k) => {
        const x = el.offsetLeft + el.offsetWidth / 2;
        const y = el.offsetTop + el.offsetHeight / 2;
        el.style.setProperty("--dx", cx - x + OFFSET_X[k] + "px");
        el.style.setProperty("--dy", cy - y + OFFSET_Y[k] + "px");
        el.style.setProperty("--rt", ROTATE[k] + "deg");
        el.style.setProperty("--z", String(Z[k]));
        el.style.setProperty("--td", DELAY[k]);
      });
    };
    setVars();

    const timers: number[] = [];
    let scrollHandler: (() => void) | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setVars();
        const quick = getVelocity() > 2.6 || cards[2].getBoundingClientRect().top < window.innerHeight * 0.35;
        if (quick) {
          setPhase("quick");
          timers.push(window.setTimeout(() => { finished.current = true; setPhase("done"); }, 900));
          return;
        }
        setPhase("pile");
        timers.push(window.setTimeout(() => setPhase("w1"), 640));

        // second row: after the first has mostly landed AND its slot is near the viewport
        let ready = false;
        let fired = false;
        const fire = () => {
          if (fired || !ready) return;
          const slotTop = g.getBoundingClientRect().top + (cards[5].offsetTop - g.offsetTop);
          if (slotTop > window.innerHeight * 0.82) return;
          fired = true;
          if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
          setPhase("w2");
          timers.push(window.setTimeout(() => { finished.current = true; setPhase("done"); }, 2720));
        };
        scrollHandler = fire;
        window.addEventListener("scroll", fire, { passive: true });
        timers.push(window.setTimeout(() => { ready = true; fire(); }, 640 + 850));
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0 },
    );
    io.observe(cards[2]);

    return () => {
      io.disconnect();
      timers.forEach(window.clearTimeout);
      if (scrollHandler) window.removeEventListener("scroll", scrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [armed]);

  return phase;
}
