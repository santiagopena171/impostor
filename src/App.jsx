import React, { useState } from 'react';
import Home from './components/Home';
import ImpostorGame from './games/impostor/ImpostorGame';
import GuessPlayerGame from './games/guess-player/GuessPlayerGame';
import TorresGame from './games/torres/TorresGame';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'impostor', 'guess-player', 'torres'

  const handleSelectGame = (gameId) => {
    setCurrentView(gameId);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <>
      {currentView === 'home' && (
        <Home onSelectGame={handleSelectGame} />
      )}

      {currentView === 'impostor' && (
        <ImpostorGame onBack={handleBackToHome} />
      )}

      {currentView === 'guess-player' && (
        <GuessPlayerGame onBack={handleBackToHome} />
      )}

      {currentView === 'torres' && (
        <TorresGame onBack={handleBackToHome} />
      )}
    </>
  );
}

export default App;
