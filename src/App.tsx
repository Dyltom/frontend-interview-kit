import { Timer } from '@components/Timer';
import { useEffect, useState } from 'react';

function App() {
  const [showBoot, setShowBoot] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBoot(false);
    }, 3500);
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
                {'> INITIALISING MATRIX TERMINAL v2.0...'}<span className="cursor"></span>
              </div>
              <div className="terminal-text" style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem', animationDelay: '0.5s' }}>
                {'> LOADING TEMPORAL DISPLACEMENT MODULE...'}
              </div>
              <div className="terminal-text" style={{ opacity: 0.5, fontSize: '0.875rem', marginTop: '0.25rem', animationDelay: '1s' }}>
                {'> CALIBRATING DRIFT CORRECTION ALGORITHMS...'}
              </div>
              <div className="terminal-text" style={{ opacity: 0.3, fontSize: '0.875rem', marginTop: '0.25rem', animationDelay: '1.5s' }}>
                {'> SYNCHRONISING QUANTUM TIME MATRICES...'}
              </div>
              <div className="terminal-text" style={{ opacity: 0.3, fontSize: '0.875rem', marginTop: '0.25rem', animationDelay: '2s' }}>
                {'> ESTABLISHING SECURE CONNECTION...'}
              </div>
              <div className="terminal-text" style={{ opacity: 0.7, fontSize: '0.875rem', marginTop: '0.5rem', animationDelay: '2.5s', color: 'var(--matrix-green-100)' }}>
                {'> SYSTEM READY'}
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