import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Dashboard from "../../features/dashboard/pages/Dashboard";
import MonitorsPage from "../../features/monitors/pages/MonitorsPage";
import IncidentsPage from "../../features/incidents/pages/IncidentsPage";
import Navbar from "../../shared/components/Navbar";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<h1>Login</h1>} />
        <Route path="/signup" element={<h1>Signup</h1>} />
        <Route path="/monitors" element={<MonitorsPage />} />
        <Route path="/monitors/:id" element={<h1>Monitor Details</h1>} />
        <Route path="/incidents" element={<IncidentsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;