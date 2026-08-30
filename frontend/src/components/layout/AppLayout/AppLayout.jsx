import { Outlet, useLocation } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import BottomNavigation from "../BottomNavigation/BottomNavigation.jsx";
import PageContainer from "../PageContainer/PageContainer.jsx";

export default function AppLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-svh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="hidden md:block">
          <Header />
        </div>
        <main className={`flex-1 md:pb-8 ${isHome ? "pb-0" : "pb-24"}`}>
          <PageContainer>
            <Outlet />
          </PageContainer>
        </main>
        {!isHome && <BottomNavigation />}
      </div>
    </div>
  );
}