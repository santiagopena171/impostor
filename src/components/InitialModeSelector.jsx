import React, { useEffect } from 'react';
import admobService from '../services/admobService';

function InitialModeSelector({ onSelectMode, onLogout, username }) {
    useEffect(() => {
        admobService.showBanner();
    }, []);

    return (
        <div className="app-container">
            {username && onLogout && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px'
                }}>
                    <span style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-dim)'
                    }}>
                        👤 {username}
                    </span>
                    <button
                        onClick={onLogout}
                        style={{
                            padding: '8px 16px',
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            color: 'white',
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}

            <div className="home-header">
                <h1 className="home-title">Impostor Futbolero</h1>
                <p className="home-subtitle">¿Cómo querés jugar?</p>
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
                    onClick={() => onSelectMode('casual')}
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
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎮</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Modo Casual
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Juega sin puntuación ni marcador.<br />Perfecto para pasarla bien.
                    </div>
                </button>

                <button
                    onClick={() => onSelectMode('competitive')}
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
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🏆</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                        Modo Competitivo
                    </div>
                    <div style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.5' }}>
                        Crea una partida con marcador.<br />Lleva la cuenta de puntos y corona al campeón.
                    </div>
                </button>
            </div>
        </div>
    );
}

export default InitialModeSelector;
