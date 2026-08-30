import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  AirVent,
  ArrowRight,
  BatteryCharging,
  Bike,
  Car,
  CircleDollarSign,
  Clock,
  Droplets,
  Gem,
  Lightbulb,
  Lock,
  Luggage,
  MapPin,
  Navigation,
  Package,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Usb,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import VehicleSymbol from "../../components/ui/VehicleSymbol/VehicleSymbol.jsx";
import RawanHero from "../../components/ui/RawanHero/RawanHero.jsx";
import CaptainHome from "./CaptainHome.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { firstName } from "../../lib/format.js";

const TAG_ICONS = {
  car: Car,
  bike: Bike,
  box: Package,
};

const services = [
  {
    value: "go",
    label: "Go",
    hint: "Economy sedans with A/C",
    symbol: "car",
    tag: { icon: "car", text: "A/C · up to 4" },
    tint: "from-sky-500 to-sky-700",
    details: [
      { icon: AirVent, text: "Full air conditioning" },
      { icon: Users, text: "Up to 4 passengers" },
      { icon: Luggage, text: "Cabin luggage space" },
    ],
  },
  {
    value: "go_mini",
    label: "Go Mini",
    hint: "Budget-friendly hatchbacks",
    symbol: "mini",
    tag: { icon: "car", text: "up to 3" },
    tint: "from-amber-500 to-orange-700",
    details: [
      { icon: Car, text: "Compact hatchback ride" },
      { icon: Users, text: "1–3 passengers, light" },
      { icon: CircleDollarSign, text: "Lowest fares" },
    ],
  },
  {
    value: "shipment",
    label: "Shipment",
    hint: "Send parcels fast",
    symbol: "box",
    tag: { icon: "box", text: "up to 10 kg" },
    tint: "from-violet-500 to-purple-700",
    details: [
      { icon: Package, text: "Parcels up to 10 kg" },
      { icon: Zap, text: "Fast door-to-door" },
      { icon: ShieldCheck, text: "Safe, tracked handling" },
    ],
  },
  {
    value: "premium",
    label: "Premier",
    hint: "Newer premium cars",
    symbol: "premium",
    tag: { icon: "car", text: "Rear A/C · up to 4" },
    tint: "from-slate-600 to-slate-800",
    details: [
      { icon: Gem, text: "Newer, premium sedans" },
      { icon: AirVent, text: "Rear A/C vents" },
      { icon: Droplets, text: "Tinted windows" },
      { icon: Usb, text: "Charging & AUX cables" },
    ],
  },
  {
    value: "bike",
    label: "Bike",
    hint: "Smart pedal-assist e-bikes",
    symbol: "bike",
    tag: { icon: "bike", text: "1 seat" },
    tint: "from-emerald-500 to-teal-700",
    details: [
      { icon: BatteryCharging, text: "Pedal-assist, 3 gears" },
      { icon: SlidersHorizontal, text: "Quick-release seat" },
      { icon: Lightbulb, text: "LED lights & bell" },
      { icon: Lock, text: "Dock & smart lock" },
    ],
  },
];

const features = [
  { icon: Clock, title: "Minute pickup", text: "Nearby captains reach you in minutes, day or night." },
  { icon: Wallet, title: "Transparent fares", text: "See your fare before you book. No surge surprises at the end." },
  { icon: ShieldCheck, title: "Verified captains", text: "Every captain and vehicle is verified for your safety." },
  { icon: Star, title: "Rated rides", text: "Rate every trip and help keep the community trusted." },
];

