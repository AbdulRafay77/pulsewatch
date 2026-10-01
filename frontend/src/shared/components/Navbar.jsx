import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/monitors">Monitors</Link>
      <Link to="/incidents">Incidents</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;