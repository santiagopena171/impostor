import React from 'react';

function LoadMatch({ matchData, onContinue, onNewMatch }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="app-container">
            <div className="home-header">
                <h1 className="home-title">Footy Games</h1>
                <p className="home-subtitle">Hay una partida en curso</p>
            </div>

            <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏆</div>
                    <h2 style={{ marginBottom: '8px' }}>{matchData.name}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        Creada: {formatDate(matchData.createdAt)}
                    </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '0.95rem' }}>Jugadores:</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {matchData.players.map((player, index) => (
                            <span
                                key={index}
                                style={{
                                    padding: '6px 12px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {player}
                            </span>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button
                        onClick={onContinue}
                        style={{
                            padding: '16px',
                            background: 'var(--secondary)',
                            color: '#0f172a',
                            fontSize: '1.1rem',
                            fontWeight: '700'
                        }}
                    >
                        Continuar Partida
                    </button>

                    <button
                        onClick={onNewMatch}
                        style={{
                            padding: '16px',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            fontSize: '1rem'
                        }}
                    >
                        Empezar Nueva Partida
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoadMatch;
