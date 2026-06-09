import Dashboard from "./pages/Dashboard";

import { useUsbMonitor } from "./hooks/useUsbMonitor";

function App() {
  useUsbMonitor();

  return <Dashboard />;
}

export default App;
