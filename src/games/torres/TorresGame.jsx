import React, { useState, useEffect } from 'react';
import PlayerInput from '../../components/PlayerInput';
import ResultList from '../../components/ResultList';
import Scoreboard from '../../components/Scoreboard';
import RoundWinner from '../../components/RoundWinner';
import { assignUniqueTowers } from '../../utils/gameLogic';
import firebaseService from '../../services/firebaseService';

function TorresGame({ onBack, gameMode, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const [playerText, setPlayerText] = useState(matchPlayers ? matchPlayers.join('\n') : '');
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [scores, setScores] = useState(globalScores || {});
    const [roundNumber, setRoundNumber] = useState(1);
    const [showWinner, setShowWinner] = useState(false);
    const [roundWinner, setRoundWinner] = useState(null);
    const [allTowers, setAllTowers] = useState(null); // Torres completas (solo para sincronizar)

    // Debug
    console.log('TorresGame props:', { isOnline, isHost, currentPlayerName, onlineRoomCode });

    // Escuchar cambios en Firebase para modo online
    useEffect(() => {
        if (isOnline && onlineRoomCode && !isHost) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.torresResults) {
                    setAllTowers(roomData.gameState.torresResults);
                    // Filtrar para mostrar solo las torres de los demás
                    const filteredResults = roomData.gameState.torresResults.filter(
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
            const newResults = assignUniqueTowers(playerNames);

            // Si es modo online, guardar en Firebase
            if (isOnline && onlineRoomCode) {
                await firebaseService.updateGameState(onlineRoomCode, {
                    torresResults: newResults,
                    roundNumber: roundNumber
                });
                setAllTowers(newResults);
            }

            // Si es online, filtrar resultados para no mostrar la torre del jugador actual
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
            // Buscar en allTowers si existe, sino en results
            const searchResults = allTowers || results;
            const winnerResult = searchResults.find(r => r.name === winnerName);
            if (winnerResult) {
                // Usar globalScores en lugar de scores local
                const newScores = { ...(globalScores || scores) };
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
                ← Volver
            </button>

            <h1>Torres Futboleras 🏗️</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                {gameMode === 'competitive' ? '🏆 Modo Competitivo' : '🎮 Modo Casual'}
            </p>

            {gameMode === 'competitive' && Object.keys(scores).length > 0 && (
                <Scoreboard scores={scores} roundNumber={roundNumber} />
            )}

            {!results ? (
                <>{/* Mensaje para jugadores no host en modo online */}
                    {isOnline && !isHost && (
                        <div style={{
                            padding: '20px',
                            background: 'rgba(79, 172, 254, 0.1)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            border: '1px solid rgba(79, 172, 254, 0.3)'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                                Esperando al anfitrión
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                                El anfitrión repartirá las torres
                            </div>
                        </div>
                    )}

                    {(!isOnline || isHost) && (
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
                    )}
                </>
            ) : (
                <>
                    {isOnline && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(250, 112, 154, 0.1)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            marginBottom: '20px',
                            border: '1px solid rgba(250, 112, 154, 0.3)'
                        }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '4px' }}>
                                🔒 Torres de los demás jugadores
                            </div>
                            <div style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                                Tu torre está oculta para ti
                            </div>
                        </div>
                    )}

                    <ResultList results={results} gameMode={gameMode} />

                    {gameMode === 'competitive' && (isHost || !isOnline) && (
                        <div className="card" style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '15px' }}>¿Quién ganó la ronda?</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {(allTowers || results).map((player) => (
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

                    {gameMode === 'competitive' && isOnline && !isHost && (
                        <div style={{
                            padding: '16px',
                            background: 'rgba(79, 172, 254, 0.1)',
                            borderRadius: '12px',
                            textAlign: 'center',
                            marginTop: '20px'
                        }}>
                            ⏳ Esperando que el anfitrión seleccione al ganador...
                        </div>
                    )}

                    {gameMode === 'casual' && (isHost || !isOnline) && (
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
