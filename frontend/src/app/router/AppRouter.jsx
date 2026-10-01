import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={<h1>Dashboard</h1>}
        />

        <Route
          path="/login"
          element={<h1>Login</h1>}
        />

        <Route
          path="/signup"
          element={<h1>Signup</h1>}
        />

        <Route
          path="/monitors"
          element={<h1>Monitors</h1>}
        />

        <Route
          path="/monitors/:id"
          element={<h1>Monitor Details</h1>}
        />

        <Route
          path="/incidents"
          element={<h1>Incidents</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;