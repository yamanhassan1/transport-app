import { cn } from "../../../lib/cn.js";

const TIRE = "#1a231f";
const GLASS = "rgba(7, 22, 17, 0.22)";
const GLASS_TINT = "rgba(7, 22, 17, 0.38)";
const HUB = "rgba(255, 255, 255, 0.9)";
const DETAIL = "rgba(7, 22, 17, 0.16)";
const BRIGHT = "rgba(255, 255, 255, 0.95)";

function Ground({ from = 22, to = 218, y = 126 }) {
  return (
    <path
      d={`M ${from} ${y} H ${to}`}
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="3"
      strokeDasharray="2 12"
      strokeLinecap="round"
    />
  );
}

function Wheel({ cx, cy = 108, r = 18 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={TIRE} />
      <circle cx={cx} cy={cy} r={r * 0.5} fill={HUB} />
      <circle cx={cx} cy={cy} r={r * 0.22} fill={TIRE} />
    </g>
  );
}

function SedanBody() {
  return (
    <g>
      <path
        d="M 28 104 L 28 90 Q 28 76 48 74 L 66 70 Q 76 51 96 49 L 124 49 Q 152 49 158 62 L 172 71 Q 200 71 207 84 Q 213 96 210 104 Z"
        fill="currentColor"
      />
      <path d="M 64 70 L 77 53 Q 87 50 101 50 L 106 50 L 106 72 L 64 72 Z" fill={GLASS} />
      <path d="M 112 50 L 131 50 Q 148 51 154 61 L 161 72 L 112 72 Z" fill={GLASS} />
      <path d="M 172 71 H 206" stroke={DETAIL} strokeWidth="3" strokeLinecap="round" />
      <g fill={DETAIL} stroke="none">
        <rect x="74" y="90" width="14" height="3" rx="1.5" />
        <rect x="128" y="90" width="14" height="3" rx="1.5" />
        <rect x="44" y="92" width="14" height="3" rx="1.5" />
        <rect x="170" y="90" width="14" height="3" rx="1.5" />
      </g>
      <rect x="32" y="96" width="174" height="6" rx="3" fill="rgba(7,22,17,0.13)" />
      <path
        d="M 60 69 L 46 71 M 162 68 L 204 76"
        stroke={DETAIL}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M 182 85 H 204 M 190 90 H 204" stroke={DETAIL} strokeWidth="2" strokeLinecap="round" />
      <rect x="156" y="66" width="7" height="4" rx="2" fill="currentColor" />
      <rect x="26" y="76" width="6" height="10" rx="2" fill="rgba(255, 255, 255, 0.55)" />
      <ellipse cx="208" cy="86" rx="4" ry="7" fill={BRIGHT} />
      <Wheel cx={68} />
      <Wheel cx={180} />
      <Ground />
    </g>
  );
}

function HatchBody() {
  return (
    <g>
      <path
        d="M 24 104 L 24 92 Q 24 80 42 78 L 52 77 L 58 52 Q 58 47 90 45 L 150 45 Q 166 55 176 70 L 184 79 Q 204 81 210 90 Q 214 98 210 104 Z"
        fill="currentColor"
      />
      <path
        d="M 58 76 L 62 55 Q 70 50 96 48 L 140 48 Q 158 56 164 68 L 170 78 Z"
        fill={GLASS}
      />
      <path d="M 116 48 L 114 77" stroke={DETAIL} strokeWidth="5" strokeLinecap="round" />
      <path d="M 62 34 L 92 34 L 84 46 L 68 46 Z" fill="currentColor" />
      <g fill={DETAIL} stroke="none">
        <rect x="70" y="90" width="14" height="3" rx="1.5" />
        <rect x="128" y="90" width="14" height="3" rx="1.5" />
        <rect x="170" y="80" width="10" height="3" rx="1.5" />
      </g>
      <rect x="28" y="96" width="178" height="6" rx="3" fill="rgba(7,22,17,0.13)" />
      <path d="M 186 84 H 204 M 194 89 H 204" stroke={DETAIL} strokeWidth="2" strokeLinecap="round" />
      <rect x="180" y="76" width="7" height="4" rx="2" fill="currentColor" />
      <rect x="24" y="72" width="5" height="9" rx="2" fill="rgba(255, 255, 255, 0.55)" />
      <ellipse cx="206" cy="88" rx="4" ry="6" fill={BRIGHT} />
      <Wheel cx={72} cy={108} r={19} />
      <Wheel cx={166} cy={108} r={19} />
      <Ground />
    </g>
  );
}

