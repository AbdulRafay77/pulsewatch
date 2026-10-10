import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/monitors">Monitors</Link>
      <Link to="/incidents">Incidents</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      {user && (
        <>
          <span>{user.username}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}

export default Navbar;