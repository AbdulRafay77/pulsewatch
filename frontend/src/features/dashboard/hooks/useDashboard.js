import { useEffect, useState } from "react";
import { getMonitors } from "../../monitors/api/monitorApi.js";
import { getIncidents } from "../../incidents/api/incidentApi.js";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage.js";

function useDashboard() {
  const [monitors, setMonitors] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const [monitorData, incidentData] = await Promise.all([
          getMonitors(),
          getIncidents()
        ]);

        setMonitors(monitorData);
        setIncidents(incidentData);
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "Unable to load dashboard data"
          )
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    monitors,
    incidents,
    loading,
    error
  };
}

export default useDashboard;