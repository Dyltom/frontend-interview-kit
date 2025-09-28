import { Timer } from '@components/Timer';
import { useEffect, useState } from 'react';

function App() {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoot(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="crt-monitor"></div>
      <div className="terminal-screen">
        <div className="terminal-window">
          {showBoot && (
            <div className="boot-sequence" style={{ marginBottom: '2rem' }}>
              <div className="terminal-text typing-text">
                {'> INITIALIZING MATRIX TERMINAL v2.0...'}<span className="cursor"></span>
              </div>
              <div className="terminal-text" style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {'> LOADING TEMPORAL DISPLACEMENT MODULE...'}
              </div>
              <div className="terminal-text" style={{ opacity: 0.5, fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {'> CALIBRATING DRIFT CORRECTION ALGORITHMS...'}
              </div>
            </div>
          )}
          <Timer />
        </div>
      </div>
    </>
  );
}

export default App;