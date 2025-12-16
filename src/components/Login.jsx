import React, { useState } from 'react';

function Login({ onLogin, onRegister, onSkip }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!username || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        if (isRegistering) {
            await onRegister(username, password, setError);
        } else {
            await onLogin(username, password, setError);
        }

        setLoading(false);
    };

    return (
        <div className="app-container">
            <div className="home-header">
                <h1 className="home-title">
                    {isRegistering ? '📝 Crear Cuenta' : '🔐 Iniciar Sesión'}
                </h1>
                <p className="home-subtitle">
                    {isRegistering 
                        ? 'Crea una cuenta para guardar tus partidas' 
                        : 'Inicia sesión para acceder a tus partidas guardadas'}
                </p>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto', marginTop: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        Nombre de Usuario
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Tu nombre de usuario"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                {error && (
                    <div style={{
                        color: '#ff4d4d',
                        background: 'rgba(255, 77, 77, 0.1)',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: loading ? '#555' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {loading ? 'Procesando...' : (isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión')}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError('');
                    }}
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        marginBottom: '15px'
                    }}
                >
                    {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
                </button>

                {onSkip && (
                    <button
                        type="button"
                        onClick={onSkip}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            fontSize: '0.85rem',
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Continuar sin cuenta (solo offline)
                    </button>
                )}
            </form>
        </div>
    );
}

export default Login;
