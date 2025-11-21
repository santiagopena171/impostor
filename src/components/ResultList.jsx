import React, { useState } from 'react';

const ResultList = ({ results }) => {
    const [revealed, setRevealed] = useState(new Set());

    const toggleReveal = (index) => {
        const newRevealed = new Set(revealed);
        if (newRevealed.has(index)) {
            newRevealed.delete(index);
        } else {
            newRevealed.add(index);
        }
        setRevealed(newRevealed);
    };

    const revealAll = () => {
        if (revealed.size === results.length) {
            setRevealed(new Set());
        } else {
            setRevealed(new Set(results.map((_, i) => i)));
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>Resultados</h3>
                <button
                    onClick={revealAll}
                    style={{ width: 'auto', padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    {revealed.size === results.length ? 'Ocultar Todos' : 'Revelar Todos'}
                </button>
            </div>

            <ul className="player-list">
                {results.map((player, index) => (
                    <li
                        key={index}
                        className="player-item"
                        onClick={() => toggleReveal(index)}
                        style={{ cursor: 'pointer' }}
                    >
                        <span style={{ fontWeight: '600' }}>{player.name}</span>
                        <span className={`role-reveal ${revealed.has(index) && player.isImpostor ? 'impostor' : ''}`}>
                            {revealed.has(index) ? player.role : '???'}
                        </span>
                    </li>
                ))}
            </ul>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '16px' }}>
                Toca un nombre para revelar su identidad secretamente.
            </p>
        </div>
    );
};

export default ResultList;
