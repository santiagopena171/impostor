import React, { useEffect, useState } from 'react';
import PlayerInput from '../../components/PlayerInput';
import Scoreboard from '../../components/Scoreboard';
import intruderRounds from '../../data/intruderRounds';
import { normalizeIntruderRound } from '../../data/intruderRoundsReviewed';
import firebaseService from '../../services/firebaseService';

const shuffle = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
};

function IntruderTurnGame({ onBack, matchPlayers, globalScores, onUpdateScores, isOnline, isHost, onlineRoomCode, currentPlayerName }) {
    const [playerText, setPlayerText] = useState(matchPlayers ? matchPlayers.join('\n') : '');
    const players = playerText.split('\n').map((name) => name.trim()).filter(Boolean);
    const [scores, setScores] = useState(globalScores || {});
    const [round, setRound] = useState(null);
    const [error, setError] = useState('');
    const displayedRound = round ? normalizeIntruderRound(round) : null;

    useEffect(() => {
        if (globalScores && Object.keys(globalScores).length > 0) {
            setScores(globalScores);
        }
    }, [globalScores]);

    useEffect(() => {
        if (!isOnline || !onlineRoomCode) return undefined;

        return firebaseService.onRoomUpdate(onlineRoomCode, (roomData) => {
            if (roomData.gameState?.intruderTurnRound) setRound(normalizeIntruderRound(roomData.gameState.intruderTurnRound));
            if (roomData.scores) setScores(roomData.scores);
        });
    }, [isOnline, onlineRoomCode]);

    const syncRound = async (newRound) => {
        const normalizedRound = normalizeIntruderRound(newRound);
        setRound(normalizedRound);
        if (isOnline && onlineRoomCode) {
            await firebaseService.updateGameState(onlineRoomCode, { intruderTurnRound: normalizedRound });
        }
    };

    const startRound = async (turnIndex) => {
        const safeIndex = ((turnIndex % players.length) + players.length) % players.length;
        const challenge = intruderRounds[Math.floor(Math.random() * intruderRounds.length)];
        await syncRound({
            ...challenge,
            players: shuffle(challenge.players),
            guesser: players[safeIndex],
            turnIndex: safeIndex,
            selectedPlayer: null,
            isCorrect: null
        });
    };

    const handleStart = async () => {
        setError('');
        try {
            await startRound(0);
            if (Object.keys(scores).length === 0) {
                const initialScores = Object.fromEntries(players.map((name) => [name, 0]));
                setScores(initialScores);
                onUpdateScores?.(initialScores);
            }
        } catch {
            setError('No se pudo iniciar la ronda. Intentalo nuevamente.');
        }
    };

    const handleSelect = async (selectedPlayer) => {
        if (!round || round.selectedPlayer || (isOnline && currentPlayerName !== round.guesser)) return;

        const normalizedRound = normalizeIntruderRound(round);
        const isCorrect = selectedPlayer === normalizedRound.intruder;
        await syncRound({ ...normalizedRound, selectedPlayer, isCorrect });

        if (isCorrect) {
            const newScores = { ...scores, [normalizedRound.guesser]: (scores[normalizedRound.guesser] || 0) + 1 };
            setScores(newScores);
            onUpdateScores?.(newScores);
        }
    };

    const canAdvance = !isOnline || isHost;
    const isCurrentGuesser = !isOnline || currentPlayerName === displayedRound?.guesser;

    return (
        <div className="app-container">
            <button onClick={onBack} className="back-button">Volver</button>
            <h1>El Intruso por Turnos</h1>
            <p style={{ textAlign: 'center', color: 'var(--text-dim)', marginBottom: '20px' }}>Cuatro jugadores comparten una caracteristica. Encuentra al intruso y gana 1 punto.</p>
            {Object.keys(scores).length > 0 && <Scoreboard scores={scores} roundNumber={displayedRound ? displayedRound.turnIndex + 1 : 0} />}
            {error && <p style={{ color: '#ff4d4d' }}>{error}</p>}

            {!displayedRound ? (
                canAdvance ? <>
                    {!matchPlayers && <PlayerInput value={playerText} onChange={setPlayerText} />}
                    {players.length < 2 ? <p>Ingresa al menos 2 jugadores para comenzar.</p> : <button onClick={handleStart}>Comenzar turnos</button>}
                </> : <p>El anfitrion iniciara la ronda.</p>
            ) : (
                <div className="card">
                    <h3 style={{ marginBottom: '8px' }}>Turno de: {displayedRound.guesser}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                        {displayedRound.players.map((player) => {
                            const isSelected = player === displayedRound.selectedPlayer;
                            const isIntruder = displayedRound.selectedPlayer && player === displayedRound.intruder;
                            return <button key={player} onClick={() => handleSelect(player)} disabled={!isCurrentGuesser || Boolean(displayedRound.selectedPlayer)} style={{ minHeight: '74px', background: isIntruder ? 'rgba(56, 239, 125, 0.25)' : isSelected ? 'rgba(255, 77, 77, 0.25)' : undefined, border: isSelected || isIntruder ? '1px solid currentColor' : undefined }}>{player}</button>;
                        })}
                    </div>
                    {displayedRound.selectedPlayer ? (
                        <div style={{ marginTop: '20px' }}>
                            <p style={{ fontWeight: '700', color: displayedRound.isCorrect ? '#38ef7d' : '#ff8080' }}>{displayedRound.isCorrect ? `Correcto: ${displayedRound.intruder} era el intruso. +1 punto para ${displayedRound.guesser}.` : `No era ${displayedRound.selectedPlayer}. El intruso era ${displayedRound.intruder}.`}</p>
                            <p style={{ color: 'var(--text-dim)' }}>{displayedRound.question}</p>
                            <p style={{ color: 'var(--text-dim)' }}>{displayedRound.explanation}</p>
                            {canAdvance ? <button onClick={() => startRound(displayedRound.turnIndex + 1)}>Siguiente turno</button> : <p>El anfitrion iniciara el siguiente turno.</p>}
                        </div>
                    ) : !isCurrentGuesser && <p style={{ marginTop: '20px', color: 'var(--text-dim)' }}>Espera a que {displayedRound.guesser} elija al intruso.</p>}
                </div>
            )}
        </div>
    );
}

export default IntruderTurnGame;