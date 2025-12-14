import React, { useState, useEffect } from 'react';
import InitialModeSelector from './components/InitialModeSelector';
import MatchCreator from './components/MatchCreator';
import MatchSelector from './components/MatchSelector';
import LoadMatch from './components/LoadMatch';
import Home from './components/Home';
import ImpostorGame from './games/impostor/ImpostorGame';
import GuessPlayerGame from './games/guess-player/GuessPlayerGame';
import TorresGame from './games/torres/TorresGame';

const STORAGE_KEY = 'footyGamesMatches';

function App() {
  const [currentView, setCurrentView] = useState('mode-selector');
  const [gameMode, setGameMode] = useState(null); // 'casual' o 'competitive'
  const [currentMatchId, setCurrentMatchId] = useState(null); // ID de la partida actual
  const [matchData, setMatchData] = useState(null); // Datos de la partida competitiva
  const [globalScores, setGlobalScores] = useState({}); // Puntajes globales para modo competitivo
  const [savedMatches, setSavedMatches] = useState([]); // Array de todas las partidas guardadas

  // Cargar todas las partidas guardadas al iniciar
  useEffect(() => {
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
    if (gameMode === 'competitive' && matchData && currentMatchId) {
      const matchToSave = {
        id: currentMatchId,
        matchData,
        scores: globalScores,
        updatedAt: new Date().toISOString()
      };

      // Actualizar o agregar la partida en el array
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
  }, [gameMode, matchData, globalScores, currentMatchId]);

  const handleSelectMode = (mode) => {
    setGameMode(mode);
    if (mode === 'casual') {
      setCurrentView('home');
    } else {
      // Modo competitivo: verificar si hay partidas guardadas
      if (savedMatches.length > 0) {
        setCurrentView('match-selector');
      } else {
        setCurrentView('match-creator');
      }
    }
  };

  const handleCreateMatch = (match) => {
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
  };

  const handleSelectMatch = (match) => {
    setCurrentMatchId(match.id);
    setMatchData(match.matchData);
    setGlobalScores(match.scores);
    setCurrentView('home');
  };

  const handleDeleteMatch = (matchId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      const updated = savedMatches.filter(m => m.id !== matchId);
      setSavedMatches(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      
      // Si es la partida actual, limpiar
      if (matchId === currentMatchId) {
        setCurrentMatchId(null);
        setMatchData(null);
        setGlobalScores({});
      }
    }
  };

  const handleSelectGame = (gameId) => {
    setCurrentView(gameId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleBackToModeSelector = () => {
    // NO limpiar partida guardada, solo volver al selector
    setCurrentView('mode-selector');
    setGameMode(null);
  };

  const handleNewMatch = () => {
    setCurrentView('match-creator');
  };

  const handleBackToMatchSelector = () => {
    setCurrentView('match-selector');
  };

  const handleUpdateScores = (newScores) => {
    setGlobalScores(newScores);
  };

  return (
    <>
      {currentView === 'mode-selector' && (
        <InitialModeSelector onSelectMode={handleSelectMode} />
      )}

      {currentView === 'match-selector' && (
        <MatchSelector 
          matches={savedMatches}
          onSelectMatch={handleSelectMatch}
          onNewMatch={handleNewMatch}
          onDeleteMatch={handleDeleteMatch}
          onBack={handleBackToModeSelector}
        />
      )}

      {currentView === 'match-creator' && (
        <MatchCreator 
          onCreateMatch={handleCreateMatch} 
          onBack={savedMatches.length > 0 ? handleBackToMatchSelector : handleBackToModeSelector}
        />
      )}

      {currentView === 'home' && (
        <Home 
          onSelectGame={handleSelectGame}
          gameMode={gameMode}
          matchData={matchData}
          globalScores={globalScores}
          onBackToModeSelector={handleBackToModeSelector}
        />
      )}

      {currentView === 'impostor' && (
        <ImpostorGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
        />
      )}

      {currentView === 'guess-player' && (
        <GuessPlayerGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
          matchPlayers={matchData?.players}
          globalScores={globalScores}
          onUpdateScores={handleUpdateScores}
        />
      )}

      {currentView === 'torres' && (
        <TorresGame 
          onBack={handleBackToHome}
          gameMode={gameMode}
          matchPlayers={matchData?.players}
          globalScores={globalScores}
          onUpdateScores={handleUpdateScores}
        />
      )}
    </>
  );
}

export default App;
