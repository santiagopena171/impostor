import React from 'react';
import GameCard from './GameCard';
import Scoreboard from './Scoreboard';

function Home({ onSelectGame, gameMode, matchData, globalScores, onBackToModeSelector }) {
    const games = [
        {
            id: 'impostor',
            title: 'Impostor Futbolero',
            description: 'Descubre quién es el impostor entre los futbolistas famosos',
            icon: '⚽',
            gradient: 'linear-gradient(135deg, #ff0055 0%, #00e5ff 100%)',
            competitiveEnabled: false
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
                <h1 className="home-title">Footy Games</h1>
                <p className="home-subtitle">
                    {gameMode === 'competitive' && matchData ? (
                        <>🏆 {matchData.name}</>
                    ) : (
                        <>Seleccioná un juego para comenzar</>
                    )}
                </p>
            </div>

            {gameMode === 'competitive' && matchData && globalScores && Object.keys(globalScores).length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                    <Scoreboard scores={globalScores} roundNumber={0} />
                </div>
            )}

            <div className="games-grid">
                {games.map(game => {
                    const isDisabled = gameMode === 'competitive' && !game.competitiveEnabled;
                    return (
                        <GameCard
                            key={game.id}
                            title={game.title}
                            description={isDisabled ? 'No disponible en modo competitivo' : game.description}
                            icon={game.icon}
                            gradient={isDisabled ? 'linear-gradient(135deg, #555 0%, #333 100%)' : game.gradient}
                            onClick={() => !isDisabled && onSelectGame(game.id)}
                            style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                        />
                    );
                })}
            </div>

            {onBackToModeSelector && (
                <button
                    onClick={onBackToModeSelector}
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
