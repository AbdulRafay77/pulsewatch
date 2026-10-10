import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      await login(email, password);

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? "Logging in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;