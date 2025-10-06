import { Routes, Route } from "react-router-dom";
import Landingpage from "./pages/landingpage";
import Portfolio   from "./pages/portfolio";
import Commissions from "./pages/commissions";
import Terms       from "./pages/terms";
import Stuff       from "./pages/stuff";
import GlobalChat  from "./components/GlobalChat.jsx";
import "./global.css";

export default function App() {
  return (
    <>
      <GlobalChat />
      <Routes>
        <Route path="/"            element={<Landingpage />} />
        <Route path="/portfolio"   element={<Portfolio   />} />
        <Route path="/commissions" element={<Commissions />} />
        <Route path="/terms"       element={<Terms       />} />
        <Route path="/stuff"       element={<Stuff       />} />
      </Routes>
    </>
  );
}
