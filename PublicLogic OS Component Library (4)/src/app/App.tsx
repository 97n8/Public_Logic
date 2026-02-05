import { Navigate, Outlet, Route, Routes } from "react-router-dom";
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
import TownShell from "./environments/TownShell";
import PhillipstonHome from "./environments/phillipston/PhillipstonHome";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/phillipston" replace />} />

      {/* Town environments render with their own chrome (feels like a separate governed app). */}
      <Route
        path="/phillipston"
        element={
          <TownShell
            town="Phillipston"
            subtitle="CaseSpace"
            className="env-phillipston"
            homeTo="/phillipston/prr/staff"
            homeLabel="PRR"
          >
            <PhillipstonHome />
          </TownShell>
        }
      />

      <Route
        path="/phillipston/prr/*"
        element={
          <TownShell
            town="Phillipston"
            subtitle="Public Records Requests (M.G.L. c. 66 §10)"
            className="env-phillipston"
            homeTo="/phillipston"
            homeLabel="CaseSpace"
          >
            <PhillipstonPRR />
          </TownShell>
        }
      />

      {/* PublicLogic ops portal (private) */}
      <Route
        element={
          <RequireAuth>
            <RequireAllowedUser>
              <AppShell>
                <Outlet />
              </AppShell>
            </RequireAllowedUser>
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/today" element={<Today />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/playbooks" element={<Playbooks />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/environments" element={<Environments />} />
        <Route path="/settings" element={<Settings />} />

        {/* Legacy demo screens (reference only) */}
        <Route path="/legacy/phillipston" element={<PhillipstonLegacy />} />
      </Route>

      <Route path="*" element={<Navigate to="/phillipston" replace />} />
    </Routes>
  );
}
