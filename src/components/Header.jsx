import React from 'react';
import { Search, Plus, Gamepad2, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header({
  searchQuery,
  setSearchQuery,
  onAddGameClick,
  showOnlyFavorites,
  setShowOnlyFavorites,
  gamesCount
}) {
  return (
    <header id="arcade-header" className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-500/20 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Branding Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 rounded-lg blur opacity-70 animate-pulse"></div>
              <div className="relative p-2 bg-slate-950 border border-cyan-400 rounded-lg text-cyan-400">
                <Gamepad2 className="w-6 h-6 animate-bounce" />
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-mono tracking-wider font-extrabold text-white bg-clip-text">
                UNBLOCKED<span className="text-cyan-400 font-bold text-shadow-neon">ARCADE</span>
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  {gamesCount} games loaded • sandbox secure
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats on Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`p-2 rounded-lg border transition ${
                showOnlyFavorites
                  ? 'bg-rose-900/30 border-rose-500 text-rose-400'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Show Favorites"
            >
              <Heart className={`w-5 h-5 ${showOnlyFavorites ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onAddGameClick}
              className="p-2 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition flex items-center justify-center"
              title="Add Custom Game"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Central Dashboard Controls */}
        <div className="flex flex-1 max-w-xl items-center gap-3 w-full">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search unblocked games, emulator hubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 font-mono text-sm border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition"
              id="game-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Action Controls for Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Favorites Filter */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition text-sm font-mono ${
              showOnlyFavorites
                ? 'bg-rose-950/40 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Heart className={`w-4 h-4 ${showOnlyFavorites ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{showOnlyFavorites ? 'My Favs (Active)' : 'Starred Games'}</span>
          </button>

          {/* Add Game Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddGameClick}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-sm rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>ADD GAME IFRAME</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
}
