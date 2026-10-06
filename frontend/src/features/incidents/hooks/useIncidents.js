import { useEffect, useState } from "react";
import { getIncidents } from "../api/incidentApi.js";

function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncidents() {
      try {
        const data = await getIncidents();

        setIncidents(data);
      } catch (error) {
        setError("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    }

    loadIncidents();
  }, []);

  return {
    incidents,
    loading,
    error
  };
}

export default useIncidents;