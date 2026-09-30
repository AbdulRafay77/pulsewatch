import { useEffect, useState } from "react";
import api from "../lib/axios";

function ApiStatus() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await api.get("/health");

        setStatus(response.data.status);
      } catch (error) {
        setError("Unable to connect to PulseWatch API");
      } finally {
        setLoading(false);
      }
    }

    checkApi();
  }, []);

  if (loading) {
    return <h1>Checking API...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (status === "ok") {
    return <h1>API is online</h1>;
  }

  return <h1>API is offline</h1>;
}

export default ApiStatus;