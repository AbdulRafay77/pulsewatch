import { useEffect, useState } from "react";
import api from "../lib/axios";

function useApiHealth() {
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

  return {
    status,
    loading,
    error
  };
}

export default useApiHealth;