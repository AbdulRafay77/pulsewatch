import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";
import NotificationBell from "../../features/notifications/components/NotificationBell.jsx";
import "./navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  function getNavClass({ isActive }) {
    return isActive
      ? "navbar-link navbar-link-active"
      : "navbar-link";
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          <span className="navbar-brand-dot" />
          PulseWatch
        </Link>

        {user ? (
          <>
            <nav className="navbar-links">
              <NavLink to="/dashboard" className={getNavClass}>
                Dashboard
              </NavLink>

              <NavLink to="/monitors" className={getNavClass}>
                Monitors
              </NavLink>

              <NavLink to="/incidents" className={getNavClass}>
                Incidents
              </NavLink>

              <NavLink to="/settings" className={getNavClass}>
                Settings
              </NavLink>
            </nav>

            <div className="navbar-actions">
              <NotificationBell />

              <span className="navbar-user">
                {user.username}
              </span>

              <button
                className="navbar-logout"
                type="button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </>
        ) : (
          <div className="navbar-actions">
            {location.pathname === "/login" && (
              <NavLink to="/signup" className="navbar-signup">
                Sign up
              </NavLink>
            )}

            {location.pathname === "/signup" && (
              <NavLink to="/login" className={getNavClass}>
                Log in
              </NavLink>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;