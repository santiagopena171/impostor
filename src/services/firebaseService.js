// Servicio para conexión online usando Firebase Realtime Database
// Este servicio permite crear y unirse a partidas online en tiempo real

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, get, update, remove } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

class FirebaseService {
    constructor() {
        this.db = null;
        this.app = null;
        this.auth = null;
        this.currentRoomRef = null;
        this.listeners = {};
        this.initialized = false;
        this.currentUser = null;
        
        // Configuración de Firebase
        this.config = {
            apiKey: "AIzaSyDIPmSV864LvfHBHGKDv-oSIYxPJllkrNM",
            authDomain: "impostor-b32b5.firebaseapp.com",
            databaseURL: "https://impostor-b32b5-default-rtdb.firebaseio.com",
            projectId: "impostor-b32b5",
            storageBucket: "impostor-b32b5.firebasestorage.app",
            messagingSenderId: "806319299804",
            appId: "1:806319299804:web:0fc2812fa28da280a9e819"
        };
    }

    // Inicializar Firebase
    initialize() {
        if (this.initialized) return;
        
        try {
            this.app = initializeApp(this.config);
            this.db = getDatabase(this.app);
            this.auth = getAuth(this.app);
            this.initialized = true;
            console.log('Firebase initialized successfully');
        } catch (error) {
            console.error('Error initializing Firebase:', error);
            throw error;
        }
    }

    // Registrar nuevo usuario
    async registerUser(username, password) {
        this.initialize();
        
        try {
            const email = `${username.toLowerCase()}@footygames.app`;
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.currentUser = userCredential.user;
            
            const userRef = ref(this.db, `users/${userCredential.user.uid}`);
            await set(userRef, {
                username: username,
                createdAt: Date.now()
            });
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Error registering user:', error);
            if (error.code === 'auth/email-already-in-use') {
                return { success: false, error: 'El nombre de usuario ya está en uso' };
            }
            return { success: false, error: error.message };
        }
    }

