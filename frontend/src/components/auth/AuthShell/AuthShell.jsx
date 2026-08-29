import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "motion/react";
import { Logo } from "../../ui/Logo/Logo.jsx";

const content = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to book a ride or start earning with rawan.",
    footerText: "New to rawan?",
    footerLink: { to: "/register", label: "Create an account" },
  },
  register: {
    title: "Create your account",
    subtitle: "Sign up to ride or start driving with rawan.",
    footerText: "Already have an account?",
    footerLink: { to: "/login", label: "Log in" },
  },
};

export default function AuthShell({ mode, children }) {
  const reduce = useReducedMotion();
  const copy = content[mode];

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[var(--background)] px-4 py-10 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:py-12">
      <motion.div
        className="flex w-full max-w-md flex-col"
        initial={{ opacity: 0, y: reduce ? 0 : 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/"
          aria-label="rawan home"
          className="mb-7 self-center transition-opacity hover:opacity-90"
        >
          <Logo
            markClassName="h-20 w-20 rounded-[26px]"
            textClassName="text-[40px]"
            subtitleClassName="text-sm tracking-[0.3em]"
          />
        </Link>

        <div className="mb-6 text-center">
          <h1 className="display">{copy.title}</h1>
          <p className="mt-2 text-body text-ink-secondary">{copy.subtitle}</p>
        </div>

        <div className="md:rounded-2xl md:border md:border-line md:bg-surface md:p-6 md:shadow-md">
          {children}
        </div>

        <p className="mt-6 text-center text-body text-ink-secondary">
          {copy.footerText}{" "}
          <Link
            to={copy.footerLink.to}
            className="font-semibold text-primary-700 transition-colors hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {copy.footerLink.label}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}