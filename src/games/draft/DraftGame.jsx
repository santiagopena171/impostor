import React, { useState, useEffect } from 'react';
import {
    DRAFT_SLOTS,
    initDraftState,
    getEligibleDraftPlayers,
    makeDraftPick,
    getDraftWinners
} from '../../utils/gameLogic';
import firebaseService from '../../services/firebaseService';

// Modo "Draft de Goles": cada jugador arma un equipo de 7 posiciones (1 portero,
// 2 defensas, 2 mediocampistas, 2 delanteros) eligiendo futbolistas de un club
// que sale al azar en cada ronda. Los goles de cada elección se restan de un
// objetivo compartido; gana quien quede más cerca de 0.
function DraftGame({ onBack, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const players = (matchPlayers || []).filter(name => name && name.trim() !== '');
    const [scores, setScores] = useState(globalScores || {});
    const [draftState, setDraftState] = useState(null);
    const [error, setError] = useState('');
    const [awarded, setAwarded] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState(null);

    const canAct = !isOnline || isHost;

    useEffect(() => {
        if (globalScores && Object.keys(globalScores).length > 0) {
            setScores(globalScores);
        }
    }, [globalScores]);

    useEffect(() => {
        if (isOnline && onlineRoomCode) {
            const unsubscribe = firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
                if (roomData.gameState && roomData.gameState.draftState) {
                    setDraftState(roomData.gameState.draftState);
                }
                if (roomData.scores) {
                    setScores(roomData.scores);
                }
            });

            return () => {
                if (unsubscribe) unsubscribe();
            };
        }
    }, [isOnline, onlineRoomCode]);

    // La posición elegida deja de ser válida al cambiar de club/turno
    useEffect(() => {
        setSelectedPosition(null);
    }, [draftState?.currentClub, draftState?.pickIndex]);

    const syncState = async (newState) => {
        setDraftState(newState);
        setAwarded(false);
        if (isOnline && onlineRoomCode) {
            await firebaseService.updateGameState(onlineRoomCode, { draftState: newState });
        }
    };

    const handleStart = () => {
        setError('');
        try {
            const newState = initDraftState(players);

            if (Object.keys(scores).length === 0) {
                const initialScores = {};
                players.forEach(name => { initialScores[name] = 0; });
                setScores(initialScores);
                if (onUpdateScores) onUpdateScores(initialScores);
            }

            syncState(newState);
        } catch (err) {
            setError(err.message);
            setDraftState(null);
        }
    };

    const handlePick = (chosenPlayerName) => {
        if (!draftState) return;
        try {
            const newState = makeDraftPick(draftState, chosenPlayerName);
            setSelectedPosition(null);
            syncState(newState);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAwardPoint = () => {
        if (!draftState) return;
        const winners = getDraftWinners(draftState);
        const newScores = { ...scores };
        winners.forEach(name => {
            newScores[name] = (newScores[name] || 0) + 1;
        });
        setScores(newScores);
        if (onUpdateScores) onUpdateScores(newScores);
        setAwarded(true);
    };

    const handleNewDraft = () => {
        setDraftState(null);
        setError('');
        setAwarded(false);
        setSelectedPosition(null);
        if (isOnline && onlineRoomCode) {
            firebaseService.updateGameState(onlineRoomCode, { draftState: null });
        }
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

    const currentTurnName = draftState && !draftState.finished ? draftState.order[draftState.pickIndex] : null;
    const eligiblePlayers = currentTurnName ? getEligibleDraftPlayers(draftState, currentTurnName) : [];
    const winners = draftState && draftState.finished ? getDraftWinners(draftState) : [];
    const positionsWithOptions = DRAFT_SLOTS.filter(slot => eligiblePlayers.some(pl => pl.position === slot.key));
    const playersForSelectedPosition = selectedPosition ? eligiblePlayers.filter(pl => pl.position === selectedPosition) : [];
    // En online, cada jugador elige en su propio turno; en local (mismo dispositivo) cualquiera puede elegir
    const canPickNow = !isOnline || currentPlayerName === currentTurnName;

    return (
        <div className="app-container">
            <button onClick={onBack} className="back-button" style={{ marginBottom: '20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.9rem', padding: '10px 20px' }}>
                ← Volver
            </button>

            <h1>Draft de Goles ⚽🎯</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                Armá tu equipo (1 arquero, 2 defensas, 2 mediocampistas, 2 delanteros) eligiendo
                futbolistas del club que sale al azar. ¡Gana quien quede más cerca de 0!
            </p>

            {error && (
                <div style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            {!draftState ? (
                canAct ? (
                    <button onClick={handleStart}>Comenzar Draft</button>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dim)' }}>
                        El anfitrión iniciará el draft
                    </div>
                )
            ) : (
                <>
                    <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Objetivo de goles</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '700' }}>{draftState.target}</div>
                        {!draftState.finished && <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '6px' }}>Ronda {draftState.round}</div>}
                    </div>

                    {!draftState.finished && (
                        <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Club de esta ronda</div>
                            <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{draftState.currentClub?.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{draftState.currentClub?.league}</div>
                            <div style={{ marginTop: '12px', fontWeight: '600' }}>
                                Turno de: {currentTurnName}
                            </div>
                        </div>
                    )}

                    {!draftState.finished && canPickNow && (
                        <div className="card" style={{ marginBottom: '20px' }}>
                            <h4 style={{ marginBottom: '12px', textAlign: 'center' }}>Elegí una posición para {currentTurnName}</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: selectedPosition ? '16px' : 0 }}>
                                {positionsWithOptions.map(slot => (
                                    <button
                                        key={slot.key}
                                        onClick={() => setSelectedPosition(slot.key)}
                                        style={{
                                            background: selectedPosition === slot.key ? 'var(--secondary)' : undefined,
                                            color: selectedPosition === slot.key ? '#0f172a' : undefined
                                        }}
                                    >
                                        {slot.label}
                                    </button>
                                ))}
                            </div>

                            {selectedPosition && (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    maxHeight: '260px',
                                    overflowY: 'auto',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    padding: '8px',
                                    background: 'rgba(15, 23, 42, 0.6)'
                                }}>
                                    {playersForSelectedPosition.map(pl => (
                                        <button
                                            key={pl.name}
                                            onClick={() => handlePick(pl.name)}
                                            style={{
                                                textAlign: 'left',
                                                background: 'rgba(255,255,255,0.06)',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                color: '#fff',
                                                padding: '10px 14px'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--secondary)'; e.currentTarget.style.color = '#0f172a'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
                                        >
                                            {pl.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!draftState.finished && !canPickNow && (
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '12px', textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>
                            Esperando a que {currentTurnName} elija
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {(draftState.finished ? Object.keys(draftState.players) : draftState.order).map(name => {
                            const p = draftState.players[name];
                            const isWinner = winners.includes(name);
                            return (
                                <div
                                    key={name}
                                    className="card"
                                    style={{
                                        border: isWinner ? '2px solid rgba(251, 191, 36, 0.6)' : undefined,
                                        background: isWinner ? 'rgba(251, 191, 36, 0.1)' : undefined
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <span style={{ fontWeight: '700' }}>{isWinner ? '🏆 ' : ''}{name}</span>
                                        <span style={{ fontWeight: '700' }}>Restan: {p.remaining}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {DRAFT_SLOTS.map(slot => {
                                            const picksForSlot = (p.picks || []).filter(pk => pk.position === slot.key);
                                            const emptySlots = slot.count - picksForSlot.length;
                                            return (
                                                <div key={slot.key} style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', minWidth: '110px' }}>{slot.label}:</span>
                                                    {picksForSlot.map(pk => (
                                                        <span key={pk.name} style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '6px' }}>
                                                            {pk.name} ({pk.goals})
                                                        </span>
                                                    ))}
                                                    {Array.from({ length: emptySlots }).map((_, i) => (
                                                        <span key={i} style={{ fontSize: '0.8rem', color: 'var(--text-dim)', border: '1px dashed rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '6px' }}>
                                                            vacío
                                                        </span>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {draftState.finished && canAct && (
                        <>
                            {!awarded ? (
                                <button
                                    onClick={handleAwardPoint}
                                    style={{ marginTop: '20px', background: 'var(--secondary)', color: '#0f172a' }}
                                >
                                    Otorgar punto a {winners.join(' y ')}
                                </button>
                            ) : (
                                <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-dim)' }}>
                                    ✅ Punto otorgado
                                </div>
                            )}
                            <button
                                onClick={handleNewDraft}
                                style={{ marginTop: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}
                            >
                                Nuevo Draft
                            </button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default DraftGame;