    // Iniciar sesión
    async loginUser(username, password) {
        this.initialize();
        
        try {
            const email = `${username.toLowerCase()}@footygames.app`;
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            this.currentUser = userCredential.user;
            
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Error logging in:', error);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                return { success: false, error: 'Usuario o contraseña incorrectos' };
            }
            return { success: false, error: error.message };
        }
    }

    // Cerrar sesión
    async logoutUser() {
        this.initialize();
        
        try {
            await signOut(this.auth);
            this.currentUser = null;
            return { success: true };
        } catch (error) {
            console.error('Error logging out:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener usuario actual
    getCurrentUser() {
        this.initialize();
        return this.auth.currentUser;
    }

    // Escuchar cambios de autenticación
    onAuthChange(callback) {
        this.initialize();
        return onAuthStateChanged(this.auth, (user) => {
            this.currentUser = user;
            callback(user);
        });
    }

    // Generar código de sala único
    generateRoomCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Crear una nueva sala online
    async createRoom(matchData, hostPlayerName) {
        try {
            this.initialize();
            
            const roomCode = this.generateRoomCode();
            const roomRef = ref(this.db, `rooms/${roomCode}`);
            
            const roomData = {
                code: roomCode,
                host: hostPlayerName,
                createdBy: this.auth.currentUser?.uid || null,
                matchData: matchData,
                players: {
                    [hostPlayerName]: {
                        name: hostPlayerName,
                        uid: this.auth.currentUser?.uid || null,
                        connected: true,
                        joinedAt: Date.now()
                    }
                },
                scores: {},
                currentGame: null,
                gameState: null,
                status: 'waiting', // waiting, playing, finished
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            // Inicializar scores para todos los jugadores
            matchData.players.forEach(player => {
                roomData.scores[player] = 0;
            });

            await set(roomRef, roomData);
            this.currentRoomRef = roomRef;
            
            console.log('Room created successfully:', roomCode);
            
            return {
                roomCode,
                roomData
            };
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    // Unirse a una sala existente
    async joinRoom(roomCode, playerName) {
        try {
            this.initialize();
            
            const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
            const snapshot = await get(roomRef);
            
            if (!snapshot.exists()) {
                throw new Error('La sala no existe');
            }

            const roomData = snapshot.val();
            
            // Verificar que el jugador esté en la lista
            if (!roomData.matchData.players.includes(playerName)) {
                throw new Error('Tu nombre no está en la lista de jugadores de esta partida');
            }

            // Agregar jugador conectado
            const playerRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/players/${playerName}`);
            await set(playerRef, {
                name: playerName,
                uid: this.auth.currentUser?.uid || null,
                connected: true,
                joinedAt: Date.now()
            });

            this.currentRoomRef = roomRef;
            
            console.log('Joined room successfully:', roomCode);
            
            return roomData;
        } catch (error) {
            console.error('Error joining room:', error);
            throw error;
        }
    }

    // Escuchar cambios en la sala
    onRoomUpdate(roomCode, callback) {
        try {
            if (!this.db) {
                this.initialize();
            }
            
            const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
            
            const unsubscribe = onValue(roomRef, (snapshot) => {
                if (snapshot.exists()) {
                    callback(snapshot.val());
                }
            });

            this.listeners[roomCode] = unsubscribe;
            return unsubscribe;
        } catch (error) {
            console.error('Error setting up room listener:', error);
            throw error;
        }
    }

    // Actualizar estado del juego
    async updateGameState(roomCode, gameState) {
        this.initialize();
        
        const stateRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/gameState`);
        await set(stateRef, gameState);
        
        // Actualizar timestamp
        const updateRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/updatedAt`);
        await set(updateRef, Date.now());
    }

    // Actualizar scores
    async updateScores(roomCode, scores) {
        this.initialize();
        
        const scoresRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/scores`);
        await set(scoresRef, scores);
        
        // Actualizar timestamp
        const updateRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/updatedAt`);
        await set(updateRef, Date.now());
    }

    // Seleccionar juego actual
    async selectGame(roomCode, gameId) {
        this.initialize();
        
        const updates = {};
        updates[`rooms/${roomCode.toUpperCase()}/currentGame`] = gameId;
        updates[`rooms/${roomCode.toUpperCase()}/status`] = 'playing';
        updates[`rooms/${roomCode.toUpperCase()}/updatedAt`] = Date.now();
        
        const dbRef = ref(this.db);
        await update(dbRef, updates);
    }

    // Marcar jugador como desconectado
    async disconnectPlayer(roomCode, playerName) {
        if (!this.db) return;
        
        const playerRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/players/${playerName}/connected`);
        await set(playerRef, false);
    }

    // Eliminar sala
    async deleteRoom(roomCode) {
        if (!this.db) return;
        
        const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
        await remove(roomRef);
    }

    // Limpiar listeners
    cleanup(roomCode) {
        if (this.listeners[roomCode]) {
            // Llamar directamente la función unsubscribe
            this.listeners[roomCode]();
            delete this.listeners[roomCode];
        }
    }

    // Verificar si una sala existe
    async roomExists(roomCode) {
        this.initialize();
        
        const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
        const snapshot = await get(roomRef);
        
        return snapshot.exists();
    }

    // Obtener datos de una sala
    async getRoomData(roomCode) {
        this.initialize();
        
        console.log('🔍 Getting room data for:', roomCode.toUpperCase());
        
        const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
        const snapshot = await get(roomRef);
        
        if (snapshot.exists()) {
            const roomData = snapshot.val();
            console.log('📦 Room found:', {
                code: roomCode.toUpperCase(),
                host: roomData.host,
                players: Object.keys(roomData.players || {}),
                status: roomData.status
            });
            return roomData;
        }
        
        console.log('❌ Room not found:', roomCode.toUpperCase());
        return null;
    }

    // Actualizar estado de conexión de un jugador
    async updatePlayerConnection(roomCode, playerName, isConnected) {
        this.initialize();
        
        const playerRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/players/${playerName}/connected`);
        await set(playerRef, isConnected);
        
        // Actualizar timestamp
        const updateRef = ref(this.db, `rooms/${roomCode.toUpperCase()}/updatedAt`);
        await set(updateRef, Date.now());
    }

    // Recrear una sala (cuando el host carga partida y la sala no existe)
    async recreateRoom(roomCode, matchData, hostPlayerName, scores) {
        this.initialize();
        
        console.log('🏗️ Recreating room:', {
            roomCode,
            hostPlayerName,
            matchDataPlayers: matchData.players
        });
        
        const roomRef = ref(this.db, `rooms/${roomCode.toUpperCase()}`);
        
        // Determinar quién es el host original de matchData
        const originalHost = matchData.players && matchData.players[0] ? matchData.players[0] : hostPlayerName;
        
        console.log('👑 Original host determined:', originalHost);
        
        const roomData = {
            code: roomCode.toUpperCase(),
            host: originalHost,  // Usar el host original, no el que está cargando
            createdBy: this.auth.currentUser?.uid || null,
            matchData: matchData,
            players: {
                [hostPlayerName]: {
                    name: hostPlayerName,
                    uid: this.auth.currentUser?.uid || null,
                    connected: true,
                    joinedAt: Date.now()
                }
            },
            scores: scores,
            currentGame: null,
            gameState: null,
            status: 'waiting',
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        await set(roomRef, roomData);
        this.currentRoomRef = roomRef;
        
        console.log('✅ Room recreated successfully:', {
            host: originalHost,
            reconnectingPlayer: hostPlayerName,
            isReconnectingPlayerTheHost: originalHost === hostPlayerName
        });
    }

    // Actualizar datos de una sala existente (cuando el host carga partida)
    async updateRoomData(roomCode, matchData, scores) {
        this.initialize();
        
        const updates = {};
        updates[`rooms/${roomCode.toUpperCase()}/matchData`] = matchData;
        updates[`rooms/${roomCode.toUpperCase()}/scores`] = scores;
        updates[`rooms/${roomCode.toUpperCase()}/updatedAt`] = Date.now();
        
        const dbRef = ref(this.db);
        await update(dbRef, updates);
        
        console.log('Room data updated:', roomCode);
    }

    // Guardar partida online en Firebase (asociada al usuario autenticado)
    async saveOnlineMatch(matchData) {
        this.initialize();
        
        if (!this.currentUser) {
            throw new Error('Debes iniciar sesión para guardar partidas');
        }
        
        const matchId = matchData.id || `match_${Date.now()}`;
        const matchRef = ref(this.db, `savedMatches/${matchId}`);
        
        // Obtener UIDs de todos los jugadores de la sala
        let playerUids = [this.currentUser.uid];
        if (matchData.onlineRoomCode) {
            try {
                const roomRef = ref(this.db, `rooms/${matchData.onlineRoomCode}/players`);
                const roomSnapshot = await get(roomRef);
                console.log('Room snapshot exists:', roomSnapshot.exists());
                if (roomSnapshot.exists()) {
                    const players = roomSnapshot.val();
                    console.log('Players in room:', players);
                    playerUids = Object.values(players)
                        .map(p => p.uid)
                        .filter(uid => uid); // Filtrar nulls
                    console.log('Player UIDs:', playerUids);
                }
            } catch (error) {
                console.error('Error getting player UIDs:', error);
            }
        }
        
        // Convertir array de UIDs a objeto para poder usarlo en las reglas de Firebase
        const playerUidsObject = {};
        playerUids.forEach(uid => {
            playerUidsObject[uid] = true;
        });
        
        console.log('Saving match with playerUids:', playerUids);
        
        const saveData = {
            ...matchData,
            id: matchId,
            savedBy: this.currentUser.uid,
            playerUids: playerUidsObject, // Guardar como objeto en lugar de array
            savedAt: Date.now()
        };
        
        await set(matchRef, saveData);
        return matchId;
    }

    // Cargar todas las partidas online guardadas (del usuario actual o partidas compartidas)
    async loadOnlineMatches() {
        this.initialize();
        
        if (!this.currentUser) {
            console.log('⚠️ No current user, cannot load matches');
            return [];
        }
        
        console.log('📥 Loading matches for user:', this.currentUser.uid);
        
        const matchesRef = ref(this.db, 'savedMatches');
        const snapshot = await get(matchesRef);
        
        if (snapshot.exists()) {
            const matches = [];
            const userId = this.currentUser.uid;
            
            console.log('📦 Total matches in DB:', snapshot.size);
            
            snapshot.forEach((childSnapshot) => {
                const match = childSnapshot.val();
                console.log('🔍 Checking match:', match.id, {
                    savedBy: match.savedBy,
                    playerUids: match.playerUids,
                    myUid: userId,
                    isMatch: match.savedBy === userId || (match.playerUids && match.playerUids[userId])
                });
                
                // Incluir partidas guardadas por el usuario o partidas donde el usuario está en playerUids
                // playerUids ahora es un objeto donde las keys son los UIDs
                if (match.savedBy === userId || 
                    (match.playerUids && match.playerUids[userId])) {
                    matches.push(match);
                    console.log('✅ Match included');
                } else {
                    console.log('❌ Match excluded');
                }
            });
            
            console.log('📊 Total matches for user:', matches.length);
            
            // Ordenar por fecha de actualización (más reciente primero)
            matches.sort((a, b) => (b.updatedAt || b.savedAt || 0) - (a.updatedAt || a.savedAt || 0));
            return matches;
        }
        return [];
    }

    // Eliminar partida online guardada
    async deleteOnlineMatch(matchId) {
        this.initialize();
        
        if (!this.currentUser) {
            throw new Error('Debes iniciar sesión para eliminar partidas');
        }
        
        const matchRef = ref(this.db, `savedMatches/${matchId}`);
        await remove(matchRef);
    }

    // Actualizar partida online guardada
    async updateOnlineMatch(matchId, updates) {
        this.initialize();
        
        const matchRef = ref(this.db, `savedMatches/${matchId}`);
        const updateData = {
            ...updates,
            updatedAt: Date.now()
        };
        await update(matchRef, updateData);
    }
}

// Exportar instancia singleton
const firebaseService = new FirebaseService();
export default firebaseService;
