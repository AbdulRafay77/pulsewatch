import { useEffect, useState } from "react";
import { getIncidents } from "../api/incidentApi.js";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage.js";

function useIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIncidents() {
      try {
        setLoading(true);
        setError("");

        const data = await getIncidents();

        setIncidents(data);
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "Unable to load incidents"
          )
        );
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