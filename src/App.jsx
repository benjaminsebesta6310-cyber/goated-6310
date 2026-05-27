import React, { useState, useEffect } from 'react';
import defaultGamesData from './data/games.json';

// Import components
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import GameCard from './components/GameCard.jsx';
import GameModal from './components/GameModal.jsx';
import AddGameModal from './components/AddGameModal.jsx';
import GameIcon from './components/GameIcon.jsx';

const CATEGORIES = [
  { name: 'All', icon: 'Gamepad2', label: 'All Games' },
  { name: 'Retro', icon: 'Swords', label: 'Retro' },
  { name: 'Arcade', icon: 'Layers', label: 'Arcade' },
  { name: 'Puzzle', icon: 'Grid', label: 'Puzzle' },
  { name: 'Strategy', icon: 'Compass', label: 'Strategy' },
  { name: 'Casual', icon: 'Activity', label: 'Casual' },
  { name: 'Custom', icon: 'Sparkles', label: 'User Added' }
];

export default function App() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modals state
  const [activePlayGame, setActivePlayGame] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Initialize data on load
  useEffect(() => {
    // 1. Get user custom added games
    const localGamesRaw = localStorage.getItem('unblocked-arcade-custom-games');
    let customGames = [];
    if (localGamesRaw) {
      try {
        customGames = JSON.parse(localGamesRaw);
      } catch (_) {
        customGames = [];
      }
    }

    // Combined default games asset + customer added inputs
    const defaults = defaultGamesData;
    setGames([...defaults, ...customGames]);

    // 2. Get saved bookmarks
    const localFavsRaw = localStorage.getItem('unblocked-arcade-user-favorites');
    if (localFavsRaw) {
      try {
        setFavorites(JSON.parse(localFavsRaw));
      } catch (_) {
        setFavorites([]);
      }
    }
  }, []);

  const handleToggleFavorite = (gameId, event) => {
    if (event) {
      event.stopPropagation(); // Avoid activating game play modal
    }
    
    let updated;
    if (favorites.includes(gameId)) {
      updated = favorites.filter((id) => id !== gameId);
    } else {
      updated = [...favorites, gameId];
    }
    setFavorites(updated);
    localStorage.setItem('unblocked-arcade-user-favorites', JSON.stringify(updated));
  };

  const handleAddCustomGame = (newGame) => {
    const localGamesRaw = localStorage.getItem('unblocked-arcade-custom-games');
    let customGames = [];
    if (localGamesRaw) {
      try {
        customGames = JSON.parse(localGamesRaw);
      } catch (_) {
        customGames = [];
      }
    }

    const updatedCustoms = [...customGames, newGame];
    localStorage.setItem('unblocked-arcade-custom-games', JSON.stringify(updatedCustoms));

    // Append to in-memory list
    setGames([...defaultGamesData, ...updatedCustoms]);
  };

  const handleDeleteCustomGame = (gameId, event) => {
    event.stopPropagation(); // Avoid activating game play modal
    
    if (confirm('Are you sure you want to remove this custom game? This will wipe its saved configuration.')) {
      const localGamesRaw = localStorage.getItem('unblocked-arcade-custom-games');
      let customGames = [];
      if (localGamesRaw) {
        try {
          customGames = JSON.parse(localGamesRaw);
        } catch (_) {
          customGames = [];
        }
      }

      const updatedCustoms = customGames.filter((g) => g.id !== gameId);
      localStorage.setItem('unblocked-arcade-custom-games', JSON.stringify(updatedCustoms));

      // Re-merge with default static lists
      setGames([...defaultGamesData, ...updatedCustoms]);

      // Remove from favorites if it was there
      if (favorites.includes(gameId)) {
        const updatedFavs = favorites.filter((id) => id !== gameId);
        setFavorites(updatedFavs);
        localStorage.setItem('unblocked-arcade-user-favorites', JSON.stringify(updatedFavs));
      }
    }
  };

  // Filter computations logic
  const filteredGames = games.filter((game) => {
    // Search query constraint
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Category tab constraint
    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Custom' && game.isUserAdded) ||
      game.category.toLowerCase() === selectedCategory.toLowerCase();

    // Star filtering toggles
    const matchesFavorites = !showOnlyFavorites || favorites.includes(game.id);

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  // Nominate a random or static index 0 default game for the Hero
  const featuredGame = games.find((g) => g.id === 'pacman') || games[0] || null;

  return (
    <div id="arcade-theme-wrapper" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Decorative Grid Mesh Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#0b1528_1px,transparent_1px),linear-gradient(to_bottom,#0b1528_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-45"></div>

      {/* Main Nav Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onAddGameClick={() => setIsAddModalOpen(true)}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
        gamesCount={games.length}
      />

      {/* High impact Marquee Hero Banner at root view if not looking at favorites or custom searches */}
      {!searchQuery && !showOnlyFavorites && selectedCategory === 'All' && (
        <Hero featuredGame={featuredGame} onPlayGame={(g) => setActivePlayGame(g)} />
      )}

      {/* Primary Dashboard */}
      <main id="dashboard-catalog-body" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 pb-20 relative z-10">
        
        {/**************** Horizontal Category Tabs Row ***************/}
        <div className="flex items-center justify-between gap-4 border-b border-indigo-500/10 pb-4 mb-8 overflow-x-auto scrollbar-none font-mono text-xs">
          <div className="flex items-center gap-2 select-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-xl font-bold transition duration-300 transform shrink-0 hover:scale-103 cursor-pointer ${
                    active
                      ? 'bg-indigo-500/20 text-cyan-400 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'bg-slate-950 border-slate-900 text-slate-500 hover:text-white hover:border-slate-800'
                  }`}
                >
                  <GameIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{cat.label.toUpperCase()}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-zinc-500 uppercase font-mono hidden sm:block whitespace-nowrap">
            PLAY FREE • NO BLOCKS
          </div>
        </div>

        {/**************** Query Match Labeling ***************/}
        {(searchQuery || showOnlyFavorites || selectedCategory !== 'All') && (
          <div className="mb-6 font-mono text-xs flex items-center justify-between text-slate-400 bg-slate-950/80 p-3 rounded-lg border border-slate-900">
            <div className="flex items-center gap-2">
              <span>ACTIVE FILTER:</span>
              {searchQuery && (
                <span className="text-white font-bold">Search "{searchQuery}"</span>
              )}
              {selectedCategory !== 'All' && (
                <span className="text-indigo-400 font-bold">Category: {selectedCategory}</span>
              )}
              {showOnlyFavorites && (
                <span className="text-rose-400 font-bold">Starred List</span>
              )}
            </div>
            
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setShowOnlyFavorites(false);
              }}
              className="text-cyan-400 hover:text-white text-[10px]"
            >
              [RESET ALL FILTERS]
            </button>
          </div>
        )}

        {/**************** Results Grid ***************/}
        {filteredGames.length === 0 ? (
          <div className="text-center py-24 bg-slate-950 rounded-2xl border border-dashed border-slate-900 max-w-lg mx-auto p-8 font-mono">
            <GameIcon name="Gamepad2" className="w-12 h-12 text-indigo-500/40 mx-auto mb-4 animate-bounce" />
            <h3 className="text-base font-bold text-white mb-2">NO ARCADE ROOMS FOUND</h3>
            <p className="text-slate-500 text-xs font-sans leading-relaxed mb-6">
              There are no games matching your query. Try searching for other retro terms, check your Favorites star tracker, or define a new unblocked game yourself!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer font-mono"
            >
              ADD CUSTOM GAME URL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 select-none">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onPlayGame={(g) => setActivePlayGame(g)}
                onToggleFavorite={(id, ev) => handleToggleFavorite(id, ev)}
                onDeleteGame={(id, ev) => handleDeleteCustomGame(id, ev)}
              />
            ))}
          </div>
        )}
      </main>

      {/**************** Footer Credits ***************/}
      <footer className="relative mt-auto border-t border-slate-900 bg-slate-950 py-6 text-center font-mono text-[10px] text-slate-600 z-10 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            UNBLOCKED ARCADE HUB © 2026 • STRICTLY COMPLIANT IFRAME VIEWER • LOCAL STORAGE PERSISTED
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                if(confirm("Confirm reset: This will delete ALL user-added custom games and reviews from your local browser workspace. Standard games remain.")) {
                  localStorage.removeItem('unblocked-arcade-custom-games');
                  localStorage.removeItem('unblocked-arcade-user-favorites');
                  // Wipe some dynamic reviewer localStorage databases too
                  for(let key in localStorage) {
                    if(key.startsWith('arcade-reviews-')) {
                      localStorage.removeItem(key);
                    }
                  }
                  window.location.reload();
                }
              }}
              className="hover:text-red-400 transition cursor-pointer text-cyan-500 font-bold uppercase"
              title="Wipe sandbox cache and start fresh"
            >
              [HARD RESET CONSOLE]
            </button>
          </div>
        </div>
      </footer>

      {/**************** Overlay Emulators / Players ***************/}
      <GameModal
        game={activePlayGame}
        onClose={() => setActivePlayGame(null)}
        isFavorite={activePlayGame ? favorites.includes(activePlayGame.id) : false}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
        allGames={games}
        onPlayGame={(g) => setActivePlayGame(g)}
      />

      {/**************** Creator dialogs ***************/}
      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddCustomGame}
      />
    </div>
  );
}