function ServiceCard({ service, index }) {
  const TagIcon = TAG_ICONS[service.tag.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`relative flex aspect-[16/11] items-center justify-center overflow-hidden bg-gradient-to-br ${service.tint}`}>
        <VehicleSymbol
          variant={service.symbol}
          className="absolute -right-4 -top-6 h-44 w-44 -rotate-12 text-white/20 transition-transform duration-500 group-hover:rotate-0"
        />
        <span className="absolute -bottom-8 left-1/2 h-32 w-60 -translate-x-1/2 rounded-full bg-white/10 blur-2xl" />
        <VehicleSymbol
          variant={service.symbol}
          className="relative z-[5] w-[76%] text-white drop-shadow-[0_14px_24px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.05]"
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-caption font-bold text-white backdrop-blur">
          <TagIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {service.tag.text}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-ink">{service.label}</p>
            <p className="text-small text-ink-muted">{service.hint}</p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
        </div>
        <ul className="mt-3 space-y-2">
          {service.details.map((d) => (
            <li key={d.text} className="flex items-center gap-2 text-[13px] text-ink-secondary">
              <d.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {d.text}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { isAuthenticated, account, role } = useAuth();
  const signedInName = firstName(account);
  const isCaptain = role === "captain";

  if (!isAuthenticated) {
    return <RawanHero />;
  }

  if (isCaptain) {
    return <CaptainHome />;
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {isAuthenticated && signedInName && (
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-caption font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Hello, {signedInName}
            </span>
          )}

          <h1 className="display mb-3">
            {isAuthenticated ? "Where to, " + signedInName + "?" : "Book a ride in minutes."}
          </h1>
          <p className="text-body-large mb-6 max-w-md text-ink-secondary">
            Rides, packages and whatever else — pick a service, set your stop,
            and get moving with a nearby verified captain.
          </p>

          {/* Booking card */}
          <div className="max-w-md rounded-2xl border border-line bg-surface p-5 shadow-sm">
            <p className="mb-3 text-small font-semibold uppercase tracking-wide text-ink-muted">
              {isAuthenticated ? "You're almost ready to ride" : "Set your destination to start"}
            </p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 rounded-full border border-line bg-gray-50 px-4 py-3.5 dark:bg-gray-800/60">
                <MapPin className="h-5 w-5 shrink-0 text-primary-700 dark:text-primary-400" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink-secondary">
                  {isAuthenticated ? "Plan your trip in the app" : "Where to?"}
                </span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink-muted">
                  1
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-line bg-gray-50 px-4 py-3.5 dark:bg-gray-800/60">
                <Navigation className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink-secondary">Enter your destination</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink/10 text-[10px] font-bold text-ink-muted">
                  2
                </span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["Home", "Work", "Airport"].map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-caption font-semibold text-ink-secondary">
                  {tag}
                </span>
              ))}
            </div>

            <div className="my-4 h-px bg-line" />

            <Link
              to={isAuthenticated ? "/profile" : "/register"}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-primary-500 to-primary-700 px-6 font-semibold text-white shadow-md shadow-primary/25 transition-all hover:from-primary-400 hover:to-primary-700 hover:shadow-lg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Continue
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>

            <Link
              to={isAuthenticated ? "/settings" : "/login"}
              className="mt-2.5 inline-flex h-[52px] w-full items-center justify-center rounded-full border border-line bg-surface px-6 font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.97] dark:text-gray-100 dark:hover:bg-gray-700/40"
            >
              {isAuthenticated ? "Account settings" : "Log in"}
            </Link>

            {!isAuthenticated && (
              <p className="mt-3 text-center text-caption text-ink-muted">
                Continue creates your free account after you enter your details.
              </p>
            )}
          </div>
        </motion.div>

        {/* Symbol graphic hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 shadow-xl">
            {/* route line decor */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 500"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M60 90 C 140 70, 300 120, 330 240 S 250 400, 330 430"
                stroke="white"
                strokeOpacity="0.18"
                strokeWidth="3"
                strokeDasharray="2 14"
                strokeLinecap="round"
              />
              <circle cx="60" cy="90" r="10" fill="white" fillOpacity="0.28" />
              <circle cx="330" cy="430" r="12" fill="white" fillOpacity="0.28" />
              <circle cx="330" cy="430" r="5" fill="white" fillOpacity="0.55" />
              <path d="M 30 250 h 24 M 30 268 h 16" stroke="white" strokeOpacity="0.14" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="absolute right-8 top-8 h-28 w-28 rounded-full bg-white/10" />
            <span className="absolute -bottom-10 -left-10 h-44 w-44 rounded-full bg-white/10" />

            <span className="absolute left-1/2 top-[37%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 blur-2xl" />
            <VehicleSymbol
              variant="car"
              className="absolute left-1/2 top-[38%] h-44 w-44 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_14px_30px_rgba(0,0,0,0.35)]"
            />

            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
              <div>
                <p className="text-[15px] font-bold text-white">rawan</p>
                <p className="text-caption text-white/70">Ride any way, anywhere</p>
              </div>
              <div className="flex gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
                  <Star className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          {/* Floating chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="absolute -left-10 top-10 flex items-center gap-3 rounded-2xl bg-surface/95 p-3 pr-5 shadow-xl backdrop-blur"
          >
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <Navigation className="h-5 w-5" aria-hidden="true" />
              <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-surface" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">Captains nearby</p>
              <p className="text-caption text-ink-muted">4 min average pickup</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-surface/95 p-4 shadow-xl backdrop-blur"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-300">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">24/7 support</p>
              <p className="text-caption text-ink-muted">Phone &amp; chat, always on</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Ride with rawan */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h2 className="h2">Ride with rawan</h2>
            <p className="text-body text-ink-secondary">Cars, e-bikes and parcels — pick the rawan that fits.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard key={service.value} service={service} index={i} />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-none border-0 bg-transparent p-4 shadow-none md:rounded-xl md:border md:border-line md:bg-surface md:shadow-sm md:p-5"
            >
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                <f.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="h4 mb-1">{f.title}</h3>
              <p className="text-small text-ink-secondary">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Drive banner */}
      <section className="-mx-4 grid items-center gap-0 overflow-hidden bg-primary-800 md:mx-0 md:grid-cols-2 md:rounded-[28px]">
        <div className="relative flex h-64 items-center justify-center overflow-hidden md:h-full lg:h-80">
          <VehicleSymbol
            variant="car"
            className="absolute right-2 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 text-white/10"
          />
          <span className="absolute left-10 top-8 h-24 w-24 rounded-full bg-white/10" />
          <VehicleSymbol
            variant="car"
            className="relative h-48 w-48 -translate-y-4 -rotate-6 text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
          />
        </div>
        <div className="p-6 text-white md:p-10">
          <h2 className="h2 mb-2 text-white">Drive on your own schedule</h2>
          <p className="text-small text-white/80">
            Register as a captain with your vehicle and license details in minutes,
            keep every fare, and earn on your terms.
          </p>
          <Link
            to={isCaptain ? "/profile" : "/register?mode=captain"}
            className="mt-5 inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-primary-700 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            {isCaptain ? "View captain profile" : "Become a captain"}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}