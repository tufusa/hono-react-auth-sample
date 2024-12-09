import { useCallback, useEffect, useState } from "react";

export const App = () => {
  const [auth, setAuth] = useState<boolean>(false);
  const [data, setData] = useState<{ data: string }>();
  const [error, setError] = useState<{ status: number; message: string }>();

  const refetch = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/`, {
      credentials: "include",
    }).catch(() => undefined);
    if (!res) return;
    if (!res?.ok) {
      setError({ status: res.status, message: res.statusText });
      return;
    }

    const data = await res.json();
    setData(data);
    setError(undefined);
    setAuth(true);
  }, [setData, setError]);
  const login = useCallback(async (username: string, password: string) => {
    const auth = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
      credentials: "include",
      headers: {
        Authorization: `Basic ${btoa(`${username}:${password}`)}`,
      },
    }).catch(() => undefined);
    if (!auth?.ok) return;

    setAuth(true);
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div
      style={{
        margin: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
      }}
    >
      <h1>Hono React Auth Sample</h1>
      <div>
        Data
        <pre
          style={{
            background: "#444",
            padding: "1rem",
            borderRadius: "5px",
            width: "20rem",
            boxSizing: "border-box",
          }}
        >
          {data && JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <div>
        Error
        <pre
          style={{
            background: "#444",
            padding: "1rem",
            borderRadius: "5px",
            width: "20rem",
            boxSizing: "border-box",
          }}
        >
          {error && `${error.status}: ${error.message}`}
        </pre>
      </div>
      <button onClick={refetch}>Refetch</button>
      <div>
        Auth
        {auth ? (
          <div style={{ color: "green" }}>You are logged in.</div>
        ) : (
          <div style={{ color: "red" }}>You are not logged in.</div>
        )}
        <form
          style={{
            margin: "1rem 0rem",
            background: "#333",
            width: "20rem",
            padding: "1rem 3rem",
            boxSizing: "border-box",
            borderRadius: "3px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const usernameInput = e.currentTarget.elements.namedItem(
              "username"
            ) as HTMLInputElement;
            const passwordInput = e.currentTarget.elements.namedItem(
              "password"
            ) as HTMLInputElement;

            login(usernameInput.value, passwordInput.value);
          }}
        >
          <input
            type="text"
            name="username"
            placeholder="username"
            autoComplete="username"
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            autoComplete="current-password"
          />
          <input
            type="submit"
            style={{ margin: "1rem 0rem 0rem 0rem" }}
            value="Login"
          />
        </form>
      </div>
    </div>
  );
};
