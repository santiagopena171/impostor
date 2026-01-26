import React, { useState, useEffect } from 'react';
import PlayerInput from '../../components/PlayerInput';
import GameConfig from '../../components/GameConfig';
import ResultList from '../../components/ResultList';
import Scoreboard from '../../components/Scoreboard';
import RoundWinner from '../../components/RoundWinner';
import { assignRolesMultiCategory, getCategories } from './gameLogic';
import firebaseService from '../../services/firebaseService';

function ImpostorGameMultiCategory({ onBack, gameMode, isOnline, isHost, onlineRoomCode, currentPlayerName, matchPlayers, globalScores, onUpdateScores }) {
    const [playerText, setPlayerText] = useState(matchPlayers ? matchPlayers.join('\n') : '');
    const [impostorCount, setImpostorCount] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(getCategories()[0]);
    const [results, setResults] = useState(null);
    const [error, setError] = useState('');
    const [scores, setScores] = useState(globalScores || {});
    const [roundNumber, setRoundNumber] = useState(1);
    const [showWinner, setShowWinner] = useState(false);
    const [roundWinner, setRoundWinner] = useState(null);

    // Escuchar cambios en Firebase para modo online
    useEffect(() => {
        if (isOnline && onlineRoomCode && !isHost) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.impostorResults) {
                    setResults(roomData.gameState.impostorResults);
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isOnline, onlineRoomCode, isHost]);

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
                .map(line => line.trim())
                .filter(name => name !== '');
            const newResults = assignRolesMultiCategory(playerNames, impostorCount, selectedCategory);

            // Si es modo online, guardar en Firebase
            if (isOnline && onlineRoomCode) {
                await firebaseService.updateGameState(onlineRoomCode, {
                    impostorResults: newResults
                });
            }

            setResults(newResults);
        } catch (err) {
            setError(err.message);
            setResults(null);
        }
    };

    const handleRoundComplete = (winnerName) => {
        if (gameMode === 'competitive' && winnerName) {
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

    const handleReset = () => {
        setResults(null);
        setError('');
    };

    const categories = getCategories();

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

            <h1>Impostor Multiclasificación</h1>

            {gameMode === 'competitive' && Object.keys(scores).length > 0 && (
                <Scoreboard scores={scores} roundNumber={roundNumber} />
            )}

            {!results ? (
                <>
                    {(!isOnline || isHost) && (
                        <>
                            <PlayerInput value={playerText} onChange={setPlayerText} />
                            
                            {/* Selector de Categoría */}
                            <div className="card" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                                    Categoría:
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: '1rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category} style={{ background: '#0f172a' }}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <GameConfig
                                impostorCount={impostorCount}
                                setImpostorCount={setImpostorCount}
                                maxImpostors={Math.floor((playerText.split('\n').filter(l => l.trim()).length - 1) / 1)}
                            />
                        </>
                    )}

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
                            Nueva Ronda
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
                            El anfitrión repartirá los roles
                        </div>
                    )}
                </>
            ) : (
                <>
                    <ResultList
                        results={isOnline && currentPlayerName && results
                            ? results.filter(r => r.name.trim().toLowerCase() === currentPlayerName.trim().toLowerCase())
                            : results
                        }
                        isOnline={isOnline}
                    />

                    {gameMode === 'competitive' && (isHost || !isOnline) && (
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
                                            padding: '12px'
                                        }}
                                    >
                                        {player.name} (+1 punto)
                                    </button>
                                ))}
                            </div>
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

                    {(!isOnline || isHost) && (
                        <>
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
                </>
            )}

            {showWinner && roundWinner && (
                <RoundWinner winner={roundWinner} onContinue={handleWinnerContinue} />
            )}
        </div>
    );
}

export default ImpostorGameMultiCategory;
