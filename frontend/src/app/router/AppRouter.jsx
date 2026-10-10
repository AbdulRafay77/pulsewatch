import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import LoginPage
  from "../../features/auth/pages/LoginPage.jsx";

import ProtectedRoute
  from "../../features/auth/components/ProtectedRoute.jsx";

import Dashboard from "../../features/dashboard/pages/Dashboard";
import MonitorsPage from "../../features/monitors/pages/MonitorsPage";
import IncidentsPage from "../../features/incidents/pages/IncidentsPage";
import Navbar from "../../shared/components/Navbar";
import MonitorDetailsPage
  from "../../features/monitors/pages/MonitorDetailsPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />

        <Route 
          path="/signup" 
          element={<SignupPage />}
        />

        <Route 
          path="/monitors" 
          element={
            <ProtectedRoute>
              <MonitorsPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/monitors/:id" 
          element={
            <ProtectedRoute>
              <MonitorDetailsPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/incidents" 
          element={
            <ProtectedRoute>
              <IncidentsPage />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;