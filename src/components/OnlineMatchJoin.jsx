import React, { useState } from 'react';
import firebaseService from '../services/firebaseService';

function OnlineMatchJoin({ onJoinMatch, onBack }) {
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleJoin = async () => {
        if (!roomCode.trim()) {
            setError('Por favor, ingresa el código de sala');
            return;
        }

        if (!playerName.trim()) {
            setError('Por favor, ingresa tu nombre');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const roomData = await firebaseService.joinRoom(
                roomCode.trim(),
                playerName.trim()
            );

            onJoinMatch({
                ...roomData.matchData,
                roomCode: roomCode.trim().toUpperCase(),
                isOnline: true,
                playerName: playerName.trim(),
                scores: roomData.scores
            });
        } catch (err) {
            setError(err.message || 'Error al unirse a la sala');
            setLoading(false);
        }
    };

    const handleRoomCodeChange = (e) => {
        // Convertir a mayúsculas automáticamente
        setRoomCode(e.target.value.toUpperCase());
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
                disabled={loading}
            >
                ← Volver
            </button>

            <div className="home-header">
                <h1 className="home-title">🎯 Unirse a Partida</h1>
                <p className="home-subtitle">Ingresa el código para unirte</p>
            </div>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        Código de Sala
                    </label>
                    <input
                        type="text"
                        value={roomCode}
                        onChange={handleRoomCodeChange}
                        placeholder="Ej: ABC123"
                        disabled={loading}
                        maxLength={6}
                        style={{
                            width: '100%',
                            padding: '16px 20px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'inherit',
                            fontSize: '1.5rem',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            letterSpacing: '4px'
                        }}
                    />
                    <div style={{ 
                        marginTop: '8px', 
                        fontSize: '0.85rem', 
                        opacity: '0.7',
                        textAlign: 'center'
                    }}>
                        El código tiene 6 caracteres
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        Tu Nombre
                    </label>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Ingresa tu nombre"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'inherit',
                            fontSize: '1rem',
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ 
                        marginTop: '8px', 
                        fontSize: '0.85rem', 
                        opacity: '0.7' 
                    }}>
                        💡 Debe coincidir con tu nombre en la lista de jugadores
                    </div>
                </div>

                {error && (
                    <div style={{
                        color: '#ff4d4d',
                        background: 'rgba(255, 77, 77, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    onClick={handleJoin}
                    disabled={loading || !roomCode.trim() || !playerName.trim()}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: loading || !roomCode.trim() || !playerName.trim() 
                            ? 'rgba(255,255,255,0.1)' 
                            : 'var(--secondary)',
                        color: loading || !roomCode.trim() || !playerName.trim() 
                            ? 'inherit' 
                            : '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading || !roomCode.trim() || !playerName.trim() 
                            ? 'not-allowed' 
                            : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? '🌐 Uniéndose...' : '🎮 Unirse a la Partida'}
                </button>

                <div style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        ℹ️ Instrucciones
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Pide al anfitrión el código de 6 dígitos</li>
                        <li>Ingresa el código exactamente como te lo den</li>
                        <li>Tu nombre debe estar en la lista de jugadores</li>
                        <li>Una vez unido, espera a que empiece la partida</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OnlineMatchJoin;
