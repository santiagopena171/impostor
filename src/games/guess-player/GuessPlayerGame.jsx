import React, { useState } from 'react';
import PlayerInput from '../../components/PlayerInput';
import ResultList from '../../components/ResultList';
import { assignUniquePlayers } from '../../utils/gameLogic';

function GuessPlayerGame({ onBack }) {
    const [playerText, setPlayerText] = useState('');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');

    const handleNewRound = () => {
        setError('');
        try {
            const playerNames = playerText.split('\n');
            const newResults = assignUniquePlayers(playerNames);
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
            <button
                onClick={onBack}
                className="back-button"
                style={{
                    marginBottom: '20px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: '0.9rem',
                    padding: '10px 20px'
                }}
            >
                ← Volver al Inicio
            </button>

            <h1>Adivina mi Jugador</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Cada jugador recibirá un futbolista diferente. ¡Adivina quién es quién!
            </p>

            {!results ? (
                <>
                    <PlayerInput value={playerText} onChange={setPlayerText} />

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
                        Repartir Jugadores
                    </button>
                </>
            ) : (
                <>
                    <ResultList results={results} />
                    <button
                        onClick={handleNewRound}
                        style={{ marginTop: '20px', background: 'var(--secondary)', color: '#0f172a' }}
                    >
                        Nueva Ronda (Reasignar)
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

export default GuessPlayerGame;
