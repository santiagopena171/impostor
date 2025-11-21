import { footballers } from '../data/footballers';

export const assignRoles = (playerNames, impostorCount) => {
    // Filtrar nombres vacíos
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 2) {
        throw new Error("Se necesitan al menos 2 jugadores.");
    }

    if (impostorCount >= players.length) {
        throw new Error("No puede haber más impostores que jugadores.");
    }

    // Crear array de índices
    const indices = players.map((_, index) => index);

    // Mezclar índices (Fisher-Yates shuffle)
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Seleccionar índices de impostores
    const impostorIndices = new Set(indices.slice(0, impostorCount));

    // Seleccionar un único futbolista para esta ronda
    const commonFootballer = footballers[Math.floor(Math.random() * footballers.length)];

    // Asignar roles
    return players.map((name, index) => {
        if (impostorIndices.has(index)) {
            return { name, role: 'IMPOSTOR', isImpostor: true };
        } else {
            // Asignar el futbolista común
            return { name, role: commonFootballer, isImpostor: false };
        }
    });
};
