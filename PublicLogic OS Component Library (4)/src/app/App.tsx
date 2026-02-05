import { Navigate, Route, Routes } from "react-router-dom";
import EnvHome from "./pages/EnvHome";
import FrontDoor from "./pages/FrontDoor";
import PhillipstonLegacy from "./pages/PhillipstonLegacy";
import PrincetonCaseSpace from "./pages/PrincetonCaseSpace";
import PrincetonPRR from "./pages/PrincetonPRR";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FrontDoor />} />
      <Route path="/env/:envId" element={<EnvHome />} />

      {/* Princeton sub-app */}
      <Route path="/env/princeton/case-space" element={<PrincetonCaseSpace />} />
      <Route path="/env/princeton/prr" element={<PrincetonPRR />} />

      {/* Legacy demo (kept as reference) */}
      <Route path="/env/phillipston/legacy" element={<PhillipstonLegacy />} />

      {/* Convenience aliases */}
      <Route path="/hmlp" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
