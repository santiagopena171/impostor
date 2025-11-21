import React, { useState } from 'react';
import PlayerInput from './components/PlayerInput';
import GameConfig from './components/GameConfig';
import ResultList from './components/ResultList';
import { assignRoles } from './utils/gameLogic';

function App() {
  const [playerText, setPlayerText] = useState('');
  const [impostorCount, setImpostorCount] = useState(1);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleNewRound = () => {
    setError('');
    try {
      const playerNames = playerText.split('\n');
      const newResults = assignRoles(playerNames, impostorCount);
      setResults(newResults);
    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError('');
  };

  return (
    <div className="app-container">
      <h1>Impostor Futbolero</h1>

      {!results ? (
        <>
          <PlayerInput value={playerText} onChange={setPlayerText} />
          <GameConfig
            impostorCount={impostorCount}
            setImpostorCount={setImpostorCount}
            maxImpostors={Math.floor((playerText.split('\n').filter(l => l.trim()).length - 1) / 1)} // Simple logic, refined in validation
          />

          {error && (
            <div style={{
              color: '#ff4d4d',
              background: 'rgba(255, 77, 77, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button onClick={handleNewRound}>
            Nueva Ronda
          </button>
        </>
      ) : (
        <>
          <ResultList results={results} />
          <button
            onClick={handleNewRound}
            style={{ marginTop: '20px', background: 'var(--secondary)', color: '#0f172a' }}
          >
            Nueva Ronda
          </button>
          <button
            onClick={handleReset}
            style={{ marginTop: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Volver a Configuración
          </button>
        </>
      )}
    </div>
  );
}

export default App;
