import { RouterProvider } from "react-router-dom";
import { AppErrorBoundary } from "./errors";
import { router } from "./routes";

export default function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}
