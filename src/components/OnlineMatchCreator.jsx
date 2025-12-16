import React, { useState } from 'react';
import firebaseService from '../services/firebaseService';

function OnlineMatchCreator({ onCreateMatch, onBack, gameMode }) {
    const [matchName, setMatchName] = useState('');
    const [playerNames, setPlayerNames] = useState('');
    const [hostPlayerName, setHostPlayerName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        const players = playerNames
            .split('\n')
            .map(name => name.trim())
            .filter(name => name !== '');

        if (!matchName.trim()) {
            setError('Por favor, ingresa un nombre para la partida');
            return;
        }

        if (!hostPlayerName.trim()) {
            setError('Por favor, ingresa tu nombre');
            return;
        }

        if (players.length < 2) {
            setError('Se necesitan al menos 2 jugadores');
            return;
        }

        if (!players.includes(hostPlayerName.trim())) {
            setError('Tu nombre debe estar en la lista de jugadores');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const matchData = {
                name: matchName.trim(),
                players: players,
                createdAt: new Date().toISOString(),
                gameMode: gameMode
            };

            const { roomCode, roomData } = await firebaseService.createRoom(
                matchData,
                hostPlayerName.trim()
            );

            onCreateMatch({
                ...matchData,
                roomCode,
                isOnline: true,
                hostPlayerName: hostPlayerName.trim()
            });
        } catch (err) {
            setError('Error al crear la sala: ' + err.message);
            setLoading(false);
        }
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
                <h1 className="home-title">🌐 Nueva Partida Online</h1>
                <p className="home-subtitle">
                    {gameMode === 'casual' ? 'Modo Casual' : 'Modo Competitivo'}
                </p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                        value={hostPlayerName}
                        onChange={(e) => setHostPlayerName(e.target.value)}
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
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        Nombre de la Partida
                    </label>
                    <input
                        type="text"
                        value={matchName}
                        onChange={(e) => setMatchName(e.target.value)}
                        placeholder="Ej: Final del Torneo, Partido de Amigos..."
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
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontWeight: '600',
                        fontSize: '0.95rem'
                    }}>
                        Jugadores (uno por línea)
                    </label>
                    <textarea
                        value={playerNames}
                        onChange={(e) => setPlayerNames(e.target.value)}
                        placeholder="Santiago&#10;Mateo&#10;Lucas&#10;Diego"
                        rows="6"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'inherit',
                            fontSize: '1rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                        }}
                    />
                    <div style={{ 
                        marginTop: '8px', 
                        fontSize: '0.85rem', 
                        opacity: '0.7' 
                    }}>
                        💡 Tu nombre debe estar en la lista de jugadores
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
                    onClick={handleCreate}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: loading ? 'rgba(255,255,255,0.1)' : 'var(--secondary)',
                        color: loading ? 'inherit' : '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? '🌐 Creando sala...' : '🚀 Crear Partida Online'}
                </button>

                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    background: 'rgba(250, 112, 154, 0.1)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: '1.6'
                }}>
                    <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                        ℹ️ ¿Cómo funciona?
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        <li>Se generará un código único de sala</li>
                        <li>Comparte el código con los demás jugadores</li>
                        <li>Los jugadores podrán unirse con el código</li>
                        <li>Una vez todos conectados, ¡empiecen a jugar!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OnlineMatchCreator;
