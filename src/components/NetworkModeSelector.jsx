import React from 'react';

function NetworkModeSelector({ onSelectNetwork, onBack }) {
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
                <h1 className="home-title">¿Cómo querés jugar?</h1>
                <p className="home-subtitle">Elige tu modo de conexión</p>
            </div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px',
                maxWidth: '500px',
                margin: '0 auto',
                marginTop: '40px'
            }}>
                <button
                    onClick={() => onSelectNetwork('offline')}
                    style={{
                        padding: '30px',
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📱</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Offline
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Juega localmente en este dispositivo.<br />
                        No requiere conexión a internet.
                    </div>
                </button>

                <button
                    onClick={() => onSelectNetwork('online')}
                    style={{
                        padding: '30px',
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌐</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Online
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Crea o únete a partidas online.<br />
                        Juega con amigos desde cualquier lugar.
                    </div>
                </button>
            </div>
        </div>
    );
}

export default NetworkModeSelector;
