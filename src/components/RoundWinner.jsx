import React from 'react';

function RoundWinner({ winner, onContinue }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'fadeIn 0.3s ease-in'
            }}
            onClick={onContinue}
        >
            <div
                className="card"
                style={{
                    maxWidth: '400px',
                    textAlign: 'center',
                    padding: '40px',
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                    border: '2px solid rgba(251, 191, 36, 0.5)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                    🏆
                </div>
                
                {winner.tied ? (
                    <>
                        <h2 style={{ marginBottom: '15px', color: '#fbbf24' }}>
                            ¡Empate!
                        </h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
                            {winner.names.join(', ')}
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
                            {winner.points} puntos
                        </p>
                    </>
                ) : (
                    <>
                        <h2 style={{ marginBottom: '15px', color: '#fbbf24' }}>
                            ¡Ganador de la Ronda!
                        </h2>
                        <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px' }}>
                            {winner.name}
                        </p>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#fbbf24' }}>
                            +{winner.points} puntos
                        </p>
                    </>
                )}

                <button
                    onClick={onContinue}
                    style={{
                        marginTop: '30px',
                        background: 'var(--secondary)',
                        color: '#0f172a'
                    }}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
}

export default RoundWinner;
