import { Navigate, Route, Routes } from "react-router-dom";
import RequireAllowedUser from "../auth/RequireAllowedUser";
import RequireAuth from "../auth/RequireAuth";
import AppShell from "./shell/AppShell";
import Dashboard from "./pages/Dashboard";
import Environments from "./pages/Environments";
import Pipeline from "./pages/Pipeline";
import Playbooks from "./pages/Playbooks";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Today from "./pages/Today";
import Tools from "./pages/Tools";
import PhillipstonPRR from "./environments/phillipston/prr/PhillipstonPRR";
import PhillipstonLegacy from "./pages/PhillipstonLegacy";

export default function App() {
  return (
    <RequireAuth>
      <RequireAllowedUser>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/today" element={<Today />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/playbooks" element={<Playbooks />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/environments" element={<Environments />} />
            <Route path="/settings" element={<Settings />} />

            {/* Environment modules */}
            <Route path="/phillipston/prr/*" element={<PhillipstonPRR />} />

            {/* Legacy demo screens (reference only) */}
            <Route path="/legacy/phillipston" element={<PhillipstonLegacy />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>
      </RequireAllowedUser>
    </RequireAuth>
  );
}
