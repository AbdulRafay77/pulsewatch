import { useEffect, useState } from "react";
import { getMonitors, createMonitor } from "../api/monitorApi.js";

function useMonitor() {
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

  return {
    monitors,
    loading,
    error,
    addMonitor
  };
}

export default useMonitors;