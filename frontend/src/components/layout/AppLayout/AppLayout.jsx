import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import BottomNavigation from "../BottomNavigation/BottomNavigation.jsx";
import PageContainer from "../PageContainer/PageContainer.jsx";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <div className="flex min-h-svh">
      <Sidebar mobileOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 pb-24 md:pb-8">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}