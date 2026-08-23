import React, { useState, useEffect } from 'react';
import Scoreboard from '../../components/Scoreboard';
import { startTurnGuessRound, TURN_GUESS_HINT_COSTS } from '../../utils/gameLogic';
import firebaseService from '../../services/firebaseService';

// Modo "Adivina por Turnos": los jugadores adivinan por turnos a un futbolista.
// El juego revela automáticamente nacionalidad y goles. Pedir clubes, posición
// o palmarés resta puntos de los 10 que están en juego en la ronda.
// El creador de la partida (host) es quien determina si el jugador acertó o no.
function TurnGuessGame({ onBack, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const players = (matchPlayers || []).filter(name => name && name.trim() !== '');
    const [scores, setScores] = useState(globalScores || {});
    const [round, setRound] = useState(null); // { guesser, turnIndex, target, pointsInPlay, usedHints }
    const [error, setError] = useState('');
    const [nameRevealed, setNameRevealed] = useState(false);

    // Sincronizar scores locales con globalScores cuando cambian
    useEffect(() => {
        if (globalScores && Object.keys(globalScores).length > 0) {
            setScores(globalScores);
        }
    }, [globalScores]);

    // Escuchar cambios en Firebase para modo online (todos los jugadores,
    // incluido el host, para reflejar pedidos de pistas de otros jugadores)
    useEffect(() => {
        if (isOnline && onlineRoomCode) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.turnGuessRound) {
                    setRound(roomData.gameState.turnGuessRound);
                }
                if (roomData.scores) {
                    setScores(roomData.scores);
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isOnline, onlineRoomCode, isHost]);

    const syncRound = async (newRound) => {
        setRound(newRound);
        setNameRevealed(false);
        if (isOnline && onlineRoomCode) {
            await firebaseService.updateGameState(onlineRoomCode, { turnGuessRound: newRound });
        }
    };

    const handleStartRound = async (turnIndex) => {
        setError('');
        try {
            const newRound = startTurnGuessRound(players, turnIndex);
            await syncRound(newRound);

            if (Object.keys(scores).length === 0) {
                const initialScores = {};
                players.forEach(name => { initialScores[name] = 0; });
                setScores(initialScores);
                if (onUpdateScores) onUpdateScores(initialScores);
            }
        } catch (err) {
            setError(err.message);
            setRound(null);
        }
    };

    const handleRequestHint = (hintKey) => {
        if (!round || round.usedHints[hintKey]) return;
        const cost = TURN_GUESS_HINT_COSTS[hintKey];
        const newRound = {
            ...round,
            pointsInPlay: Math.max(0, round.pointsInPlay - cost),
            usedHints: { ...round.usedHints, [hintKey]: true }
        };
        syncRound(newRound);
    };

    const handleResolveRound = (guessedCorrectly) => {
        if (!round) return;

        const newScores = { ...scores };
        if (guessedCorrectly) {
            newScores[round.guesser] = (newScores[round.guesser] || 0) + round.pointsInPlay;
            setScores(newScores);
            if (onUpdateScores) onUpdateScores(newScores);
        }

        handleStartRound(round.turnIndex + 1);
    };

    const canRequestHints = round && (!isOnline || currentPlayerName === round.guesser);

    const renderHintRow = (hintKey, label, content) => {
        if (round.usedHints[hintKey]) {
            return (
                <div key={hintKey} style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: 'rgba(56, 239, 125, 0.1)',
                    border: '1px solid rgba(56, 239, 125, 0.3)'
                }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontWeight: '600' }}>{content}</div>
                </div>
            );
        }

        if (canRequestHints) {
            return (
                <button key={hintKey} onClick={() => handleRequestHint(hintKey)}>
                    Pedir {label} (-{TURN_GUESS_HINT_COSTS[hintKey]} pts)
                </button>
            );
        }

        return (
            <div key={hintKey} style={{
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'center',
                color: 'var(--text-dim)',
                background: 'rgba(255,255,255,0.05)',
                border: '1px dashed rgba(255,255,255,0.2)'
            }}>
                🔒 Solo {round.guesser} puede pedir {label.toLowerCase()}
            </div>
        );
    };

    if (players.length < 2) {
        return (
            <div className="app-container">
                <button onClick={onBack} className="back-button" style={{ marginBottom: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', padding: '10px 20px' }}>
                    ← Volver
                </button>
                <p style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
                    Se necesitan al menos 2 jugadores para este modo.
                </p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <button onClick={onBack} className="back-button" style={{ marginBottom: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', padding: '10px 20px' }}>
                ← Volver
            </button>

            <h1>Adivina por Turnos 🔄</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Cada jugador tiene 10 puntos en juego. Pedir datos extra resta puntos.
            </p>

            {Object.keys(scores).length > 0 && (
                <Scoreboard scores={scores} roundNumber={round ? round.turnIndex + 1 : 0} />
            )}

            {error && (
                <div style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {!round ? (
                (!isOnline || isHost) ? (
                    <button onClick={() => handleStartRound(0)}>
                        Comenzar Turnos
                    </button>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        El anfitrión iniciará la ronda
                    </div>
                )
            ) : (
                <div className="card">
                    <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
                        Turno de: {round.guesser}
                    </h3>

                    {currentPlayerName === round.guesser ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '14px',
                            marginBottom: '16px',
                            borderRadius: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px dashed rgba(255,255,255,0.2)'
                        }}>
                            <div style={{ fontWeight: '600' }}>
                                🔒 Es tu turno, no puedes ver el nombre
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setNameRevealed(!nameRevealed)}
                            style={{
                                textAlign: 'center',
                                padding: '14px',
                                marginBottom: '16px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                background: nameRevealed ? 'rgba(56, 239, 125, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: nameRevealed ? '1px solid rgba(56, 239, 125, 0.4)' : '1px dashed rgba(255,255,255,0.2)'
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                                toca para {nameRevealed ? 'ocultar' : 'ver'} el nombre
                            </div>
                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>
                                {nameRevealed ? round.target.name : '???'}
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginBottom: '16px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Nacionalidad</div>
                            <div style={{ fontWeight: '600' }}>{round.target.nationality}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Goles</div>
                            <div style={{ fontWeight: '600' }}>{round.target.goals}</div>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: 'var(--secondary)',
                        marginBottom: '20px'
                    }}>
                        {round.pointsInPlay} pts en juego
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {renderHintRow('clubes', 'Clubes', round.target.clubs.join(', '))}
                        {renderHintRow('posicion', 'Posición', round.target.position)}
                        {renderHintRow('palmares', 'Palmarés', round.target.honours)}
                    </div>

                    {(!isOnline || isHost) ? (
                        <>
                            <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>¿Acertó {round.guesser}?</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleResolveRound(true)}
                                    style={{ flex: 1, background: 'var(--secondary)', color: '#0f172a' }}
                                >
                                    ✅ Acertó (+{round.pointsInPlay})
                                </button>
                                <button
                                    onClick={() => handleResolveRound(false)}
                                    style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    ❌ No acertó
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dim)' }}>
                            El anfitrión determinará si acertó
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TurnGuessGame;
