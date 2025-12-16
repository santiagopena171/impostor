import React from 'react';

function OnlineActionSelector({ onSelectAction, onBack, hasSavedMatches }) {
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
                <h1 className="home-title">🌐 Modo Online</h1>
                <p className="home-subtitle">¿Qué querés hacer?</p>
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
                    onClick={() => onSelectAction('create')}
                    style={{
                        padding: '30px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Crear Partida
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Crea una nueva sala y obtén un código.<br />
                        Compártelo con tus amigos para que se unan.
                    </div>
                </button>

                <button
                    onClick={() => onSelectAction('join')}
                    style={{
                        padding: '30px',
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔗</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Unirse a Partida
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        ¿Tienes un código de sala?<br />
                        Únete a una partida creada por un amigo.
                    </div>
                </button>

                <button
                    onClick={() => onSelectAction('load')}
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
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💾</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Cargar Partida
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Continúa una partida guardada.<br />
                        Reconecta a una sala online o juega offline.
                    </div>
                </button>
            </div>
        </div>
    );
}

export default OnlineActionSelector;
