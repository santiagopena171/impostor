import React from 'react';

const PlayerInput = ({ value, onChange }) => {
    return (
        <div className="card">
            <label htmlFor="players">Lista de Jugadores (uno por línea)</label>
            <textarea
                id="players"
                rows="8"
                placeholder="Juan&#10;Pedro&#10;María&#10;Sofía"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                Total: {value.split('\n').filter(line => line.trim() !== '').length} jugadores
            </div>
        </div>
    );
};

export default PlayerInput;
