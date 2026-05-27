import React from 'react';
import { Star, Play, Heart, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import GameIcon from './GameIcon.jsx';

export default function GameCard({
  game,
  isFavorite,
  onPlayGame,
  onToggleFavorite,
  onDeleteGame
}) {
  return (
    <motion.div
      id={`game-card-${game.id}`}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative flex flex-col justify-between overflow-hidden bg-slate-950 border border-slate-900 rounded-xl hover:border-indigo-500/30 transition-all duration-300 shadow-md hover:shadow-2xl"
    >
      {/* Top Banner Cover Accent Gradient */}
      <div className="relative h-32 w-full overflow-hidden flex-shrink-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${game.accentColor || 'from-blue-600 to-indigo-900'} opacity-70 group-hover:scale-115 transition-transform duration-500`}></div>
        
        {/* Retro scan lines overlay for that visual authenticity */}
        <div className="absolute inset-x-0 h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%),linear-gradient(90.5deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none"></div>

        {/* Action Widgets overlays */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Delete Option for User Custom Games */}
          {game.isUserAdded && onDeleteGame && (
            <button
              onClick={(e) => onDeleteGame(game.id, e)}
              className="p-1.5 bg-slate-950/80 backdrop-blur-sm border border-red-500/30 text-red-400 hover:text-white hover:bg-red-500/90 rounded-md transition duration-200"
              title="Delete Custom Game"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Favorites Heart */}
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            className={`p-1.5 rounded-md transition duration-200 border bg-slate-950/80 backdrop-blur-sm shadow-md cursor-pointer ${
              isFavorite
                ? 'border-rose-500 text-rose-400 hover:bg-rose-500/10'
                : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>

        {/* Center Graphic Icon */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="p-3 bg-slate-950/65 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <GameIcon name={game.iconName} className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] animate-pulse" />
          </div>
        </div>

        {/* Category Label */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-sm border border-white/10 text-slate-100 font-mono text-[9px] uppercase tracking-wider rounded font-bold">
            {game.category}
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div>
          <h3 className="text-base font-mono font-bold text-slate-100 leading-snug group-hover:text-cyan-400 transition-colors">
            {game.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-900 pt-3">
          <div className="flex items-center gap-1 font-mono text-xs text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-slate-200">{game.rating}</span>
          </div>

          <button
            onClick={() => onPlayGame(game)}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-950/85 border border-indigo-500/20 text-indigo-300 hover:text-slate-950 hover:bg-cyan-400 hover:border-cyan-400 text-[10px] font-mono font-black rounded-lg transition-all duration-200 cursor-pointer"
          >
            PLAY ROOM <Play className="w-2.5 h-2.5 fill-current" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
