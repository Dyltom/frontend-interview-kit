import { Timer } from '@components/Timer';
import { useState } from 'react';
import { BootSequence, CRTMonitor } from 'neo-terminal-ui';

function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  const handleBootComplete = () => {
    setShowBoot(false);
    setTimeout(() => {
      setShowTimer(true);
    }, 500);
  };

  return (
    <CRTMonitor>
      {showBoot ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : showTimer ? (
        <div className="terminal-window fade-in">
          <Timer />
        </div>
      ) : null}
    </CRTMonitor>
  );
}

export default App;