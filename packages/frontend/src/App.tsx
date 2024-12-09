import { useEffect } from "react";

export const App = () => {
  useEffect(() => {
    const get = async () => {
      const res = await fetch("http://localhost:8787/");
      console.log(await res.json());
    };
    get();
  });

  return (
    <>
      <h1>Hono React Auth Sample</h1>
    </>
  );
};
