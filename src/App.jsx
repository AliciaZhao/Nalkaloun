import { Routes, Route } from "react-router-dom";
import Landingpage from "./pages/landingpage";
import Portfolio from "./pages/portfolio";
import Commissions from "./pages/commissions"; 
import Contact from "./pages/contact";
import Terms from "./pages/terms";
import "./global.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/commissions" element={<Commissions />} /> 
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  );
}
