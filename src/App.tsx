import { Route, Routes } from "react-router-dom";
import { LegalFooterBar } from "./components/LegalFooterBar";
import { ScrollToTop } from "./components/ScrollToTop";
import { GalaxyHome } from "./pages/GalaxyHome";
import { LegalPage } from "./pages/LegalPage";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<GalaxyHome />} />
        <Route path="/privacy" element={<LegalPage doc="privacy" />} />
        <Route path="/terms" element={<LegalPage doc="terms" />} />
        <Route path="/disclaimer" element={<LegalPage doc="disclaimer" />} />
      </Routes>
      <LegalFooterBar />
    </>
  );
}
