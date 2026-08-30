import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Car,
  ChevronRight,
  IdCard,
  Power,
  Route,
  Settings,
  Star,
  User,
} from "lucide-react";
import Card, { CardBody, CardHeader } from "../../components/ui/Card/Card.jsx";
import Badge from "../../components/ui/Badge/Badge.jsx";
import Button from "../../components/ui/Button/Button.jsx";
import VehicleSymbol from "../../components/ui/VehicleSymbol/VehicleSymbol.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { formatDate, firstName, initials } from "../../lib/format.js";

const SYMBOL_BY_TYPE = {
  bike: "bike",
  rickshaw: "car",
  car: "car",
  go: "car",
  go_mini: "mini",
  go_sedan: "car",
  premium: "premium",
};

const vehicleLabel = (type) =>
  String(type ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

export default function CaptainHome() {
  const { account } = useAuth();
  const [online, setOnline] = useState(Boolean(account?.isOnline || account?.isAvailable));

  const name = firstName(account);
  const vehicle = account?.vehicle ?? {};
  const license = account?.license ?? {};
  const rating = account?.rating?.average ?? 5;
  const symbol = SYMBOL_BY_TYPE[vehicle.vehicleType] ?? "car";

  const stats = [
    {
      label: "Rating",
      icon: Star,
      value: `${rating.toFixed(1)}`,
      suffix: `of 5 · ${account?.rating?.totalRatings ?? 0} ratings`,
      tint: "text-warning",
    },
    {
      label: "Completed",
      icon: Route,
      value: String(account?.completedTrips ?? 0),
      suffix: "trips finished",
      tint: "text-primary-700 dark:text-primary-400",
    },
    {
      label: "Cancelled",
      icon: Car,
      value: String(account?.cancelledTrips ?? 0),
      suffix: `of ${account?.totalTrips ?? 0} total`,
      tint: "text-ink-muted",
    },
  ];

  const links = [
    { to: "/profile", label: "Captain profile", icon: User, hint: "Vehicle, license and documents" },
    { to: "/settings", label: "Settings", icon: Settings, hint: "Preferences and account" },
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <section className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-body text-ink-secondary">Captain dashboard</p>
          <h1 className="h1 mb-1">Hello, {name}</h1>
          <div className="flex items-center gap-2">
            {account?.isVerified ? (
              <Badge variant="success">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" /> Verified captain
              </Badge>
            ) : (
              <Badge variant="warning">Verification pending</Badge>
            )}
            <Badge variant="neutral">{account?.vehicle ? vehicleLabel(vehicle.vehicleType) : "Captain"}</Badge>
          </div>
        </div>
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white shadow-sm">
          {initials(account)}
        </span>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl bg-gradient-to-br from-primary-500 to-primary-800 p-5 text-white shadow-md"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className={`relative flex h-12 w-12 items-center justify-center rounded-full bg-white/15 backdrop-blur ${
                online ? "" : "opacity-80"
              }`}
            >
              <Power className="h-6 w-6" aria-hidden="true" />
              <span
                className={`absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-primary-600 ${
                  online ? "bg-success" : "bg-gray-400"
                }`}
              />
            </span>
            <div>
              <p className="text-lg font-bold">{online ? "You're online" : "You're offline"}</p>
              <p className="text-small text-white/80">
                {online
                  ? "Trip requests are being matched to you in real time."
                  : "Go online to start receiving trip requests."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setOnline((o) => !o)}
            variant={online ? "secondary" : "primary"}
            leftIcon={Power}
            className={online ? "min-w-36 bg-white/95 dark:bg-gray-100" : "min-w-36 bg-white text-primary-700 shadow-lg"}
          >
            {online ? "Go offline" : "Go online"}
          </Button>
        </div>
      </motion.section>

      <section>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-line bg-surface p-5 shadow-sm"
              >
                <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100 dark:bg-gray-700 ${s.tint}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-2xl font-bold text-ink">{s.value}</p>
                <p className="text-small font-medium text-ink-secondary">{s.label}</p>
                <p className="text-caption text-ink-muted">{s.suffix}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Card>
          <CardHeader title="Your vehicle" subtitle="Used for your trips" />
          <CardBody className="flex items-center gap-4 pt-0">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[12px] bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <VehicleSymbol variant={symbol} className="h-16 w-16" />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-ink">
                {vehicle.color} {vehicle.make} {vehicle.model}
              </p>
              <p className="text-small text-ink-secondary">{vehicle.year}</p>
              <p className="text-small text-ink-muted">Plate {vehicle.plateNumber}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="License" subtitle="Driving credential on file" />
          <CardBody className="space-y-2 pt-0 text-small">
            <p className="flex items-center justify-between border-b border-line pb-2">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <IdCard className="h-4 w-4" aria-hidden="true" /> Number
              </span>
              <span className="font-medium text-ink">{license.number}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-ink-muted">Expires</span>
              <span className="font-medium text-ink">
                {license.expiryDate ? formatDate(license.expiryDate) : "—"}
              </span>
            </p>
          </CardBody>
        </Card>
      </section>

      <Card>
        <ul className="divide-y divide-line px-4">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <li key={l.to}>
                <Link to={l.to} className="flex items-center gap-3 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink">{l.label}</span>
                    <span className="block text-small text-ink-muted">{l.hint}</span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}