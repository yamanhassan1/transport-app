import { useLayoutEffect, useMemo, useState } from "react";
import { useTheme } from "../../../context/ThemeContext.jsx";

const STEP = 32;
const PITCH = 72;
const HALO = 220;

const THEME_COLORS = {
  light: { en: "#008f5b", ar: "#d97706", enOpacity: 0.16, arOpacity: 0.12 },
  dark: { en: "#2bd188", ar: "#fbbf24", enOpacity: 0.14, arOpacity: 0.12 },
};

const AR_FONT = "'Noto Naskh Arabic', 'Geeza Pro', sans-serif";

function buildLines(w, h) {
  const lines = [];
  const cMin = -h - HALO;
  const cMax = w + HALO;
  const halfPitch = PITCH / 2;
  let i = 0;
  for (let c = cMin; c <= cMax; c += STEP, i += 1) {
    const isArabic = i % 2 !== 0;
    const stagger = isArabic ? halfPitch : 0;
    const xStart = Math.max(-PITCH, c - PITCH);
    const xEnd = Math.min(w + PITCH, c + h + PITCH);
    const words = [];
    const kStart = Math.ceil((xStart - stagger) / PITCH);
    for (let k = kStart; ; k += 1) {
      const x = k * PITCH + stagger;
      if (x > xEnd) break;
      words.push({ x, y: x - c });
    }
    if (words.length) {
      lines.push({ isArabic, words });
    }
  }
  return lines;
}

export default function RawanPattern() {
  const { theme } = useTheme();
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    measure();
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { w, h } = size;
  const colors = THEME_COLORS[theme] || THEME_COLORS.light;
  const lines = useMemo(() => buildLines(w, h), [w, h]);

  if (!w || !h) return null;

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "hidden" }}
    >
      {lines.map(({ isArabic, words }, i) =>
        words.map(({ x, y }) => (
          <text
            key={`${i}-${x}-${y}`}
            x={x}
            y={y}
            textAnchor="middle"
            transform={`rotate(45 ${x} ${y})`}
            fontSize="11"
            fontWeight="700"
            letterSpacing={isArabic ? "0.18em" : "0.32em"}
            fill={isArabic ? colors.ar : colors.en}
            fillOpacity={isArabic ? colors.arOpacity : colors.enOpacity}
            direction={isArabic ? "rtl" : undefined}
            fontFamily={isArabic ? AR_FONT : undefined}
          >
            {isArabic ? "روان" : "RAWAN"}
          </text>
        )),
      )}
    </svg>
  );
}