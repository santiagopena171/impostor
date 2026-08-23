import React from 'react';

function MatchSelector({ matches, onSelectMatch, onNewMatch, onDeleteMatch, onBack, isOnlineMode }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTopPlayer = (scores) => {
        if (!scores || Object.keys(scores).length === 0) return null;
        const entries = Object.entries(scores);
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0];
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
                <h1 className="home-title">
                    {isOnlineMode ? '🌐 Partidas Online' : '📱 Partidas Guardadas'}
                </h1>
                <p className="home-subtitle">Selecciona una partida o crea una nueva</p>
            </div>

            {matches.length === 0 && (
                <div style={{
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                        No hay partidas guardadas
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        {isOnlineMode 
                            ? 'Crea una nueva partida online o únete a una existente'
                            : 'Crea una nueva partida para comenzar'}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
                {matches.map((match) => {
                    const topPlayer = getTopPlayer(match.scores);
                    return (
                        <div
                            key={match.id}
                            className="card"
                            style={{
                                padding: '20px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                position: 'relative'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteMatch(match.id, match.networkMode === 'online');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'rgba(255, 77, 77, 0.2)',
                                    border: '1px solid rgba(255, 77, 77, 0.5)',
                                    color: '#ff4d4d',
                                    padding: '6px 12px',
                                    fontSize: '0.85rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                🗑️ Eliminar
                            </button>

                            <div onClick={() => onSelectMatch(match)}>
                                <h3 style={{ marginBottom: '8px', paddingRight: '100px' }}>
                                    {match.networkMode === 'online' ? '🌐' : '📱'} {match.matchData.name}
                                </h3>
                                
                                {match.networkMode === 'online' && match.onlineRoomCode && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '12px',
                                        padding: '10px',
                                        background: 'rgba(79, 172, 254, 0.1)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(79, 172, 254, 0.3)'
                                    }}>
                                        <span style={{ fontSize: '0.9rem', color: '#4facfe' }}>
                                            🔑 Código de Sala:
                                        </span>
                                        <span style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            fontFamily: 'monospace',
                                            letterSpacing: '2px',
                                            color: '#fff'
                                        }}>
                                            {match.onlineRoomCode}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigator.clipboard.writeText(match.onlineRoomCode);
                                                const btn = e.target;
                                                const originalText = btn.textContent;
                                                btn.textContent = '✔️ Copiado';
                                                setTimeout(() => btn.textContent = originalText, 1500);
                                            }}
                                            style={{
                                                padding: '4px 12px',
                                                background: 'rgba(79, 172, 254, 0.2)',
                                                border: '1px solid rgba(79, 172, 254, 0.5)',
                                                color: '#4facfe',
                                                fontSize: '0.8rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginLeft: 'auto'
                                            }}
                                        >
                                            📋 Copiar
                                        </button>
                                    </div>
                                )}
                                
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '12px' }}>
                                    📅 Última actualización: {formatDate(match.updatedAt || match.matchData.createdAt)}
                                </p>

                                {match.currentGame && (
                                    <p style={{ 
                                        fontSize: '0.9rem', 
                                        color: '#4facfe',
                                        marginBottom: '10px',
                                        fontWeight: '600'
                                    }}>
                                        🎮 En progreso: {
                                            match.currentGame === 'impostor' ? 'Impostor Futbolero' :
                                            match.currentGame === 'guess-player' ? 'Adivina mi Jugador' :
                                            match.currentGame === 'torres' ? 'Torres Futboleras' :
                                            match.currentGame === 'turn-guess' ? 'Adivina por Turnos' : match.currentGame
                                        }
                                    </p>
                                )}

                                <div style={{ marginBottom: '12px' }}>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '6px' }}>
                                        👥 {match.matchData.players.length} jugadores
                                    </p>
                                    {topPlayer && (
                                        <p style={{ fontSize: '0.9rem', color: '#fbbf24' }}>
                                            🥇 Líder: <strong>{topPlayer[0]}</strong> ({topPlayer[1]} pts)
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {match.matchData.players.slice(0, 4).map((player, index) => (
                                        <span
                                            key={index}
                                            style={{
                                                padding: '4px 10px',
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                borderRadius: '4px',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            {player}
                                        </span>
                                    ))}
                                    {match.matchData.players.length > 4 && (
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                                            +{match.matchData.players.length - 4} más
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button
                onClick={onNewMatch}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: 'var(--secondary)',
                    color: '#0f172a',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '10px'
                }}
            >
                + Crear Nueva Partida
            </button>

            {matches.length > 0 && (
                <button
                    onClick={() => {
                        // Jugar sin cargar partida (modo casual sin guardar)
                        onSelectMatch({ 
                            id: null, 
                            matchData: null, 
                            scores: {}, 
                            gameMode: 'casual',
                            currentGame: null 
                        });
                    }}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600'
                    }}
                >
                    🎮 Jugar sin Guardar
                </button>
            )}
        </div>
    );
}

export default MatchSelector;
