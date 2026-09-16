import { footballers } from '../data/footballers';
import torres from '../data/torres.json';
import { turnGuessPlayers } from '../data/turnGuessPlayers';
import { transfers } from '../data/transfers';
import { draftClubs } from '../data/draftClubs';

export const assignRoles = (playerNames, impostorCount, withHints = false) => {
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

    // Generar pista si está habilitado
    let hint = '';
    if (withHints) {
        // Generar pista mostrando algunas letras del nombre
        const nameLength = commonFootballer.length;
        const charsToReveal = Math.ceil(nameLength * 0.3); // Revelar 30% de las letras
        const positions = [];

        // Seleccionar posiciones aleatorias para revelar
        while (positions.length < charsToReveal) {
            const pos = Math.floor(Math.random() * nameLength);
            if (!positions.includes(pos)) {
                positions.push(pos);
            }
        }

        // Crear la pista con guiones bajos y letras reveladas
        hint = commonFootballer.split('').map((char, idx) => {
            if (positions.includes(idx)) {
                return char;
            } else if (char === ' ') {
                return ' ';
            } else {
                return '_';
            }
        }).join('');
    }

    // Asignar roles
    return players.map((name, index) => {
        if (impostorIndices.has(index)) {
            return {
                name,
                role: withHints ? hint : 'IMPOSTOR',
                isImpostor: true,
                hint: withHints ? hint : null
            };
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

// Función auxiliar para obtener puntos según dificultad
const getDifficultyPoints = (dificultad) => {
    if (!dificultad) return 0;
    if (dificultad.includes('FÁCIL')) return 1;
    if (dificultad.includes('MEDIA')) return 2;
    if (dificultad.includes('DIFÍCIL')) return 3;
    if (dificultad.includes('EXTREMO')) return 4;
    return 0;
};

export const assignUniqueTowers = (playerNames) => {
    // Filtrar nombres vacíos
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 1) {
        throw new Error("Se necesita al menos 1 jugador.");
    }

    if (players.length > torres.length) {
        throw new Error(`No hay suficientes torres para ${players.length} jugadores.`);
    }

    // Copiar y mezclar torres
    const availableTowers = [...torres];
    for (let i = availableTowers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableTowers[i], availableTowers[j]] = [availableTowers[j], availableTowers[i]];
    }

    // Asignar roles (descripciones de torres)
    return players.map((name, index) => {
        const tower = availableTowers[index];
        return {
            name,
            role: tower.descripcion,
            dificultad: tower.dificultad,
            points: getDifficultyPoints(tower.dificultad),
            isImpostor: false
        };
    });
};

// Costo en puntos de cada dato adicional del modo "Adivina por Turnos"
export const TURN_GUESS_STARTING_POINTS = 10;
export const TURN_GUESS_HINT_COSTS = {
    clubes: 5,
    posicion: 2,
    palmares: 3
};

// Arma una nueva ronda para el modo "Adivina por Turnos"
export const startTurnGuessRound = (playerNames, turnIndex) => {
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 2) {
        throw new Error("Se necesitan al menos 2 jugadores.");
    }

    const safeIndex = ((turnIndex % players.length) + players.length) % players.length;
    const guesser = players[safeIndex];
    const target = turnGuessPlayers[Math.floor(Math.random() * turnGuessPlayers.length)];

    return {
        guesser,
        turnIndex: safeIndex,
        target,
        pointsInPlay: TURN_GUESS_STARTING_POINTS,
        usedHints: { clubes: false, posicion: false, palmares: false }
    };
};

// Arma una nueva ronda para el modo "Adivina la Transferencia"
// usedIndices evita repetir transferencias ya salidas en la misma partida
export const startTransferGuessRound = (playerNames, turnIndex, usedIndices = []) => {
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 2) {
        throw new Error("Se necesitan al menos 2 jugadores.");
    }

    const safeIndex = ((turnIndex % players.length) + players.length) % players.length;
    const guesser = players[safeIndex];

    let availableIndices = transfers.map((_, i) => i).filter(i => !usedIndices.includes(i));
    // Si ya se usaron todas, reiniciar el pool para seguir jugando
    if (availableIndices.length === 0) {
        availableIndices = transfers.map((_, i) => i);
        usedIndices = [];
    }
    const transferIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const transfer = transfers[transferIndex];

    return {
        guesser,
        turnIndex: safeIndex,
        transfer,
        usedIndices: [...usedIndices, transferIndex]
    };
};

// ---------- Modo "Draft de Goles" ----------
// Cada jugador arma un equipo de 7 posiciones (1 portero, 2 defensas,
// 2 mediocampistas, 2 delanteros) restando los goles de cada futbolista
// elegido a un objetivo compartido. Gana quien quede más cerca de 0.
export const DRAFT_SLOTS = [
    { key: 'GK', label: 'Portero', count: 1 },
    { key: 'DEF', label: 'Defensa', count: 2 },
    { key: 'MID', label: 'Mediocampista', count: 2 },
    { key: 'FWD', label: 'Delantero', count: 2 }
];

export const DRAFT_TOTAL_SLOTS = DRAFT_SLOTS.reduce((sum, s) => sum + s.count, 0);

