import React from 'react';

function Scoreboard({ scores, roundNumber }) {
    // Ordenar jugadores por puntuación (mayor a menor)
    const sortedScores = Object.entries(scores)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
                🏆 Marcador - Ronda {roundNumber}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sortedScores.map((player, index) => (
                    <div
                        key={player.name}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '12px 16px',
                            background: index === 0 
                                ? 'rgba(251, 191, 36, 0.15)' 
                                : 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '8px',
                            border: index === 0 
                                ? '2px solid rgba(251, 191, 36, 0.5)' 
                                : '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '600',
                                minWidth: '30px'
                            }}>
                                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                            </span>
                            <span style={{ fontWeight: '600' }}>{player.name}</span>
                        </div>
                        <span style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: '700',
                            color: index === 0 ? '#fbbf24' : 'inherit'
                        }}>
                            {player.score} pts
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Scoreboard;
