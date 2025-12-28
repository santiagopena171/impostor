import React from 'react';

const GameConfig = ({ impostorCount, setImpostorCount, maxImpostors }) => {
    return (
        <div className="card">
            <label htmlFor="impostor-count">Cantidad de Impostores</label>
            <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2].map(num => (
                    <button
                        key={num}
                        type="button"
                        onClick={() => setImpostorCount(num)}
                        style={{
                            background: impostorCount === num ? 'var(--gradient-main)' : 'rgba(255,255,255,0.1)',
                            opacity: impostorCount === num ? 1 : 0.7,
                            flex: 1,
                            padding: '12px'
                        }}
                        disabled={num > maxImpostors}
                    >
                        {num} {num === 1 ? 'Impostor' : 'Impostores'}
                    </button>
                ))}
            </div>
            {maxImpostors < 2 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '8px' }}>
                    Necesitas al menos 3 jugadores para tener 2 impostores.
                </p>
            )}
        </div>
    );
};

export default GameConfig;
