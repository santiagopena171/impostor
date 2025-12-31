import React, { useState, useEffect } from 'react';
import PlayerInput from '../../components/PlayerInput';
import ResultList from '../../components/ResultList';
import Scoreboard from '../../components/Scoreboard';
import RoundWinner from '../../components/RoundWinner';
import { assignUniquePlayers } from '../../utils/gameLogic';
import firebaseService from '../../services/firebaseService';

function GuessPlayerGame({ onBack, gameMode, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const [playerText, setPlayerText] = useState(matchPlayers ? matchPlayers.join('\n') : '');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [scores, setScores] = useState(globalScores || {});
    const [roundNumber, setRoundNumber] = useState(1);
    const [showWinner, setShowWinner] = useState(false);
    const [roundWinner, setRoundWinner] = useState(null);
    const [allPlayers, setAllPlayers] = useState(null); // Jugadores completos (para sincronizar)

    // Escuchar cambios en Firebase para modo online
    useEffect(() => {
        if (isOnline && onlineRoomCode && !isHost) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.guessPlayerResults) {
                    setAllPlayers(roomData.gameState.guessPlayerResults);
                    // Filtrar para mostrar solo los jugadores de los demás
                    const filteredResults = roomData.gameState.guessPlayerResults.filter(
                        r => r.name.trim().toLowerCase() !== currentPlayerName.trim().toLowerCase()
                    );
                    setResults(filteredResults);
                }
                // Actualizar scores cuando cambien en Firebase
                if (roomData.scores) {
                    setScores(roomData.scores);
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isOnline, onlineRoomCode, isHost, currentPlayerName]);

    // Sincronizar scores locales con globalScores cuando cambian
    useEffect(() => {
        if (globalScores && Object.keys(globalScores).length > 0) {
            setScores(globalScores);
        }
    }, [globalScores]);

    const handleNewRound = async () => {
        setError('');
        try {
            const playerNames = playerText.split('\n')
                .map(name => name.trim())
                .filter(name => name !== '');
            const newResults = assignUniquePlayers(playerNames);

            // Si es modo online, guardar en Firebase
            if (isOnline && onlineRoomCode) {
                await firebaseService.updateGameState(onlineRoomCode, {
                    guessPlayerResults: newResults,
                    roundNumber: roundNumber
                });
                setAllPlayers(newResults);
            }

            // Si es online, filtrar resultados para no mostrar el jugador del usuario actual
            if (isOnline && currentPlayerName) {
                const filteredResults = newResults.filter(r => r.name.trim().toLowerCase() !== currentPlayerName.trim().toLowerCase());
                setResults(filteredResults);
            } else {
                setResults(newResults);
            }

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
            // Buscar en allPlayers si existe, sino en results
            const searchResults = allPlayers || results;
            const newScores = { ...scores };
            newScores[winnerName] = (newScores[winnerName] || 0) + 1;
            setScores(newScores);
            if (onUpdateScores) onUpdateScores(newScores);

            setRoundWinner({
                name: winnerName,
                points: 1,
                tied: false
            });
            setShowWinner(true);
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
                ← Volver
            </button>

            <h1>Adivina mi Jugador 🕵️</h1>
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

                    {(!isOnline || isHost) && (
                        <button onClick={handleNewRound}>
                            Repartir Jugadores
                        </button>
                    )}

                    {isOnline && !isHost && (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            color: 'var(--text-dim)',
                            marginTop: '20px'
                        }}>
                            El anfitrión repartirá los jugadores
                        </div>
                    )}
                </>
            ) : (
                <>
                    <ResultList results={results} gameMode={gameMode} />

                    {gameMode === 'competitive' && (
                        <div className="card" style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '15px' }}>¿Quién ganó la ronda?</h4>
                            {(!isOnline || isHost) ? (
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {(allPlayers || results).map((player) => (
                                            <button
                                                key={player.name}
                                                onClick={() => handleRoundComplete(player.name)}
                                                style={{
                                                    background: 'var(--secondary)',
                                                    color: '#0f172a',
                                                    padding: '12px'
                                                }}
                                            >
                                                {player.name} (+1 punto)
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
                                </>
                            ) : (
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    color: 'var(--text-dim)'
                                }}>
                                    El anfitrión seleccionará al ganador
                                </div>
                            )}
                        </div>
                    )}

                    {gameMode === 'casual' && (!isOnline || isHost) && (
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

export default GuessPlayerGame;
