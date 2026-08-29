import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout/AppLayout.jsx";
import RequireAuth from "./components/layout/RequireAuth/RequireAuth.jsx";
import Spinner from "./components/ui/Spinner/Spinner.jsx";

const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Login = lazy(() => import("./pages/Login/Login.jsx"));
const Register = lazy(() => import("./pages/Register/Register.jsx"));
const Profile = lazy(() => import("./pages/Profile/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings/Settings.jsx"));

function PageFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" label="Loading…" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />

          <Route element={<RequireAuth />}>
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}