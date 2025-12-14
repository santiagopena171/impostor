import React, { useState } from 'react';
import PlayerInput from '../../components/PlayerInput';
import ResultList from '../../components/ResultList';
import Scoreboard from '../../components/Scoreboard';
import RoundWinner from '../../components/RoundWinner';
import { assignUniqueTowers } from '../../utils/gameLogic';

function TorresGame({ onBack, gameMode, matchPlayers, globalScores, onUpdateScores }) {
    const [playerText, setPlayerText] = useState(matchPlayers ? matchPlayers.join('\n') : '');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [scores, setScores] = useState(globalScores || {});
    const [roundNumber, setRoundNumber] = useState(1);
    const [showWinner, setShowWinner] = useState(false);
    const [roundWinner, setRoundWinner] = useState(null);

    const handleNewRound = () => {
        setError('');
        try {
            const playerNames = playerText.split('\n').filter(name => name.trim() !== '');
            const newResults = assignUniqueTowers(playerNames);
            setResults(newResults);

            // Inicializar scores si es modo competitivo y no hay scores
            if (gameMode === 'competitive' && Object.keys(scores).length === 0) {
                const initialScores = {};
                playerNames.forEach(name => {
                    if (name.trim()) {
                        initialScores[name.trim()] = 0;
                    }
                });
                setScores(initialScores);
                if (onUpdateScores) onUpdateScores(initialScores);
            }
        } catch (err) {
            setError(err.message);
            setResults(null);
        }
    };

    const handleRoundComplete = (winnerName) => {
        if (gameMode === 'competitive' && winnerName) {
            // Buscar el resultado del ganador para obtener los puntos
            const winnerResult = results.find(r => r.name === winnerName);
            if (winnerResult) {
                const newScores = { ...scores };
                newScores[winnerName] = (newScores[winnerName] || 0) + winnerResult.points;
                setScores(newScores);
                if (onUpdateScores) onUpdateScores(newScores);
                
                setRoundWinner({
                    name: winnerName,
                    points: winnerResult.points,
                    tied: false
                });
                setShowWinner(true);
            }
        }
    };

    const handleWinnerContinue = () => {
        setShowWinner(false);
        setRoundNumber(roundNumber + 1);
        setResults(null);
    };

    const handleSkipRound = () => {
        setRoundNumber(roundNumber + 1);
        setResults(null);
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
                ← Cambiar Modo
            </button>

            <h1>Torres Futboleras 🏗️</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                {gameMode === 'competitive' ? '🏆 Modo Competitivo' : '🎮 Modo Casual'}
            </p>

            {gameMode === 'competitive' && Object.keys(scores).length > 0 && (
                <Scoreboard scores={scores} roundNumber={roundNumber} />
            )}

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
                        Repartir Torres
                    </button>
                </>
            ) : (
                <>
                    <ResultList results={results} gameMode={gameMode} />
                    
                    {gameMode === 'competitive' && (
                        <div className="card" style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '15px' }}>¿Quién ganó la ronda?</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {results.map((player) => (
                                    <button
                                        key={player.name}
                                        onClick={() => handleRoundComplete(player.name)}
                                        style={{
                                            background: 'var(--secondary)',
                                            color: '#0f172a',
                                            padding: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <span>{player.name}</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                                            +{player.points} pts
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleSkipRound}
                                style={{
                                    marginTop: '15px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '12px'
                                }}
                            >
                                Saltar Ronda (sin puntuar)
                            </button>
                        </div>
                    )}

                    {gameMode === 'casual' && (
                        <>
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
                </>
            )}

            {showWinner && roundWinner && (
                <RoundWinner winner={roundWinner} onContinue={handleWinnerContinue} />
            )}
        </div>
    );
}

export default TorresGame;
