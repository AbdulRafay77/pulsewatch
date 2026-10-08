import { useEffect, useState } from "react";
import { getMonitors, createMonitor, runMonitorCheck, updateMonitor } from "../api/monitorApi.js";

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

  async function toggleMonitorPause(monitorId, isPaused) {
    try {
      setError("");

      const updatedMonitor = await updateMonitor(
        monitorId,
        {
          isPaused: !isPaused
        }
      );

      setMonitors((currentMonitors) =>
        currentMonitors.map((monitor) =>
          monitor._id === monitorId
            ? updatedMonitor
            : monitor
        )
      );

      return updatedMonitor;
    } catch (error) {
      setError("Failed to update monitor");
      throw error;
    }
  }

  async function editMonitor(monitorId, updates) {
    try {
      setError("");

      const updatedMonitor = await updateMonitor(
        monitorId,
        updates
      );

      setMonitors((currentMonitors) =>
        currentMonitors.map((monitor) =>
          monitor._id === monitorId
            ? updatedMonitor
            : monitor
        )
      );

      return updatedMonitor;
    } catch (error) {
      setError("Failed to edit monitor");
      throw error;
    }
  }

  return {
    monitors,
    loading,
    error,
    addMonitor,
    checkMonitorNow,
    toggleMonitorPause,
    editMonitor
  };
}

export default useMonitors;