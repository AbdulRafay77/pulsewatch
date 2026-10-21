import { useEffect, useState } from "react";
import {
  getMonitorById,
  getMonitorChecks
} from "../api/monitorApi.js";
import { getApiErrorMessage } from "../../../lib/getApiErrorMessage.js";

function useMonitorDetails(monitorId) {
  const [monitor, setMonitor] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMonitorDetails() {
      try {
        setLoading(true);
        setError("");

        const [monitorData, checksData] =
          await Promise.all([
            getMonitorById(monitorId),
            getMonitorChecks(monitorId)
          ]);

        setMonitor(monitorData);
        setChecks(checksData);
      } catch (error) {
        setError(
          getApiErrorMessage(
            error,
            "Failed to load monitor details"
          )
        );
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