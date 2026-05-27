import React from 'react';
import { Play, TrendingUp, Star, Trophy, Users } from 'lucide-react';
import { motion } from 'motion/react';
import GameIcon from './GameIcon.jsx';

export default function Hero({ featuredGame, onPlayGame }) {
  if (!featuredGame) return null;

  return (
    <div id="arcade-hero-banner" className="relative max-w-7xl mx-auto my-6 px-4 sm:px-6">
      <div className="relative overflow-hidden bg-slate-950 rounded-2xl border border-indigo-500/10 p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
        {/* Neon Grid Ambient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e1b4b_0%,transparent_70%)] opacity-40"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_0%,#1e1b4b_50%,#020617_100%)] opacity-30"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Thumbnail Visual Container */}
        <div className="relative lg:w-1/3 w-full flex justify-center flex-shrink-0">
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl group">
            <div className={`absolute inset-0 bg-gradient-to-tr ${featuredGame.accentColor} opacity-90 transition-all duration-500`}></div>
            
            {/* Retro Scanning Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90.5deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
            
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 text-white">
              <GameIcon name={featuredGame.iconName} className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] animate-pulse" />
              <span className="mt-4 px-3 py-1 bg-slate-950/70 backdrop-blur-sm border border-white/20 rounded-full text-xs font-mono font-bold tracking-widest text-shadow-glow">
                {featuredGame.category.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Game Info Details Block */}
        <div className="relative w-full lg:w-2/3 flex flex-col justify-between text-center lg:text-left z-10">
          <div>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              <span className="flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                <Trophy className="w-3.5 h-3.5" /> Featured Play
              </span>
              <span className="flex items-center gap-1 bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" /> High Rating
              </span>
              {featuredGame.isUserAdded && (
                <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Custom Game
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-mono font-extrabold text-white tracking-tight leading-none mb-4">
              {featuredGame.title}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mb-5 font-sans">
              {featuredGame.description}
            </p>

            {/* Micro Stats Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-6 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-slate-200 font-bold">{featuredGame.rating}</span>
                <span>/ 5.0 Rating</span>
              </div>
              <div>•</div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-200 font-bold">Safe &amp; Free</span>
              </div>
              <div>•</div>
              <div>
                Dev: <span className="text-slate-200 font-bold">{featuredGame.developer}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(6,182,212,0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlayGame(featuredGame)}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-cyan-400 text-slate-950 font-mono font-bold text-base rounded-xl transition cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>LAUNCH PLAY ROOM</span>
            </motion.button>
            
            <div className="text-xs text-slate-400 font-mono border-t border-slate-800/60 pt-3 sm:pt-0 sm:border-t-0 sm:pl-3 max-w-sm text-center sm:text-left">
              <span className="text-indigo-400 font-semibold block uppercase tracking-wider">Controls:</span>
              {featuredGame.controls}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
