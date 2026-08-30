import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../../lib/cn.js";

const STEP = 21;

const enClass =
  "whitespace-nowrap text-[11px] font-bold uppercase leading-none tracking-[0.32em] text-primary-600/[0.14] dark:text-primary-400/[0.14]";
const arClass =
  "whitespace-nowrap text-[11px] font-bold leading-none tracking-[0.18em] text-amber-600/[0.12] dark:text-amber-400/[0.12]";

export default function RawanPattern() {
  const enSampleRef = useRef(null);
  const arSampleRef = useRef(null);

  const [layout, setLayout] = useState({ w: 1280, h: 800, en: 60, ar: 60 });

  useLayoutEffect(() => {
    const measure = () => {
      const en = enSampleRef.current?.getBoundingClientRect().width;
      const ar = arSampleRef.current?.getBoundingClientRect().width;
      setLayout({
        w: window.innerWidth,
        h: window.innerHeight,
        en: en || 60,
        ar: ar || 60,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const band = Math.max(layout.w, layout.h) * 3;
  const rows = Math.min(260, Math.ceil((layout.w + layout.h) / STEP) + 12);
  const enRepeats = Math.min(320, Math.ceil(band / layout.en) + 8);
  const arRepeats = Math.min(320, Math.ceil(band / layout.ar) + 8);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <span ref={enSampleRef} className={cn(enClass, "invisible absolute")}>
        rawan
      </span>
      <span
        ref={arSampleRef}
        lang="ar"
        dir="rtl"
        className={cn(arClass, "invisible absolute")}
        style={{ fontFamily: "'Noto Naskh Arabic', 'Geeza Pro', sans-serif" }}
      >
        روان
      </span>

      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 rotate-[45deg] origin-center flex-col gap-2.5 md:left-0 md:top-0"
        style={{ width: band }}
      >
        {Array.from({ length: rows }).map((_, i) => {
          const isArabic = i % 2 !== 0;
          return (
            <span
              key={i}
              lang={isArabic ? "ar" : undefined}
              dir={isArabic ? "rtl" : undefined}
              style={
                isArabic
                  ? { fontFamily: "'Noto Naskh Arabic', 'Geeza Pro', sans-serif" }
                  : undefined
              }
              className={cn(isArabic ? arClass : enClass)}
            >
              {isArabic ? "روان ".repeat(arRepeats) : "rawan ".repeat(enRepeats)}
            </span>
          );
        })}
      </div>
    </div>
  );
}