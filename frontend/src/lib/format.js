export const formatDate = (date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));

export const fullName = (account) =>
  account?.fullname
    ? [account.fullname.firstName, account.fullname.lastName].filter(Boolean).join(" ")
    : "";

export const firstName = (account) => (account?.fullname?.firstName ?? "").trim();

export const initials = (account) => {
  const name = fullName(account);
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
};