import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Clock, ShieldCheck, Star, Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { firstName } from "../../lib/format.js";

const features = [
  { icon: Clock, title: "Minute pickup", text: "Nearby captains reach you in minutes, day or night." },
  { icon: Wallet, title: "Transparent fares", text: "See your fare before you book. No surge surprises at the end." },
  { icon: ShieldCheck, title: "Verified captains", text: "Every captain and vehicle is verified for your safety." },
  { icon: Star, title: "Rated rides", text: "Rate every trip and help keep the community trusted." },
];

export default function Home() {
  const { isAuthenticated, account, role } = useAuth();
  const signedInName = firstName(account);

  return (
    <div className="flex flex-col gap-10">
      <section className="grid items-center gap-8 pt-4 md:grid-cols-2 md:gap-12">
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
          <h1 className="display mb-4">Ride any way, anywhere.</h1>
          <p className="text-body-large mb-6 max-w-md text-ink-secondary">
            A reliable ride-hailing platform that gets you where you need to be — safely,
            quickly, and at a fare you see up front.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to={isAuthenticated ? "/profile" : "/register"}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-primary-500 to-primary-700 px-6 font-semibold text-white shadow-md shadow-primary/25 transition-all hover:from-primary-400 hover:to-primary-700 hover:shadow-lg active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {isAuthenticated ? "Go to your profile" : "Create your free account"}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to={isAuthenticated ? "/settings" : "/login"}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-line bg-surface px-6 font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-700/40"
            >
              {isAuthenticated ? "Account settings" : "Log in"}
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="max-w-md text-center">
            <p className="display-sm mb-3 text-primary-700 dark:text-primary-400" lang="ar" dir="rtl">
              روان
            </p>
            <p className="text-body text-ink-secondary">
              One account for riders and captains — register, log in, and manage your
              profile from anywhere.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-none border-0 bg-transparent shadow-none p-4 md:rounded-xl md:border md:border-line md:bg-surface md:shadow-sm md:p-5"
          >
            <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              <f.icon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h3 className="h4 mb-1">{f.title}</h3>
            <p className="text-small text-ink-secondary">{f.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="-mx-4 bg-primary-800 p-6 text-white md:mx-0 md:flex md:items-center md:justify-between md:rounded-2xl md:p-10">
        <div className="mb-5 md:mb-0">
          <h2 className="h2 mb-2 text-white">Drive on your own schedule</h2>
          <p className="text-small text-white/80">
            Register as a captain with your vehicle and license details in minutes.
          </p>
        </div>
        <Link
          to={role === "captain" ? "/profile" : "/register?mode=captain"}
          className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-primary-700 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          {role === "captain" ? "View captain profile" : "Become a captain"}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}