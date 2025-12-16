import React, { useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

function OnlineRoomLobby({ roomCode, matchData, playerName, isHost, onStartGame, onBack }) {
    const [connectedPlayers, setConnectedPlayers] = useState([]);
    const [copied, setCopied] = useState(false);
    const [roomData, setRoomData] = useState(null);

    // Escuchar cambios en la sala desde Firebase
    useEffect(() => {
        if (!roomCode) return;

        const unsubscribe = firebaseService.onRoomUpdate(roomCode, (data) => {
            setRoomData(data);
            
            // Extraer jugadores conectados
            if (data && data.players) {
                const connected = Object.keys(data.players).filter(
                    player => data.players[player].connected
                );
                setConnectedPlayers(connected);
            }
        });

        return () => {
            if (unsubscribe) {
                firebaseService.cleanup(roomCode);
            }
        };
    }, [roomCode]);

    const copyRoomCode = () => {
        navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const allPlayersConnected = matchData.players.every(
        player => connectedPlayers.includes(player)
    );

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
                ← Salir de la Sala
            </button>

            <div className="home-header">
                <h1 className="home-title">🌐 Sala Online</h1>
                <p className="home-subtitle">{matchData.name}</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto 20px' }}>
                <div style={{ 
                    textAlign: 'center',
                    padding: '20px',
                    background: 'rgba(250, 112, 154, 0.1)',
                    borderRadius: '12px',
                    marginBottom: '24px'
                }}>
                    <div style={{ 
                        fontSize: '0.9rem',
                        opacity: '0.8',
                        marginBottom: '8px'
                    }}>
                        Código de Sala
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        letterSpacing: '8px',
                        marginBottom: '16px'
                    }}>
                        {roomCode}
                    </div>
                    <button
                        onClick={copyRoomCode}
                        style={{
                            padding: '10px 24px',
                            background: copied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        {copied ? '✓ Copiado' : '📋 Copiar Código'}
                    </button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
                        Jugadores ({connectedPlayers.length}/{matchData.players.length})
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {matchData.players.map(player => {
                            const isConnected = connectedPlayers.includes(player);
                            const isCurrentPlayer = player === playerName;
                            
                            return (
                                <div
                                    key={player}
                                    style={{
                                        padding: '12px 16px',
                                        background: isConnected 
                                            ? 'rgba(34, 197, 94, 0.1)' 
                                            : 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: isCurrentPlayer 
                                            ? '2px solid var(--secondary)' 
                                            : '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ fontSize: '1.5rem' }}>
                                            {isConnected ? '🟢' : '⚪'}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>
                                                {player}
                                                {isCurrentPlayer && (
                                                    <span style={{ 
                                                        marginLeft: '8px',
                                                        fontSize: '0.85rem',
                                                        opacity: '0.7'
                                                    }}>
                                                        (Tú)
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ 
                                                fontSize: '0.85rem', 
                                                opacity: '0.7' 
                                            }}>
                                                {isConnected ? 'Conectado' : 'Esperando...'}
                                            </div>
                                        </div>
                                    </div>
                                    {player === matchData.host && (
                                        <div style={{
                                            padding: '4px 12px',
                                            background: 'rgba(250, 112, 154, 0.2)',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            👑 Host
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isHost && (
                    <button
                        onClick={onStartGame}
                        disabled={!allPlayersConnected}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: allPlayersConnected 
                                ? 'var(--secondary)' 
                                : 'rgba(255,255,255,0.1)',
                            color: allPlayersConnected ? '#0f172a' : 'inherit',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: allPlayersConnected ? 'pointer' : 'not-allowed',
                            fontSize: '1rem'
                        }}
                    >
                        {allPlayersConnected 
                            ? '🚀 Empezar Partida' 
                            : '⏳ Esperando jugadores...'}
                    </button>
                )}

                {!isHost && (
                    <div style={{
                        padding: '16px',
                        background: 'rgba(79, 172, 254, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        ⏳ Esperando que el anfitrión inicie la partida...
                    </div>
                )}
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        💡 Consejos
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Comparte el código con todos los jugadores</li>
                        <li>Asegúrate de tener buena conexión a internet</li>
                        <li>Los jugadores pueden unirse en cualquier orden</li>
                        {isHost && <li>Como anfitrión, tú controlas cuándo empezar</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OnlineRoomLobby;
