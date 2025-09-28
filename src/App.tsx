import { Timer } from '@components/Timer';
import { useEffect, useState } from 'react';

function App() {
  const [showBoot, setShowBoot] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setShowBoot(false);
      setTimeout(() => {
        setShowTimer(true);
      }, 500);
    }, 4000);
    return () => clearTimeout(bootTimer);
  }, []);

  return (
    <>
      <div className="crt-monitor"></div>
      <div className="terminal-screen">
        {showBoot ? (
          <div className="boot-sequence-container">
            <div className="boot-sequence">
              <div className="terminal-text typing-text">
                {'> INITIALISING MATRIX TERMINAL v2.0...'}<span className="cursor"></span>
              </div>
              <div className="terminal-text" style={{ animationDelay: '0.8s' }}>
                {'> LOADING TEMPORAL DISPLACEMENT MODULE...'}
              </div>
              <div className="terminal-text" style={{ animationDelay: '1.4s' }}>
                {'> CALIBRATING DRIFT CORRECTION ALGORITHMS...'}
              </div>
              <div className="terminal-text" style={{ animationDelay: '2s' }}>
                {'> SYNCHRONISING QUANTUM TIME MATRICES...'}
              </div>
              <div className="terminal-text" style={{ animationDelay: '2.6s' }}>
                {'> ESTABLISHING SECURE CONNECTION...'}
              </div>
              <div className="terminal-text system-ready" style={{ animationDelay: '3.2s' }}>
                {'> SYSTEM READY'}
              </div>
            </div>
          </div>
        ) : showTimer ? (
          <div className="terminal-window fade-in">
            <Timer />
          </div>
        ) : null}
      </div>
    </>
  );
}

export default App;