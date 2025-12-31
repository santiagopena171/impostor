import React from 'react';
import GameCard from './GameCard';
import Scoreboard from './Scoreboard';
import admobService from '../services/admobService';
import { useEffect } from 'react';

function Home({ onSelectGame, gameMode, matchData, globalScores, onBackToModeSelector, onSaveGame, isOnline, isHost, onlineRoomCode }) {
    useEffect(() => {
        // Mostrar banner al entrar a Home
        admobService.showBanner();

        // Ocultar banner al salir de Home (opcional, depende de si quieres que siga visible)
        // return () => admobService.hideBanner();
    }, []);

    const games = [
        {
            id: 'impostor',
            title: 'Impostor Futbolero',
            description: 'Descubre quién es el impostor entre los futbolistas famosos',
            icon: '⚽',
            gradient: 'linear-gradient(135deg, #ff0055 0%, #00e5ff 100%)',
            competitiveEnabled: matchData?.players?.length >= 3
        },
        {
            id: 'guess-player',
            title: 'Adivina mi Jugador',
            description: 'Cada uno recibe un futbolista distinto. ¡Adivina quién es quién!',
            icon: '🕵️',
            gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
            competitiveEnabled: true
        },
        {
            id: 'torres',
            title: 'Torres Futboleras',
            description: 'Cada jugador recibe una torre (descripción) distinta.',
            icon: '🏗️',
            gradient: 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)',
            competitiveEnabled: true
        }
    ];

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">Impostor Futbolero</h1>
                <p className="home-subtitle">
                    {gameMode === 'competitive' && matchData ? (
                        <>🏆 {matchData.name}</>
                    ) : (
                        <>Seleccioná un juego para comenzar</>
                    )}
                </p>
            </div>

            {isOnline && onlineRoomCode && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '20px',
                    padding: '12px 20px',
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(79, 172, 254, 0.3)',
                    maxWidth: '400px',
                    margin: '0 auto 20px'
                }}>
                    <span style={{ fontSize: '1rem', color: '#4facfe' }}>
                        🔑 Código de Sala:
                    </span>
                    <span style={{
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        letterSpacing: '3px',
                        color: '#fff'
                    }}>
                        {onlineRoomCode}
                    </span>
                    <button
                        onClick={(e) => {
                            navigator.clipboard.writeText(onlineRoomCode);
                            const btn = e.target;
                            const originalText = btn.textContent;
                            btn.textContent = '✔️ Copiado';
                            setTimeout(() => btn.textContent = originalText, 1500);
                        }}
                        style={{
                            padding: '6px 14px',
                            background: 'rgba(79, 172, 254, 0.2)',
                            border: '1px solid rgba(79, 172, 254, 0.5)',
                            color: '#4facfe',
                            fontSize: '0.85rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        📋 Copiar
                    </button>
                </div>
            )}

            {gameMode === 'competitive' && matchData && globalScores && Object.keys(globalScores).length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <Scoreboard scores={globalScores} roundNumber={0} />
                </div>
            )}

            {/* Mensaje para jugadores no host en modo online */}
            {isOnline && !isHost && (
                <div style={{
                    padding: '20px',
                    background: 'rgba(79, 172, 254, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    border: '1px solid rgba(79, 172, 254, 0.3)'
                }}>
                    <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                        Esperando al anfitrión
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                        El anfitrión seleccionará el juego para todos
                    </div>
                </div>
            )}

            <div className="games-grid">
                {games.map(game => {
                    const isDisabled = gameMode === 'competitive' && !game.competitiveEnabled;
                    const cannotSelect = isOnline && !isHost; // En modo online, solo el host puede seleccionar
                    const finalDisabled = isDisabled || cannotSelect;

                    return (
                        <GameCard
                            key={game.id}
                            title={game.title}
                            description={
                                isDisabled
                                    ? (game.id === 'impostor' && matchData?.players?.length < 3
                                        ? 'Se necesitan al menos 3 jugadores'
                                        : 'No disponible en modo competitivo')
                                    : cannotSelect
                                        ? 'Solo el anfitrión puede seleccionar'
                                        : game.description
                            }
                            icon={game.icon}
                            gradient={finalDisabled ? 'linear-gradient(135deg, #555 0%, #333 100%)' : game.gradient}
                            onClick={() => !finalDisabled && onSelectGame(game.id)}
                            style={{ opacity: finalDisabled ? 0.5 : 1, cursor: finalDisabled ? 'not-allowed' : 'pointer' }}
                        />
                    );
                })}
            </div>

            {gameMode === 'competitive' && onSaveGame && matchData && (
                <button
                    onClick={() => {
                        console.log('💾 SAVE BUTTON CLICKED:', { isOnline, onlineRoomCode });
                        onSaveGame();
                    }}
                    style={{
                        marginTop: '20px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        fontSize: '1rem',
                        padding: '14px 28px',
                        fontWeight: '600',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    }}
                >
                    💾 Guardar Partida {isOnline && onlineRoomCode && `(${onlineRoomCode})`}
                </button>
            )}

            {onBackToModeSelector && (
                <button
                    onClick={() => {
                        // Mostrar anuncio intersticial al volver al menú principal
                        admobService.showInterstitial();
                        onBackToModeSelector();
                    }}
                    style={{
                        marginTop: '30px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '0.9rem',
                        padding: '12px 24px'
                    }}
                >
                    ← Volver al Inicio
                </button>
            )}
        </div>
    );
}

export default Home;
