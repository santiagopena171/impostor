import { categoriesData } from './categories';

export const assignRolesMultiCategory = (playerNames, impostorCount, selectedCategory) => {
    // Filtrar nombres vacíos
    const players = playerNames.filter(name => name.trim() !== '');

    if (players.length < 2) {
        throw new Error("Se necesitan al menos 2 jugadores.");
    }

    if (impostorCount >= players.length) {
        throw new Error("No puede haber más impostores que jugadores.");
    }

    if (!selectedCategory || !categoriesData[selectedCategory]) {
        throw new Error("Categoría no válida.");
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

    // Seleccionar un único item de la categoría para esta ronda
    const categoryItems = categoriesData[selectedCategory];
    const commonItem = categoryItems[Math.floor(Math.random() * categoryItems.length)];

    // Asignar roles SIN pistas
    return players.map((name, index) => {
        if (impostorIndices.has(index)) {
            return {
                name,
                role: 'IMPOSTOR',
                isImpostor: true,
                category: selectedCategory
            };
        } else {
            // Asignar el item común
            return { 
                name, 
                role: commonItem, 
                isImpostor: false, 
                category: selectedCategory 
            };
        }
    });
};

export const getCategories = () => {
    return Object.keys(categoriesData);
};

export const getCategoryItems = (category) => {
    return categoriesData[category] || [];
};
