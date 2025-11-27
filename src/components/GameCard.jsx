import React from 'react';

function GameCard({ title, description, icon, gradient, onClick }) {
    return (
        <div
            className="game-card"
            onClick={onClick}
            style={{
                background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            <div className="game-card-icon">{icon}</div>
            <h2 className="game-card-title">{title}</h2>
            <p className="game-card-description">{description}</p>
            <div className="game-card-play">
                Jugar →
            </div>
        </div>
    );
}

export default GameCard;
