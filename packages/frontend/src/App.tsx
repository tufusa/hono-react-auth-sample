import { useCallback, useEffect, useState } from "react";

export const App = () => {
  const [data, setData] = useState<{ data: string }>();
  const [error, setError] = useState<{ status: number; message: string }>();

  const getData = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/`).catch(
      () => undefined
    );
    if (!res) return;
    if (!res?.ok) {
      setError({ status: res.status, message: res.statusText });
      return;
    }

    const data = await res.json();
    setData(data);
  }, [setData, setError]);
  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div style={{ margin: "1rem" }}>
      <h1>Hono React Auth Sample</h1>
      <div>
        Data
        <pre
          style={{ background: "#444", padding: "1rem", borderRadius: "5px" }}
        >
          {data && JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <div>
        Error
        <pre
          style={{ background: "#444", padding: "1rem", borderRadius: "5px" }}
        >
          {error && `${error.status}: ${error.message}`}
        </pre>
      </div>
    </div>
  );
};
