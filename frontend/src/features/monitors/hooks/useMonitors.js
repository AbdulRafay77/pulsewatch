import { useEffect, useState } from "react";
import { getMonitors, createMonitor, runMonitorCheck } from "../api/monitorApi.js";

function useMonitors() {
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMonitors() {
      try {
        const data = await getMonitors();

        setMonitors(data);
      } catch (error) {
        setError("Failed to load monitors");
      } finally {
        setLoading(false);
      }
    }

    loadMonitors();
  }, []);

  async function addMonitor(monitorData) {
    try {
      setError("");

      const newMonitor = await createMonitor(monitorData);

      setMonitors((currentMonitors) => [
        newMonitor,
        ...currentMonitors
      ]);

      return newMonitor;
    } catch (error) {
      setError("Failed to create monitor");
      throw error;
    }
  }

  async function checkMonitorNow(monitorId) {
    try {
      setError("");

      const result = await runMonitorCheck(monitorId);

      setMonitors((currentMonitors) =>
        currentMonitors.map((monitor) =>
          monitor._id === monitorId
            ? result.monitor
            : monitor
        )
      );

      return result;
    } catch (error) {
      setError("Failed to check monitor");
      throw error;
    }
  }

  return {
    monitors,
    loading,
    error,
    addMonitor,
    checkMonitorNow
  };
}

export default useMonitors;