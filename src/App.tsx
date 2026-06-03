import { Route, Routes, useLocation } from "react-router-dom";
import { LegalFooterBar } from "./components/LegalFooterBar";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminRoute } from "./components/AdminRoute";
import { GalaxyHome } from "./pages/GalaxyHome";
import { LegalPage } from "./pages/LegalPage";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GalaxyHome />} />
        <Route path="/privacy" element={<LegalPage doc="privacy" />} />
        <Route path="/terms" element={<LegalPage doc="terms" />} />
        <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
      {!isAdminRoute && <LegalFooterBar />}
    </>
  );
}

export default function App() {
  return <AppRoutes />;
}
