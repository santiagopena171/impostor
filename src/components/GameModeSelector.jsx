import React from 'react';

function GameModeSelector({ onSelectMode }) {
    return (
        <div className="card">
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Seleccionar Modo de Juego</h3>
            
            <button
                onClick={() => onSelectMode('casual')}
                style={{
                    marginBottom: '15px',
                    background: 'var(--primary)',
                    padding: '20px'
                }}
            >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎮</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Casual</div>
                <div style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                    Juega sin puntuación
                </div>
            </button>

            <button
                onClick={() => onSelectMode('competitive')}
                style={{
                    background: 'var(--secondary)',
                    color: '#0f172a',
                    padding: '20px'
                }}
            >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏆</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Competitivo</div>
                <div style={{ fontSize: '0.85rem', opacity: '0.8' }}>
                    Lleva el marcador y gana puntos
                </div>
            </button>
        </div>
    );
}

export default GameModeSelector;