// Devuelve un objetivo de goles al azar, siempre mayor a 100 y hasta 600
export const getRandomDraftTarget = () => 101 + Math.floor(Math.random() * 500);

const emptyNeededPositions = () => {
    const needed = {};
    DRAFT_SLOTS.forEach(slot => { needed[slot.key] = slot.count; });
    return needed;
};

const playerId = (clubName, playerName) => `${clubName}|${playerName}`;

// Determina si un club todavía tiene, para cada jugador activo, al menos un
// futbolista disponible (no elegido) en alguna posición que ese jugador necesite
const clubHasOptionsForAll = (club, usedIds, players, order) => {
    return order.every(name => {
        const p = players[name];
        if (!p || p.finished) return true;
        return club.players.some(pl =>
            (p.neededPositions[pl.position] || 0) > 0 && !usedIds.has(playerId(club.name, pl.name))
        );
    });
};

// Arma el estado inicial de una partida de Draft
export const initDraftState = (playerNames) => {
    const names = playerNames.map(n => n.trim()).filter(n => n !== '');
    if (names.length < 2) {
        throw new Error('Se necesitan al menos 2 jugadores.');
    }

    const target = getRandomDraftTarget();
    const players = {};
    names.forEach(name => {
        players[name] = {
            remaining: target,
            neededPositions: emptyNeededPositions(),
            picks: [],
            finished: false
        };
    });

    const state = {
        target,
        players,
        order: [...names],
        usedIds: [],
        currentClub: null,
        pickIndex: 0,
        round: 1,
        finished: false
    };

    return startDraftRound(state);
};

// Sortea un nuevo club válido para iniciar la ronda (o marca la partida como terminada)
export const startDraftRound = (state) => {
    const usedIds = new Set(state.usedIds);
    const activeOrder = state.order.filter(name => !state.players[name].finished);

    if (activeOrder.length === 0) {
        return { ...state, finished: true, currentClub: null };
    }

    const validClubs = draftClubs.filter(club => clubHasOptionsForAll(club, usedIds, state.players, activeOrder));

    if (validClubs.length === 0) {
        // No quedan clubes con opciones válidas para todos: termina la partida
        return { ...state, finished: true, currentClub: null };
    }

    const club = validClubs[Math.floor(Math.random() * validClubs.length)];

    return {
        ...state,
        order: activeOrder,
        currentClub: club,
        pickIndex: 0
    };
};

// Devuelve los futbolistas elegibles del club actual para el jugador dado
export const getEligibleDraftPlayers = (state, playerName) => {
    if (!state.currentClub) return [];
    const usedIds = new Set(state.usedIds);
    const player = state.players[playerName];
    if (!player) return [];

    return state.currentClub.players.filter(pl =>
        (player.neededPositions[pl.position] || 0) > 0 && !usedIds.has(playerId(state.currentClub.name, pl.name))
    );
};

// Aplica la elección de un futbolista para el jugador que le toca el turno
export const makeDraftPick = (state, chosenPlayerName) => {
    if (state.finished || !state.currentClub) {
        throw new Error('No hay una ronda activa.');
    }

    const currentName = state.order[state.pickIndex];
    if (!currentName) {
        throw new Error('No se pudo determinar el turno actual.');
    }

    const eligible = getEligibleDraftPlayers(state, currentName);
    const chosen = eligible.find(pl => pl.name === chosenPlayerName);
    if (!chosen) {
        throw new Error('Ese futbolista no es una opción válida para este turno.');
    }

    const club = state.currentClub;
    const players = { ...state.players };
    const player = { ...players[currentName] };

    player.remaining = player.remaining - chosen.goals;
    player.neededPositions = { ...player.neededPositions, [chosen.position]: player.neededPositions[chosen.position] - 1 };
    // Firebase RTDB strips empty arrays on round-trip, so picks/usedIds may come back undefined
    player.picks = [...(player.picks || []), { name: chosen.name, position: chosen.position, goals: chosen.goals, club: club.name }];
    player.finished = Object.values(player.neededPositions).every(v => v === 0);
    players[currentName] = player;

    const usedIds = [...(state.usedIds || []), playerId(club.name, chosen.name)];
    const nextPickIndex = state.pickIndex + 1;

    let nextState = {
        ...state,
        players,
        usedIds,
        pickIndex: nextPickIndex
    };

    if (nextPickIndex >= state.order.length) {
        // Terminó la ronda: rota el orden (el primero pasa al final) y arranca la siguiente
        const rotatedOrder = [...state.order.slice(1), state.order[0]];
        nextState = {
            ...nextState,
            order: rotatedOrder,
            round: state.round + 1
        };
        nextState = startDraftRound(nextState);
    }

    return nextState;
};

// Determina el/los ganador/es: quien(es) quede(n) más cerca de 0 en valor absoluto
export const getDraftWinners = (state) => {
    const entries = Object.entries(state.players);
    if (entries.length === 0) return [];

    const minAbs = Math.min(...entries.map(([, p]) => Math.abs(p.remaining)));
    return entries.filter(([, p]) => Math.abs(p.remaining) === minAbs).map(([name]) => name);
};
