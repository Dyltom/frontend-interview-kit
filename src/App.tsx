import { Timer } from '@components/Timer';

function App() {
  return (
    <div className="app">
      <h1>Precision Timer</h1>
      <p className="subtitle">Drift-corrected timer with keyboard controls</p>
      <Timer />
    </div>
  );
}

export default App;