function PremiumBody() {
  return (
    <g>
      <path
        d="M 26 104 L 26 88 Q 26 76 46 73 L 62 70 Q 72 47 94 44 L 128 44 Q 154 44 166 60 L 180 70 Q 204 71 210 84 Q 215 96 210 104 Z"
        fill="currentColor"
      />
      <path d="M 60 70 L 72 48 Q 90 45 104 45 L 108 45 L 108 71 L 60 71 Z" fill={GLASS_TINT} />
      <path d="M 114 45 L 134 45 Q 149 46 160 60 L 168 70 L 114 70 Z" fill={GLASS_TINT} />
      <g stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.75" strokeLinecap="round" fill="none">
        <path d="M 136 63 H 148" />
        <path d="M 136 65.5 H 148" />
        <path d="M 136 68 H 148" />
      </g>
      <path
        d="M 56 74 L 174 72"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M 102 43 h 18" stroke={DETAIL} strokeWidth="2" strokeLinecap="round" />
      <path d="M 132 43 l 9 -6 l 3 6 Z" fill={DETAIL} />
      <g fill="none" stroke={DETAIL} strokeWidth="2" strokeLinecap="round">
        <path d="M 118 80 V 92" />
        <path d="M 112.8 83 L 123.2 89" />
        <path d="M 123.2 83 L 112.8 89" />
      </g>
      <circle cx="118" cy="86" r="1.6" fill={DETAIL} />
      <g fill={DETAIL} stroke="none">
        <rect x="78" y="90" width="14" height="3" rx="1.5" />
        <rect x="134" y="90" width="14" height="3" rx="1.5" />
        <rect x="46" y="92" width="14" height="3" rx="1.5" />
        <rect x="178" y="88" width="14" height="3" rx="1.5" />
      </g>
      <rect x="30" y="96" width="176" height="6" rx="3" fill="rgba(7,22,17,0.13)" />
      <path d="M 182 82 H 208 M 190 87 H 208" stroke={DETAIL} strokeWidth="2" strokeLinecap="round" />
      <rect x="156" y="62" width="7" height="4" rx="2" fill="currentColor" />
      <rect x="24" y="72" width="6" height="10" rx="2" fill="rgba(255, 255, 255, 0.55)" />
      <ellipse cx="212" cy="83" rx="4" ry="7" fill={BRIGHT} />
      <path
        d="M 178 64 L 180.4 71.6 L 188 74 L 180.4 76.4 L 178 84 L 175.6 76.4 L 168 74 L 175.6 71.6 Z"
        fill={DETAIL}
      />
      <Wheel cx={64} />
      <Wheel cx={188} />
      <Ground />
    </g>
  );
}

function Moto() {
  return (
    <g>
      <circle cx={58} cy={102} r={19} fill={TIRE} />
      <circle cx={58} cy={102} r={6} fill={HUB} />
      <circle cx={58} cy={102} r={2.4} fill={TIRE} />
      <circle cx={170} cy={102} r={19} fill={TIRE} />
      <circle cx={170} cy={102} r={6} fill={HUB} />
      <circle cx={170} cy={102} r={2.4} fill={TIRE} />
      <rect x="104" y="80" width="38" height="18" rx="5" fill="currentColor" />
      <g fill="none" stroke={DETAIL} strokeWidth="2" strokeLinecap="round">
        <path d="M 118 84 H 140" />
        <path d="M 118 88 H 140" />
        <path d="M 118 92 H 140" />
      </g>
      <path d="M 134 56 Q 132 40 114 43 Q 104 46 102 58 Q 100 68 108 66 L 130 66 Q 136 64 134 56 Z" fill="currentColor" />
      <path d="M 100 62 Q 84 54 66 56 Q 56 58 54 65 L 54 74 Q 76 74 96 70 Z" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M 136 58 L 112 98" />
        <path d="M 112 98 L 58 102" />
        <path d="M 136 58 L 92 72" />
        <path d="M 136 58 L 168 102" />
        <path d="M 136 58 L 136 50" />
        <path d="M 132 50 H 150" strokeWidth="8" />
      </g>
      <g fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="6" strokeLinecap="round">
        <path d="M 42 98 Q 58 74 82 94" />
        <path d="M 154 94 Q 170 74 186 98" />
      </g>
      <g fill="none" stroke={DETAIL} strokeWidth="3" strokeLinecap="round">
        <path d="M 116 100 Q 108 108 116 114" />
        <path d="M 112 100 L 124 114" />
      </g>
      <rect x="110" y="110" width="18" height="6" rx="3" fill="currentColor" />
      <path d="M 143 50 L 148 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="150" cy="42" r="3.5" fill="currentColor" />
      <ellipse cx="154" cy="52" rx="5" ry="5" fill={BRIGHT} />
      <circle cx="154" cy="52" r="8" fill={BRIGHT} opacity="0.25" />
      <rect x="50" y="62" width="6" height="5" rx="2" fill="rgba(239, 68, 68, 0.85)" />
      <Ground from={34} to={194} y={125} />
    </g>
  );
}

function BoxBody() {
  return (
    <g>
      <rect x="70" y="42" width="78" height="62" rx="10" fill="currentColor" />
      <g fill={DETAIL} stroke="none">
        <rect x="103" y="44" width="12" height="55" rx="2" />
        <rect x="74" y="70" width="70" height="10" rx="2" />
      </g>
      <g fill={BRIGHT} opacity="0.6">
        <rect x="82" y="88" width="6" height="14" rx="1.5" />
        <rect x="92" y="88" width="6" height="14" rx="1.5" />
      </g>
      <path
        d="M 44 128 H 196"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="3"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <path
        d="M 184 120 L 196 128 L 184 136"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

const variants = {
  car: () => <SedanBody />,
  go: () => <SedanBody />,
  go_sedan: () => <SedanBody />,
  go_mini: () => <HatchBody />,
  mini: () => <HatchBody />,
  premium: () => <PremiumBody />,
  bike: () => <Moto />,
  moto: () => <Moto />,
  box: () => <BoxBody />,
};

export default function VehicleSymbol({ variant = "car", className }) {
  const Body = variants[variant] ?? variants.car;
  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      className={cn(className ?? "h-8 w-8")}
      aria-hidden="true"
    >
      <Body />
    </svg>
  );
}