import { useEffect, useState } from "react";

import { getHealth } from "./api/http";

export default function App() {
  const [data, setData] = useState(null);


  useEffect(() => {
    getHealth().then(setData).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Frontend</h1>
      <pre>{data ? JSON.stringify(data, null, 2) : "Loading..."}</pre>
    </div>
  );
}
