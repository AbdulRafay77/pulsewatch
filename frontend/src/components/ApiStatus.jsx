import useApiHealth from "../hooks/useApiHealth";

function ApiStatus() {
  const { status, loading, error } = useApiHealth;

  if (loading) {
    return <h1>Checking API...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (status === "ok") {
    return <h1>API is online</h1>;
  }

  return <h1>API is offline</h1>;
}

export default ApiStatus;