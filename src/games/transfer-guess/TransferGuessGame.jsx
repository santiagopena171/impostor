import React, { useState, useEffect } from 'react';
import Scoreboard from '../../components/Scoreboard';
import { startTransferGuessRound } from '../../utils/gameLogic';
import firebaseService from '../../services/firebaseService';

// Modo "Adivina la Transferencia": por turnos, se muestra el año, el club de
// origen, el club de destino y el monto de una transferencia real, y hay que
// adivinar de qué jugador se trata. El host determina si el jugador acertó.
function TransferGuessGame({ onBack, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const players = (matchPlayers || []).filter(name => name && name.trim() !== '');
    const [scores, setScores] = useState(globalScores || {});
    const [round, setRound] = useState(null); // { guesser, turnIndex, transfer }
    const [error, setError] = useState('');
    const [nameRevealed, setNameRevealed] = useState(false);

    useEffect(() => {
        if (globalScores && Object.keys(globalScores).length > 0) {
            setScores(globalScores);
        }
    }, [globalScores]);

    useEffect(() => {
        if (isOnline && onlineRoomCode) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.transferGuessRound) {
                    setRound(roomData.gameState.transferGuessRound);
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
            await firebaseService.updateGameState(onlineRoomCode, { transferGuessRound: newRound });
        }
    };

    const handleStartRound = async (turnIndex) => {
        setError('');
        try {
            const newRound = startTransferGuessRound(players, turnIndex, round?.usedIndices || []);
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

    const handleResolveRound = (guessedCorrectly) => {
        if (!round) return;

        if (guessedCorrectly) {
            const newScores = { ...scores };
            newScores[round.guesser] = (newScores[round.guesser] || 0) + 1;
            setScores(newScores);
            if (onUpdateScores) onUpdateScores(newScores);
        }

        handleStartRound(round.turnIndex + 1);
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

            <h1>Adivina la Transferencia 💸</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Se revela el año, el club de origen, el club de destino y el monto. ¡Adivina al jugador!
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
                                {nameRevealed ? round.transfer.name : '???'}
                            </div>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginBottom: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Año</div>
                            <div style={{ fontWeight: '600' }}>{round.transfer.year}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>De</div>
                            <div style={{ fontWeight: '600' }}>{round.transfer.fromClub}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>A</div>
                            <div style={{ fontWeight: '600' }}>{round.transfer.toClub}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Monto</div>
                            <div style={{ fontWeight: '600' }}>{round.transfer.amount}</div>
                        </div>
                    </div>

                    {(!isOnline || isHost) ? (
                        <>
                            <h4 style={{ marginBottom: '15px', textAlign: 'center' }}>¿Acertó {round.guesser}?</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    onClick={() => handleResolveRound(true)}
                                    style={{ flex: 1, background: 'var(--secondary)', color: '#0f172a' }}
                                >
                                    ✅ Acertó (+1)
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

export default TransferGuessGame;
