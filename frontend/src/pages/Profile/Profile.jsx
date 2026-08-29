import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Car,
  ChevronRight,
  CreditCard,
  IdCard,
  LogOut,
  Star,
  Settings,
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer/PageContainer.jsx";
import Card, { CardHeader, CardBody } from "../../components/ui/Card/Card.jsx";
import Badge from "../../components/ui/Badge/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton/Skeleton.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { formatDate, fullName, initials } from "../../lib/format.js";

export default function Profile() {
  const navigate = useNavigate();
  const { account, role, status, logout } = useAuth();
  const { toast } = useToast();
  const isCaptain = role === "captain";

  const avatar = account ? initials(account) : "?";
  const name = account ? fullName(account) : "";
  const email = account?.email ?? "";
  const phone = account?.phone ?? "";
  const memberSince = account?.createdAt;

  const handleSignOut = async () => {
    await logout();
    toast({ variant: "info", title: "Signed out", description: "See you soon." });
    navigate("/");
  };

  const links = [
    { to: "/settings", label: "Settings", icon: Settings, hint: "Preferences and account" },
    { action: handleSignOut, label: "Sign out", icon: LogOut, hint: "End your session" },
  ];

  if (status === "loading" || !account) {
    return (
      <PageContainer className="max-w-2xl">
        <h1 className="h1 mb-5">Profile</h1>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="h1 mb-5">Profile</h1>

      <Card className="mb-5">
        <div className="flex items-center gap-4 p-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-600 text-2xl font-bold text-white shadow-sm">
            {avatar}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-lg font-bold text-ink">
              {name}
              <Badge variant={isCaptain ? "warning" : "primary"}>{isCaptain ? "Captain" : "Rider"}</Badge>
            </p>
            <p className="truncate text-body text-ink-secondary">{email}</p>
            <p className="truncate text-small text-ink-muted">{phone}</p>
          </div>
          <span className="ml-auto hidden shrink-0 rounded-full bg-primary-100 px-3 py-1 text-caption font-semibold text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 sm:inline-flex">
            Member since {memberSince ? formatDate(memberSince).slice(-4) : "—"}
          </span>
        </div>
      </Card>

      <Card className="mb-5 p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink">
              <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
              {account.isVerified ? "Verified" : "Pending"}
            </p>
            <p className="mt-0.5 text-caption text-ink-muted">Account</p>
          </div>
          <div className="border-x border-line">
            <p className="flex items-center justify-center gap-1 text-xs font-semibold text-ink sm:text-sm">
              <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              {memberSince ? formatDate(memberSince) : "—"}
            </p>
            <p className="mt-0.5 text-caption text-ink-muted">Member since</p>
          </div>
          {isCaptain ? (
            <div>
              <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink">
                <Star className="h-4 w-4 fill-warning text-warning" aria-hidden="true" />
                {account.rating?.average?.toFixed(1) ?? "5.0"}
              </p>
              <p className="mt-0.5 text-caption text-ink-muted">Rating</p>
            </div>
          ) : (
            <div>
              <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink">
                <Car className="h-4 w-4 text-ink" aria-hidden="true" />
                Ready
              </p>
              <p className="mt-0.5 text-caption text-ink-muted">To ride</p>
            </div>
          )}
        </div>
      </Card>

      {isCaptain && (
        <>
          <Card className="mb-5">
            <CardHeader title="Your vehicle" subtitle={`${account.vehicle?.color} ${account.vehicle?.make} ${account.vehicle?.model} (${account.vehicle?.year})`} />
            <CardBody className="space-y-2 pt-0 text-small">
              <p className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-ink-muted">Type</span>
                <span className="font-medium text-ink capitalize">
                  {String(account.vehicle?.vehicleType ?? "").replace("_", " ")}
                </span>
              </p>
              <p className="flex items-center justify-between border-b border-line pb-2">
                <span className="text-ink-muted">Plate number</span>
                <span className="font-medium text-ink">{account.vehicle?.plateNumber}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-ink-muted">Trips</span>
                <span className="font-medium text-ink">
                  {account.completedTrips ?? 0} completed · {account.cancelledTrips ?? 0} cancelled
                </span>
              </p>
            </CardBody>
          </Card>

          <Card className="mb-5">
            <CardHeader title="License" subtitle="Driving credential on file" />
            <CardBody className="space-y-2 pt-0 text-small">
              <p className="flex items-center justify-between border-b border-line pb-2">
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <IdCard className="h-4 w-4" aria-hidden="true" /> Number
                </span>
                <span className="font-medium text-ink">{account.license?.number}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-ink-muted">
                  <CreditCard className="h-4 w-4" aria-hidden="true" /> Expires
                </span>
                <span className="font-medium text-ink">
                  {account.license?.expiryDate ? formatDate(account.license.expiryDate) : "—"}
                </span>
              </p>
            </CardBody>
          </Card>
        </>
      )}

      <Card>
        <ul className="divide-y divide-line px-4">
          {links.map((l) => {
            const Icon = l.icon;
            const inner = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">{l.label}</span>
                  <span className="block text-small text-ink-muted">{l.hint}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
              </>
            );
            return (
              <li key={l.label}>
                {l.action ? (
                  <button type="button" onClick={l.action} className="flex w-full items-center gap-3 py-3.5 text-left">
                    {inner}
                  </button>
                ) : (
                  <Link to={l.to} className="flex items-center gap-3 py-3.5">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </PageContainer>
  );
}