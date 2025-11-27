import React from 'react';
import GameCard from './GameCard';

function Home({ onSelectGame }) {
    const games = [
        {
            id: 'impostor',
            title: 'Impostor Futbolero',
            description: 'Descubre quién es el impostor entre los futbolistas famosos',
            icon: '⚽',
            gradient: 'linear-gradient(135deg, #ff0055 0%, #00e5ff 100%)'
        },
        {
            id: 'guess-player',
            title: 'Adivina mi Jugador',
            description: 'Cada uno recibe un futbolista distinto. ¡Adivina quién es quién!',
            icon: '🕵️',
            gradient: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'
        }
    ];

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">Footy Games</h1>
                <p className="home-subtitle">Seleccioná un juego para comenzar</p>
            </div>

            <div className="games-grid">
                {games.map(game => (
                    <GameCard
                        key={game.id}
                        title={game.title}
                        description={game.description}
                        icon={game.icon}
                        gradient={game.gradient}
                        onClick={() => onSelectGame(game.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;
