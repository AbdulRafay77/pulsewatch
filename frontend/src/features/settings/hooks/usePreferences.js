import { useEffect, useState } from "react";
import { getPreferences, updatePreferences } from "../api/preferencesApi.js";

export function usePreferences() {
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPreferences() {
      try {
        setLoading(true);
        setError("");
        const data = await getPreferences();
        setEmailAlertsEnabled(data.emailAlertsEnabled);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load preferences");
      } finally {
        setLoading(false);
      }
    }
    loadPreferences();
  }, []);

  async function toggleEmailAlerts() {
    try {
      setSaving(true);
      setError("");

      const newValue = !emailAlertsEnabled;
      const data = await updatePreferences({ emailAlertsEnabled: newValue });
      setEmailAlertsEnabled(data.emailAlertsEnabled);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update preferences");
    } finally {
      setSaving(false);
    }
  }

  return {
    emailAlertsEnabled,
    loading,
    saving,
    error,
    toggleEmailAlerts
  };
}
