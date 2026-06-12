import Dashboard from "./pages/Dashboard";

import { useUsbMonitor } from "./hooks/useUsbMonitor";
import { NotificationContainer } from "./components/notifications/NotificationContainer";
import { useLaunchScreen } from "./hooks/useLaunchScreen";
import { LaunchScreen } from "./components/launch/LaunchScreen";

function App() {
  useUsbMonitor();
  const showLaunchScreen = useLaunchScreen();

  if (showLaunchScreen) {
    return <LaunchScreen />;
  }

  return (
    <>
      <Dashboard />
      <NotificationContainer />
    </>
  );
}

export default App;
