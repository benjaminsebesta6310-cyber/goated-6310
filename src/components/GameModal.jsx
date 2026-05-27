import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Maximize2, Minimize2, ExternalLink, Heart, Star, Play, Trophy, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReviewSection from './ReviewSection.jsx';
import GameIcon from './GameIcon.jsx';

export default function GameModal({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  allGames,
  onPlayGame
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Key used to force-refresh standard iframe elements
  const containerRef = useRef(null);

  if (!game) return null;

  // Listen to standard browser fullscreen transition events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request rejected:", err);
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  // Find recommended games (same category or top rated, excluding the playing game)
  const recommendations = allGames
    .filter((g) => g.id !== game.id)
    .sort((a, b) => (a.category === game.category ? -1 : 1))
    .slice(0, 4);

  return (
    <AnimatePresence>
      <div id="game-player-portal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 overflow-y-auto">
        {/* Close trigger clicking outside */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.97, opacity: 0 }}
          className={`relative w-full ${
            isTheaterMode ? 'max-w-7xl' : 'max-w-5xl'
          } bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[96vh]`}
        >
          {/**************** Control Header Bar ***************/}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 font-mono text-zinc-300">
            <div className="flex items-center gap-2 max-w-[50%]">
              <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${game.accentColor} animate-pulse`}></span>
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">{game.title}</h3>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] bg-slate-900 border border-indigo-500/20 rounded text-cyan-400 font-black uppercase tracking-widest">
                {game.category}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {/* Reload Button */}
              <button
                onClick={reloadGame}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-850 rounded-lg transition"
                title="Restart Iframe"
                id="reload-game-iframe-btn"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Toggle Favorite */}
              <button
                onClick={() => onToggleFavorite(game.id)}
                className={`p-2 rounded-lg transition border ${
                  isFavorite
                    ? 'border-rose-500 bg-rose-950/20 text-rose-400 hover:bg-rose-500/10'
                    : 'border-slate-800 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
                title="Favorite Game"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>

              {/* Width Theatre Toggle */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className={`hidden md:inline-block px-2.5 py-1 text-[10px] rounded border transition ${
                  isTheaterMode
                    ? 'border-cyan-400 bg-cyan-950/20 text-cyan-400 font-bold'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Expand Screen Size"
              >
                {isTheaterMode ? 'STANDARD SCREEN' : 'THEATER ROOM'}
              </button>

              {/* Fullscreen Trigger */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-850 rounded-lg transition"
                title="Play Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* External Tab link */}
              <a
                href={game.iframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-850 rounded-lg transition flex items-center justify-center"
                title="Launch in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Divider */}
              <div className="w-[1px] h-5 bg-slate-800"></div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-slate-950 transition rounded-lg"
                title="Exit Sandbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/**************** Main Split Player Room ***************/}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-h-[82vh]">
            {/* Left Screen Container */}
            <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto min-h-0">
              {/* Actual Iframe Box */}
              <div
                ref={containerRef}
                className="relative bg-slate-950 w-full aspect-video flex-shrink-0 border-b border-slate-900 group"
              >
                {/* Standard unblocked game Iframe loader */}
                <iframe
                  key={iframeKey}
                  src={game.iframeUrl}
                  title={`Unblocked game: ${game.title}`}
                  className="w-full h-full border-none select-none outline-none overflow-hidden"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                />

                {/* Ambient instructions block only visible in fullscreen */}
                {isFullscreen && (
                  <div className="absolute top-4 left-4 z-50 bg-slate-950/90 border border-slate-800 text-[10px] font-mono p-2 rounded text-zinc-400 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
                    Press <span className="text-white font-bold">ESC</span> to exit Fullscreen Mode
                  </div>
                )}
              </div>

              {/* Meta information & review scrollarea inside player cabinet */}
              <div className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-mono font-extrabold text-white mb-2 leading-none flex items-center gap-2">
                      <GameIcon name={game.iconName} className="w-6 h-6 text-indigo-400" />
                      {game.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-mono text-slate-400">
                      <span>Dev: <b className="text-slate-200">{game.developer}</b></span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-slate-200 font-bold">{game.rating}</span>
                        <span>/ 5.0 Rating</span>
                      </div>
                      <span>•</span>
                      <span className="text-emerald-400">Verified Secure Connection</span>
                    </div>
                  </div>

                  <a
                    href={game.iframeUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="sm:self-center px-4 py-2 bg-indigo-950 font-mono text-zinc-300 border border-indigo-700/20 text-xs rounded-xl hover:bg-cyan-400 hover:text-slate-950 transition duration-200 flex items-center gap-1"
                  >
                    Play Standalone Mode <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Detail Description Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" /> Description
                    </h4>
                    <p className="text-slate-300 font-sans text-xs leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                      <Activity className="w-4 h-4 text-cyan-400" /> Controls &amp; Input Keys
                    </h4>
                    <p className="text-slate-300 font-mono text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-900 leading-normal">
                      {game.controls}
                    </p>
                  </div>
                </div>

                {/* Community Review Form & chat */}
                <ReviewSection gameId={game.id} />
              </div>
            </div>

            {/* Right Hot-swap Sidebar Recommended List */}
            <div className="w-full lg:w-72 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-4 shrink-0 flex flex-col font-mono overflow-y-auto">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-900">
                <span className="text-xs font-bold text-slate-400 tracking-wider">NEXT CHALLENGE</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                  <Play className="w-3 h-3" /> HOT GAMES
                </span>
              </div>

              <div className="lg:space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onPlayGame(rec)}
                    className="group flex gap-3 p-2 bg-slate-900 border border-slate-850 rounded-xl hover:border-indigo-500/30 hover:bg-slate-900/50 transition cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center p-1.5 border border-slate-850 group-hover:scale-105 transition-transform">
                      <div className={`w-full h-full rounded bg-gradient-to-tr ${rec.accentColor} flex items-center justify-center`}>
                        <GameIcon name={rec.iconName} className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-400 transition-colors leading-tight">
                        {rec.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-[9px] text-zinc-500 font-mono">
                        <span className="uppercase font-bold text-indigo-400/80">{rec.category}</span>
                        <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> {rec.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {allGames.length > 5 && (
                <p className="text-[10px] text-slate-600 text-center uppercase tracking-wider mt-4">
                  Scroll/Close to see full list
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
