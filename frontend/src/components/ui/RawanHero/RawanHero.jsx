import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const HERO_STYLES = `
  @keyframes rawan-dash {
    to { stroke-dashoffset: -18; }
  }
  .rawan-route-dash {
    animation: rawan-dash 1.2s linear infinite;
  }
  @keyframes rawan-pulse {
    0% { transform: scale(0.6); opacity: 0.9; }
    70%, 100% { transform: scale(2.3); opacity: 0; }
  }
  .rawan-pulse-a,
  .rawan-pulse-b {
    transform-box: fill-box;
    transform-origin: center;
    animation: rawan-pulse 2.6s cubic-bezier(0.16, 1, 0.3, 1) infinite;
  }
  .rawan-pulse-b {
    animation-delay: 1.3s;
  }
`;

function RouteRef() {
  return <path id="rawan-route" d="M 420 690 C 500 620, 560 560, 620 520 S 780 430, 800 300" />;
}

function CarArt() {
  return (
    <g>
      <animateMotion
        dur="16s"
        repeatCount="indefinite"
        rotate="auto"
        calcMode="spline"
        keyPoints="0;1;0"
        keyTimes="0;0.5;1"
        keySplines="0.45 0 0.55 1; 0.45 0 0.55 1"
      >
        <mpath href="#rawan-route" />
      </animateMotion>
      <ellipse cx="14" cy="42" rx="150" ry="13" fill="rgba(0,0,0,0.18)" />
      <path
        d="M -126 2 C -126 -28, -110 -40, -86 -46 L -4 -68 C 14 -73, 32 -74, 48 -66 L 106 -44 C 128 -36, 138 -20, 138 -2 L 138 2 Z"
        fill="white"
      />
      <rect x="-46" y="-62" width="106" height="38" rx="13" fill="rgba(0,61,41,0.35)" />
      <rect x="-94" y="-50" width="22" height="28" rx="9" fill="rgba(0,61,41,0.35)" />
      <circle cx="124" cy="-12" r="4.5" fill="#00a86b" />
      <rect x="-30" y="-30" width="62" height="34" rx="9" fill="#00a86b" />
      <text
        x="1"
        y="-7"
        textAnchor="middle"
        fill="white"
        fontWeight="700"
        fontSize="19"
        lang="ar"
        dir="rtl"
        style={{ fontFamily: "'Segoe UI', 'Noto Naskh Arabic', 'Geeza Pro', sans-serif" }}
      >
        روان
      </text>
      <circle cx="-86" cy="10" r="30" fill="#1c2b26" />
      <circle cx="-86" cy="10" r="14" fill="rgba(255,255,255,0.35)" />
      <circle cx="62" cy="10" r="30" fill="#1c2b26" />
      <circle cx="62" cy="10" r="14" fill="rgba(255,255,255,0.35)" />
      <circle cx="-86" cy="10" r="10" fill="rgba(255,255,255,0.85)" />
      <circle cx="62" cy="10" r="10" fill="rgba(255,255,255,0.85)" />
    </g>
  );
}

function Pin({ cx, cy, pulseClass }) {
  return (
    <g>
      <circle className={`rawan-pulse ${pulseClass}`} cx={cx} cy={cy} r="13" fill="none" stroke="white" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="26" fill="white" opacity="0.25" />
      <circle cx={cx} cy={cy} r="13" fill="white" opacity="0.95" />
      <circle cx={cx} cy={cy} r="7" fill="#00a86b" />
    </g>
  );
}

function MapArt() {
  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      role="img"
      aria-label="rawan hero graphic showing a route between two pinned stops"
    >
      <style>{HERO_STYLES}</style>
      <defs>
        <radialGradient id="rawan-hero-glow" cx="50%" cy="46%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <RouteRef />
      </defs>

      <rect width="1200" height="900" fill="url(#rawan-hero-glow)" />

      {[
        [60, 130, 200, 140],
        [340, 90, 190, 130],
        [660, 100, 220, 150],
        [950, 70, 200, 170],
        [130, 360, 170, 130],
        [410, 290, 200, 150],
        [760, 300, 180, 140],
        [1000, 350, 170, 150],
        [70, 600, 220, 140],
        [390, 570, 180, 140],
        [710, 560, 230, 150],
        [970, 640, 200, 140],
        [80, 790, 210, 90],
        [430, 800, 210, 80],
        [720, 790, 210, 80],
        [990, 800, 180, 70],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="24" fill="white" opacity="0.05" />
      ))}

      <path
        d="M 0 580 C 260 520, 520 660, 1200 470"
        stroke="white"
        strokeOpacity="0.08"
        strokeWidth="120"
      />
      <path
        d="M 240 0 C 300 320, 180 620, 420 900"
        stroke="white"
        strokeOpacity="0.06"
        strokeWidth="100"
      />

      <use href="#rawan-route" stroke="white" strokeOpacity="0.16" strokeWidth="12" strokeLinecap="round" />
      <use
        href="#rawan-route"
        className="rawan-route-dash"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="4"
        strokeDasharray="2 16"
        strokeLinecap="round"
      />

      <CarArt />
      <Pin cx={420} cy={690} pulseClass="rawan-pulse-a" />
      <Pin cx={800} cy={300} pulseClass="rawan-pulse-b" />
    </svg>
  );
}

export default function RawanHero() {
  return (
    <section
      className="-mx-4 -my-5 relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 md:-mx-6 md:-my-6 md:min-h-[calc(100svh-6rem)] md:rounded-[28px]"
      aria-hidden="false"
    >
      <MapArt />

      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-1.5 px-6 pt-[calc(env(safe-area-inset-top)+2.5rem)] text-center md:pt-12"
      >
        <p className="text-[13px] font-bold uppercase tracking-[0.28em] text-white/70">Welcome to</p>
        <div className="flex items-baseline gap-2.5">
          <span
            lang="ar"
            dir="rtl"
            className="text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "'Segoe UI', 'Noto Naskh Arabic', 'Geeza Pro', sans-serif" }}
          >
            روان
          </span>
          <span className="text-4xl font-bold tracking-tight text-white md:text-5xl">rawan</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.45 }}
        className="relative z-10 px-5 pb-[calc(env(safe-area-inset-bottom)+2.5rem)] md:px-10 md:pb-10"
      >
        <div className="mx-auto w-full max-w-sm">
          <Link
            to="/register"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-[17px] font-bold text-primary-700 shadow-xl shadow-black/10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}