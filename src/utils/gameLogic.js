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

export const assignUniquePlayers = (playerNames) => {
    // Filtrar nombres vacíos
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 1) {
        throw new Error("Se necesita al menos 1 jugador.");
    }

    if (players.length > footballers.length) {
        throw new Error(`No hay suficientes futbolistas en la base de datos para ${players.length} jugadores.`);
    }

    // Copiar y mezclar futbolistas
    const availableFootballers = [...footballers];
    for (let i = availableFootballers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableFootballers[i], availableFootballers[j]] = [availableFootballers[j], availableFootballers[i]];
    }

    // Asignar roles
    return players.map((name, index) => {
        return { name, role: availableFootballers[index], isImpostor: false };
    });
};
