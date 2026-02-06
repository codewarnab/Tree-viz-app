import { RootLayout } from "./components/layout";
import { OperationsPanel, InfoPanel } from "./components/controls";
import { TreeCanvas } from "./components/tree";
import { BSTAnimationProvider } from "./hooks";

function App() {
  return (
    <BSTAnimationProvider>
      <RootLayout>
        {/* Main canvas area — SVG tree visualization */}
        <TreeCanvas />
        <OperationsPanel />
        <InfoPanel />
      </RootLayout>
    </BSTAnimationProvider>
  );
}

export default App;

