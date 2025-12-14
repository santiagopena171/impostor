import React, { useState } from 'react';

function MatchCreator({ onCreateMatch, onBack }) {
    const [matchName, setMatchName] = useState('');
    const [playerNames, setPlayerNames] = useState('');

    const handleCreate = () => {
        const players = playerNames
            .split('\n')
            .map(name => name.trim())
            .filter(name => name !== '');

        if (!matchName.trim()) {
            alert('Por favor, ingresa un nombre para la partida');
            return;
        }

        if (players.length < 2) {
            alert('Se necesitan al menos 2 jugadores para una partida competitiva');
            return;
        }

        onCreateMatch({
            name: matchName.trim(),
            players: players,
            createdAt: new Date().toISOString()
        });
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

            <div className="home-header">
                <h1 className="home-title">🏆 Nueva Partida Competitiva</h1>
                <p className="home-subtitle">Configura tu partida con marcador</p>
            </div>

            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
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
                    <p style={{ 
                        fontSize: '0.85rem', 
                        color: 'var(--text-dim)', 
                        marginTop: '8px' 
                    }}>
                        Los puntajes se guardarán para estos jugadores durante toda la partida
                    </p>
                </div>

                <button
                    onClick={handleCreate}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'var(--secondary)',
                        color: '#0f172a',
                        fontSize: '1.1rem',
                        fontWeight: '700'
                    }}
                >
                    Crear Partida
                </button>
            </div>
        </div>
    );
}

export default MatchCreator;
