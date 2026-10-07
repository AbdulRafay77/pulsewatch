import { useEffect, useState } from "react";
import {
  getMonitorById,
  getMonitorChecks
} from "../api/monitorApi.js";

function useMonitorDetails(monitorId) {
  const [monitor, setMonitor] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMonitorDetails() {
      try {
        setError("");

        const [monitorData, checksData] =
          await Promise.all([
            getMonitorById(monitorId),
            getMonitorChecks(monitorId)
          ]);

        setMonitor(monitorData);
        setChecks(checksData);
      } catch (error) {
        setError("Failed to load monitor details");
      } finally {
        setLoading(false);
      }
    }

    loadMonitorDetails();
  }, [monitorId]);

  return {
    monitor,
    checks,
    loading,
    error
  };
}

export default useMonitorDetails;