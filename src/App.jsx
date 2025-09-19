import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Landingpage from "./pages/landingpage";
import Portfolio from "./pages/portfolio";
import Commissions from "./pages/commissions"; 
import Contact from "./pages/contact";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/commissions" element={<Commissions />} /> 
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}
