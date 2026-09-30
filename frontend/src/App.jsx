import { useEffect, useState } from "react";
import api from "./lib/axios";

function App() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await api.get("/health");

        setStatus(response.data.message);
      } catch (error) {
        setError("Unable to connect to PulseWatch API");
      } finally {
        setLoading(false);
      }
    }

    checkApi();
  }, []);

  if (loading) {
    return <h1>Checking API...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>PulseWatch</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;