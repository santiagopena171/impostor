import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import InitialModeSelector from './components/InitialModeSelector';
import NetworkModeSelector from './components/NetworkModeSelector';
import OnlineActionSelector from './components/OnlineActionSelector';
import MatchCreator from './components/MatchCreator';
import OnlineMatchCreator from './components/OnlineMatchCreator';
import OnlineMatchJoin from './components/OnlineMatchJoin';
import OnlineRoomLobby from './components/OnlineRoomLobby';
import MatchSelector from './components/MatchSelector';
import LoadMatch from './components/LoadMatch';
import Home from './components/Home';
import ImpostorGame from './games/impostor/ImpostorGame';
import GuessPlayerGame from './games/guess-player/GuessPlayerGame';
import TorresGame from './games/torres/TorresGame';
import firebaseService from './services/firebaseService';

const STORAGE_KEY = 'footyGamesMatches';

function App() {
  const [currentView, setCurrentView] = useState('mode-selector');
  const [gameMode, setGameMode] = useState(null); // 'casual' o 'competitive'
  const [networkMode, setNetworkMode] = useState(null); // 'offline' o 'online'
  const [currentMatchId, setCurrentMatchId] = useState(null); // ID de la partida actual
  const [matchData, setMatchData] = useState(null); // Datos de la partida competitiva
  const [globalScores, setGlobalScores] = useState({}); // Puntajes globales para modo competitivo
  const [savedMatches, setSavedMatches] = useState([]); // Array de todas las partidas guardadas offline
  const [onlineMatches, setOnlineMatches] = useState([]); // Array de partidas online guardadas en Firebase
  const [onlineRoomCode, setOnlineRoomCode] = useState(null); // Código de sala online
  const [onlinePlayerName, setOnlinePlayerName] = useState(null); // Nombre del jugador en modo online
  const [isOnlineHost, setIsOnlineHost] = useState(false); // Si es el host de la sala online
  const [currentUser, setCurrentUser] = useState(null); // Usuario autenticado
  const [isAuthChecking, setIsAuthChecking] = useState(true); // Verificando autenticación

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = firebaseService.onAuthChange((user) => {
      console.log('🔐 Auth changed:', user ? user.email : 'No user');
      setCurrentUser(user);
      setIsAuthChecking(false);
      
      // Si el usuario inició sesión, cargar sus partidas online
      if (user) {
        console.log('👤 User logged in, loading matches...');
        // Pequeño delay para asegurar que firebaseService.currentUser está actualizado
        setTimeout(() => {
          loadOnlineMatches();
        }, 100);
      } else {
        console.log('👋 User logged out, clearing matches');
        setOnlineMatches([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Función para cargar partidas online
  const loadOnlineMatches = async () => {
    console.log('🔄 Loading online matches...');
    try {
      const matches = await firebaseService.loadOnlineMatches();
      console.log('✅ Online matches loaded:', matches.length, 'matches');
      setOnlineMatches(matches);
    } catch (e) {
      console.error('❌ Error al cargar partidas online:', e);
    }
  };

  // Cargar todas las partidas guardadas al iniciar
  useEffect(() => {
    // Cargar partidas offline desde localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const matches = JSON.parse(saved);
        setSavedMatches(matches);
      } catch (e) {
        console.error('Error al cargar partidas:', e);
      }
    }
  }, []);

  // Guardar partida actual automáticamente cuando cambie
  useEffect(() => {
    if (matchData && currentMatchId) {
      const matchToSave = {
        id: currentMatchId,
        matchData,
        scores: globalScores,
        gameMode,
        networkMode,
        currentGame: currentView !== 'home' ? currentView : null,
        updatedAt: new Date().toISOString()
      };

      if (networkMode === 'online') {
        // Guardar en Firebase para partidas online
        matchToSave.onlineRoomCode = onlineRoomCode;
        matchToSave.onlinePlayerName = onlinePlayerName;
        matchToSave.isOnlineHost = isOnlineHost;
        
        firebaseService.saveOnlineMatch(matchToSave)
          .then(() => {
            // Actualizar lista local
            setOnlineMatches(prev => {
              const existingIndex = prev.findIndex(m => m.id === currentMatchId);
              if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = matchToSave;
                return updated;
              } else {
                return [...prev, matchToSave];
              }
            });
          })
          .catch(err => console.error('Error guardando partida online:', err));
      } else {
        // Guardar en localStorage para partidas offline
        setSavedMatches(prev => {
          const existingIndex = prev.findIndex(m => m.id === currentMatchId);
          let updated;
          if (existingIndex >= 0) {
            updated = [...prev];
            updated[existingIndex] = matchToSave;
          } else {
            updated = [...prev, matchToSave];
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [gameMode, matchData, globalScores, currentMatchId, currentView, networkMode, onlineRoomCode, onlinePlayerName, isOnlineHost]);

  const handleLogin = async (username, password, setError) => {
    const result = await firebaseService.loginUser(username, password);
    if (result.success) {
      setCurrentUser(result.user);
      setCurrentView('mode-selector');
    } else {
      setError(result.error);
    }
  };

  const handleRegister = async (username, password, setError) => {
    const result = await firebaseService.registerUser(username, password);
    if (result.success) {
      setCurrentUser(result.user);
      setCurrentView('mode-selector');
    } else {
      setError(result.error);
    }
  };

  const handleLogout = async () => {
    await firebaseService.logoutUser();
    setCurrentUser(null);
    setCurrentView('login');
    setGameMode(null);
    setNetworkMode(null);
  };

  const handleSkipLogin = () => {
    setCurrentView('mode-selector');
  };

  const handleSelectMode = (mode) => {
    setGameMode(mode);
    setCurrentView('network-selector');
  };

  const handleSelectNetwork = (network) => {
    setNetworkMode(network);
    
    if (network === 'offline') {
      // Verificar si hay partidas guardadas offline
      if (savedMatches.length > 0) {
        setCurrentView('match-selector');
      } else if (gameMode === 'competitive') {
        setCurrentView('match-creator');
      } else {
        setCurrentView('home');
      }
    } else {
      // Modo online - requiere autenticación
      if (!currentUser) {
        alert('Debes iniciar sesión para jugar en modo online');
        setCurrentView('login');
        return;
      }
      setCurrentView('online-action-selector');
    }
  };

  const handleSelectOnlineAction = (action) => {
    if (action === 'create') {
      setCurrentView('online-match-creator');
    } else if (action === 'join') {
      setCurrentView('online-match-join');
    } else if (action === 'load') {
      setCurrentView('match-selector');
    }
  };

  const handleCreateMatch = (match) => {
    console.log('📝 CREATING MATCH:', match);
    
    if (match.isOnline) {
      // Partida online
      setOnlineRoomCode(match.roomCode);
      setOnlinePlayerName(match.hostPlayerName);
      setIsOnlineHost(true);
      setMatchData(match);
      
      console.log('🎯 Online state set:', {
        onlineRoomCode: match.roomCode,
        onlinePlayerName: match.hostPlayerName,
        isOnlineHost: true
      });
      
      // Inicializar scores para todos los jugadores
      const initialScores = {};
      match.players.forEach(player => {
        initialScores[player] = 0;
      });
      setGlobalScores(initialScores);
      
      // Ir al lobby
      setCurrentView('online-room-lobby');
      
      // Escuchar cambios en la sala
      firebaseService.onRoomUpdate(match.roomCode, (roomData) => {
        if (roomData.scores) {
          setGlobalScores(roomData.scores);
        }
        // Sincronizar gameMode
        if (roomData.matchData?.gameMode) {
          setGameMode(roomData.matchData.gameMode);
        }
        // Si el juego empieza, cambiar a la pantalla home
        if (roomData.status === 'playing') {
          setCurrentView('home');
        }
        // Si se selecciona un juego, cambiar a ese juego
        if (roomData.currentGame && roomData.currentGame !== 'lobby-started') {
          setCurrentView(roomData.currentGame);
        }
      });
    } else {
      // Partida offline
      const newMatchId = Date.now().toString();
      const matchWithId = { ...match, id: newMatchId };
      
      setCurrentMatchId(newMatchId);
      setMatchData(matchWithId);
      
      // Inicializar scores para todos los jugadores
      const initialScores = {};
      match.players.forEach(player => {
        initialScores[player] = 0;
      });
      setGlobalScores(initialScores);
      setCurrentView('home');
    }
  };

  const handleJoinMatch = (matchInfo) => {
    // Unirse a partida online
    setOnlineRoomCode(matchInfo.roomCode);
    setOnlinePlayerName(matchInfo.playerName);
    setIsOnlineHost(false);
    setMatchData(matchInfo);
    setGlobalScores(matchInfo.scores || {});
    
    // Establecer gameMode desde matchData
    if (matchInfo.gameMode) {
      setGameMode(matchInfo.gameMode);
    }
    
    // Ir al lobby
    setCurrentView('online-room-lobby');
    
    // Escuchar cambios en la sala
    firebaseService.onRoomUpdate(matchInfo.roomCode, (roomData) => {
      if (roomData.scores) {
        setGlobalScores(roomData.scores);
      }
      // Sincronizar gameMode
      if (roomData.matchData?.gameMode) {
        setGameMode(roomData.matchData.gameMode);
      }
      // Si el juego empieza, cambiar a la pantalla home
      if (roomData.status === 'playing') {
        setCurrentView('home');
      }
      // Si se selecciona un juego, cambiar a ese juego
      if (roomData.currentGame && roomData.currentGame !== 'lobby-started') {
        setCurrentView(roomData.currentGame);
      }
    });
  };

  const handleStartOnlineGame = async () => {
    console.log('Starting online game', { matchData, gameMode, globalScores });
    
    // Actualizar estado en Firebase para que todos los jugadores vean el cambio
    if (onlineRoomCode) {
      try {
        await firebaseService.selectGame(onlineRoomCode, 'lobby-started');
        await firebaseService.updateGameState(onlineRoomCode, { status: 'playing' });
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }
    
    setCurrentView('home');
  };

  const handleSelectMatch = async (match) => {
    console.log('📂 Loading match:', match);
    
    setCurrentMatchId(match.id);
    setMatchData(match.matchData);
    setGlobalScores(match.scores || {});
    setGameMode(match.gameMode || 'competitive');
    setNetworkMode(match.networkMode || 'offline');
    
    // Si es una partida online, reconectar
    if (match.networkMode === 'online' && match.onlineRoomCode) {
      console.log('🌐 Reconnecting to online room:', match.onlineRoomCode);
      setOnlineRoomCode(match.onlineRoomCode);
      setOnlinePlayerName(match.onlinePlayerName);
      
      // Determinar si este jugador es el host original (primer jugador de la lista)
      const originalHost = match.matchData.players && match.matchData.players[0];
      const isOriginalHost = match.onlinePlayerName === originalHost;
      
      console.log('🔍 Host check:', {
        myName: match.onlinePlayerName,
        originalHost: originalHost,
        isOriginalHost: isOriginalHost,
        allPlayers: match.matchData.players
      });

      try {
        const roomData = await firebaseService.getRoomData(match.onlineRoomCode);
        console.log('📦 Room data from Firebase:', roomData);
        
        if (!roomData && isOriginalHost) {
          // Si el host original carga y la sala no existe, recrearla
          console.log('🏗️ Room not found, recreating as host...');
          await firebaseService.recreateRoom(
            match.onlineRoomCode,
            match.matchData,
            match.onlinePlayerName,
            match.scores || {}
          );
          setIsOnlineHost(true);
          console.log('✅ Room recreated, you are host');
        } else if (roomData) {
          // Si la sala existe, verificar quién es el host desde Firebase
          const isHost = roomData.host === match.onlinePlayerName;
          setIsOnlineHost(isHost);
          console.log('✅ Room exists, host status:', {
            roomHost: roomData.host,
            myName: match.onlinePlayerName,
            isHost: isHost
          });
          
          if (isHost) {
            // Si es el host, actualizar con los datos guardados
            console.log('📝 Updating room data as host...');
            await firebaseService.updateRoomData(
              match.onlineRoomCode,
              match.matchData,
              match.scores || {}
            );
          }
        } else {
          // No es host original y la sala no existe
          console.log('⚠️ Not original host and room does not exist');
          setIsOnlineHost(false);
          alert('La sala no existe. Solo el host puede recrearla.');
          setNetworkMode('offline');
          return;
        }
        
        // Reconectar al jugador
        console.log('🔗 Reconnecting player...');
        await firebaseService.updatePlayerConnection(match.onlineRoomCode, match.onlinePlayerName, true);
        
        // Escuchar cambios
        firebaseService.onRoomUpdate(match.onlineRoomCode, (roomData) => {
          if (roomData.scores) {
            setGlobalScores(roomData.scores);
          }
          // Sincronizar gameMode
          if (roomData.matchData?.gameMode) {
            setGameMode(roomData.matchData.gameMode);
          }
          // Verificar host status desde Firebase
          if (roomData.host && match.onlinePlayerName) {
            const isHost = roomData.host === match.onlinePlayerName;
            setIsOnlineHost(isHost);
            console.log('Host updated from Firebase:', roomData.host, 'You are host:', isHost);
          }
          if (roomData.currentGame && roomData.currentGame !== 'lobby-started') {
            setCurrentView(roomData.currentGame);
          }
        });
        
      } catch (error) {
        console.error('Error reconnecting to room:', error);
        alert('Error al reconectar. Se cargará en modo offline.');
        setNetworkMode('offline');
        setIsOnlineHost(false);
      }
    }
    
    // Si había un juego en progreso, volver a ese juego
    if (match.currentGame && ['impostor', 'guess-player', 'torres'].includes(match.currentGame)) {
      setCurrentView(match.currentGame);
    } else {
      setCurrentView('home');
    }
  };

  const handleDeleteMatch = async (matchId, isOnline) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      if (isOnline) {
        // Eliminar de Firebase
        try {
          await firebaseService.deleteOnlineMatch(matchId);
          setOnlineMatches(prev => prev.filter(m => m.id !== matchId));
        } catch (error) {
          console.error('Error eliminando partida online:', error);
          alert('Error al eliminar la partida');
          return;
        }
      } else {
        // Eliminar de localStorage
        const updated = savedMatches.filter(m => m.id !== matchId);
        setSavedMatches(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      
      // Si es la partida actual, limpiar
      if (matchId === currentMatchId) {
        setCurrentMatchId(null);
        setMatchData(null);
        setGlobalScores({});
      }
    }
  };

  const handleSelectGame = async (gameId) => {
    // Si está en modo online, actualizar Firebase para que todos vean el cambio
    if (networkMode === 'online' && onlineRoomCode) {
      try {
        await firebaseService.selectGame(onlineRoomCode, gameId);
      } catch (error) {
        console.error('Error selecting game:', error);
      }
    }
    
    setCurrentView(gameId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleBackToModeSelector = () => {
    // NO limpiar estado online aquí - se mantendrá para poder cargar partidas
    // Solo desconectar del listener de Firebase
    if (networkMode === 'online' && onlineRoomCode) {
      firebaseService.cleanup(onlineRoomCode);
      // Marcar como desconectado pero no limpiar las variables
      if (onlinePlayerName) {
        firebaseService.disconnectPlayer(onlineRoomCode, onlinePlayerName);
      }
    }
    
    setCurrentView('mode-selector');
    // NO limpiar gameMode ni networkMode - se necesitan para cargar partidas
  };

  const handleBackToNetworkSelector = () => {
    setCurrentView('network-selector');
    setNetworkMode(null);
  };

  const handleBackToOnlineActionSelector = () => {
    setCurrentView('online-action-selector');
  };

  const handleNewMatch = () => {
    setCurrentView('match-creator');
  };

  const handleBackToMatchSelector = () => {
    setCurrentView('match-selector');
  };

  const handleUpdateScores = (newScores) => {
    setGlobalScores(newScores);
    
    // Si está en modo online, sincronizar con Firebase
    if (networkMode === 'online' && onlineRoomCode) {
      firebaseService.updateScores(onlineRoomCode, newScores);
    }
  };

  const handleSaveGame = async () => {
    console.log('🎮 SAVING GAME - Current state:', {
      networkMode,
      onlineRoomCode,
      onlinePlayerName,
      isOnlineHost,
      matchData,
      currentUser
    });
    
    // Validar que haya datos para guardar
    if (!matchData) {
      alert('No hay partida activa para guardar');
      return;
    }

    // Si ya tiene ID, actualizar; si no, crear nueva
    const matchId = currentMatchId || `match_${Date.now()}`;
    
    // Crear objeto limpio para guardar (sin valores undefined)
    const matchToSave = {
      id: matchId,
      matchData: matchData ? JSON.parse(JSON.stringify(matchData)) : null,
      scores: globalScores || {},
      gameMode: gameMode || 'competitive',
      networkMode: networkMode || 'offline',
      currentGame: currentView !== 'home' ? currentView : null,
      updatedAt: new Date().toISOString()
    };

    if (networkMode === 'online') {
      // Validar que haya usuario autenticado para guardar online
      if (!currentUser) {
        console.error('No hay usuario autenticado. currentUser:', currentUser);
        alert('Debes iniciar sesión para guardar partidas online');
        return;
      }

      // Guardar en Firebase para partidas online
      matchToSave.onlineRoomCode = onlineRoomCode || null;
      matchToSave.onlinePlayerName = onlinePlayerName || null;
      matchToSave.isOnlineHost = isOnlineHost || false;
      
      console.log('💾 Saving online match:', matchToSave);

      try {
        await firebaseService.saveOnlineMatch(matchToSave);
        
        // Actualizar lista local
        setOnlineMatches(prev => {
          const existingIndex = prev.findIndex(m => m.id === matchId);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = matchToSave;
            return updated;
          } else {
            return [...prev, matchToSave];
          }
        });
        
        if (!currentMatchId) {
          setCurrentMatchId(matchId);
        }
        
        alert('Partida guardada exitosamente en el servidor');
      } catch (error) {
        console.error('Error guardando partida:', error);
        alert('Error al guardar la partida: ' + error.message);
      }
    } else {
      // Guardar en localStorage para partidas offline
      setSavedMatches(prev => {
        const existingIndex = prev.findIndex(m => m.id === matchId);
        let updated;
        if (existingIndex >= 0) {
          updated = [...prev];
          updated[existingIndex] = matchToSave;
        } else {
          updated = [...prev, matchToSave];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      if (!currentMatchId) {
        setCurrentMatchId(matchId);
      }

      alert('Partida guardada exitosamente');
    }
  };

  // Debug para verificar valores
  console.log('App state:', { 
    networkMode, 
    isOnlineHost, 
    onlinePlayerName, 
    onlineRoomCode, 
    currentView,
    currentUser: currentUser?.uid
  });

  // Mostrar loading mientras verifica autenticación
  if (isAuthChecking) {
    return (
      <div className="app-container" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚽</div>
          <div style={{ fontSize: '1.2rem' }}>Cargando...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onLogin={handleLogin}
          onRegister={handleRegister}
          onSkip={handleSkipLogin}
        />
      )}

      {currentView === 'mode-selector' && (
        <InitialModeSelector 
          onSelectMode={handleSelectMode}
          onLogout={currentUser ? handleLogout : null}
          username={currentUser?.email?.split('@')[0]}
        />
      )}

      {currentView === 'network-selector' && (
        <NetworkModeSelector 
          onSelectNetwork={handleSelectNetwork}
          onBack={handleBackToModeSelector}
        />
      )}

      {currentView === 'online-action-selector' && (
        <OnlineActionSelector
          onSelectAction={handleSelectOnlineAction}
          onBack={handleBackToNetworkSelector}
          hasSavedMatches={savedMatches.length > 0 || onlineMatches.length > 0}
        />
      )}

      {currentView === 'online-match-creator' && (
        <OnlineMatchCreator
          onCreateMatch={handleCreateMatch}
          onBack={handleBackToOnlineActionSelector}
          gameMode={gameMode}
        />
      )}

      {currentView === 'online-match-join' && (
        <OnlineMatchJoin
          onJoinMatch={handleJoinMatch}
          onBack={handleBackToOnlineActionSelector}
        />
      )}

      {currentView === 'online-room-lobby' && (
        <OnlineRoomLobby
          roomCode={onlineRoomCode}
          matchData={matchData}
          playerName={onlinePlayerName}
          isHost={isOnlineHost}
          onStartGame={handleStartOnlineGame}
          onBack={handleBackToModeSelector}
        />
      )}

      {currentView === 'match-selector' && (
        <MatchSelector 
          matches={networkMode === 'online' ? onlineMatches : savedMatches}
          onSelectMatch={handleSelectMatch}
          onNewMatch={handleNewMatch}
          onDeleteMatch={handleDeleteMatch}
          onBack={handleBackToModeSelector}
          isOnlineMode={networkMode === 'online'}
        />
      )}

      {currentView === 'match-creator' && (
        <MatchCreator 
          onCreateMatch={handleCreateMatch} 
          onBack={savedMatches.length > 0 ? handleBackToMatchSelector : handleBackToNetworkSelector}
        />
      )}

      {currentView === 'home' && (
        <Home 
          onSelectGame={handleSelectGame}
          gameMode={gameMode}
          matchData={matchData}
          globalScores={globalScores}
          onBackToModeSelector={handleBackToModeSelector}
          onSaveGame={handleSaveGame}
          isOnline={networkMode === 'online'}
          isHost={isOnlineHost}
          onlineRoomCode={onlineRoomCode}
        />
      )}

      {currentView === 'impostor' && (
        <ImpostorGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
          isOnline={networkMode === 'online'}
          isHost={isOnlineHost}
          onlineRoomCode={onlineRoomCode}
          currentPlayerName={onlinePlayerName}
        />
      )}

      {currentView === 'guess-player' && (
        <GuessPlayerGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
          matchPlayers={matchData?.players}
          globalScores={globalScores}
          onUpdateScores={handleUpdateScores}
          isOnline={networkMode === 'online'}
          isHost={isOnlineHost}
          onlineRoomCode={onlineRoomCode}
          currentPlayerName={onlinePlayerName}
        />
      )}

      {currentView === 'torres' && (
        <TorresGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
          matchPlayers={matchData?.players}
          globalScores={globalScores}
          onUpdateScores={handleUpdateScores}
          isOnline={networkMode === 'online'}
          isHost={isOnlineHost}
          onlineRoomCode={onlineRoomCode}
          currentPlayerName={onlinePlayerName}
        />
      )}
    </>
  );
}

export default App;
