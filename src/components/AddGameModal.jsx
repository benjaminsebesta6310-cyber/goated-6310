import React, { useState } from 'react';
import { X, Plus, Gamepad2, Swords, Flame, Compass, ShieldAlert, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GRADIENTS = [
  { label: 'Cyan Plasma', value: 'from-cyan-400 to-blue-600' },
  { label: 'Solar Flares', value: 'from-orange-400 to-yellow-600' },
  { label: 'Royal Amethyst', value: 'from-indigo-500 to-violet-700' },
  { label: 'Toxic Forest', value: 'from-green-500 to-emerald-700' },
  { label: 'Magma Reactor', value: 'from-red-600 to-rose-950' },
  { label: 'Neon Cyber', value: 'from-purple-600 to-pink-800' }
];

const ICONS = [
  { name: 'Gamepad2', description: 'Classic Controller' },
  { name: 'Swords', description: 'Action/Battle' },
  { name: 'Flame', description: 'Hot Arcade' },
  { name: 'Compass', description: 'RPG/Adventure' },
  { name: 'ShieldAlert', description: 'Logic/Strategy' },
  { name: 'Layers', description: 'Block Puzzle' },
  { name: 'Activity', description: 'Precision reflex' }
];

export default function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [category, setCategory] = useState('Arcade');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [developer, setDeveloper] = useState('');
  const [accentColor, setAccentColor] = useState(GRADIENTS[0].value);
  const [iconName, setIconName] = useState(ICONS[0].name);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !iframeUrl.trim()) {
      setError('Title and Game URL/Iframe path are required!');
      return;
    }

    // Basic URL validation
    let parsedUrl = iframeUrl;
    if (!iframeUrl.startsWith('http://') && !iframeUrl.startsWith('https://') && !iframeUrl.startsWith('//')) {
      parsedUrl = `https://${iframeUrl}`;
    }

    try {
      new URL(parsedUrl.startsWith('//') ? `https:${parsedUrl}` : parsedUrl);
    } catch (_) {
      setError('Please provide a valid URL link (e.g. google.com or github.io)!');
      return;
    }

    const newGame = {
      id: `user-${Date.now()}`,
      title: title.trim(),
      iframeUrl: parsedUrl.trim(),
      category: category,
      description: description.trim() || 'A custom unblocked game imported and hosted inside the local arcade sandbox.',
      controls: controls.trim() || 'Standard mouse clicks or keyboard arrow keys.',
      developer: developer.trim() || 'Custom Added',
      accentColor: accentColor,
      iconName: iconName,
      rating: 4.5,
      isUserAdded: true
    };

    onAddGame(newGame);
    onClose();

    // Reset fields
    setTitle('');
    setIframeUrl('');
    setCategory('Arcade');
    setDescription('');
    setControls('');
    setDeveloper('');
    setAccentColor(GRADIENTS[0].value);
    setIconName(ICONS[0].name);
  };

  return (
    <AnimatePresence>
      <div id="add-game-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg overflow-y-auto max-h-[90vh] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 text-slate-200"
        >
          {/**************** Header ***************/}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="text-lg font-mono font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" /> IMPORT UNBLOCKED GAME
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/40 text-red-400 text-xs font-mono rounded">
              {error}
            </div>
          )}

          {/**************** Form Content ***************/}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                Game Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Minecraft Classic / Slope Proxy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={40}
                className="w-full px-3 py-2 bg-slate-950 font-mono text-sm border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                Game Source / Iframe URL *
              </label>
              <input
                type="text"
                placeholder="e.g. https://example.github.io/mygame/"
                value={iframeUrl}
                onChange={(e) => setIframeUrl(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 font-mono text-xs border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block leading-tight font-sans">
                Make sure the host allows Iframe embedding (standard GitHub Pages, itch.io, or unblocked gaming repos are safe).
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 font-mono text-sm border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition"
                >
                  <option value="Arcade">Arcade</option>
                  <option value="Retro">Retro</option>
                  <option value="Puzzle">Puzzle</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Casual">Casual</option>
                  <option value="Adventure">Adventure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                  Developer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Open Source / Mod"
                  value={developer}
                  onChange={(e) => setDeveloper(e.target.value)}
                  maxLength={30}
                  className="w-full px-3 py-2 bg-slate-950 font-mono text-sm border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                Game Description
              </label>
              <textarea
                placeholder="Brief summary of how to play, backstory, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 font-mono text-sm border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                Player Controls
              </label>
              <input
                type="text"
                placeholder="e.g. Arrow Keys to move, WASD for action"
                value={controls}
                onChange={(e) => setControls(e.target.value)}
                maxLength={100}
                className="w-full px-3 py-2 bg-slate-950 font-mono text-sm border border-slate-800 rounded focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/**************** Theme Tuning Gradients ***************/}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                Card Theme Gradient
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GRADIENTS.map((grad) => (
                  <button
                    key={grad.value}
                    type="button"
                    onClick={() => setAccentColor(grad.value)}
                    className={`px-2 py-1.5 text-[10px] font-mono rounded tracking-tight border text-left transition select-none flex items-center justify-between cursor-pointer ${
                      accentColor === grad.value
                        ? 'bg-slate-950 border-cyan-400 text-white font-bold'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{grad.label}</span>
                    <span className={`w-3 h-3 rounded bg-gradient-to-tr ${grad.value} border border-white/20`}></span>
                  </button>
                ))}
              </div>
            </div>

            {/**************** Icon Picking Grid ***************/}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-bold">
                Pick Gaming Icon
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {ICONS.map((ic) => {
                  let IconClass = Gamepad2;
                  if (ic.name === 'Swords') IconClass = Swords;
                  else if (ic.name === 'Flame') IconClass = Flame;
                  else if (ic.name === 'Compass') IconClass = Compass;
                  else if (ic.name === 'ShieldAlert') IconClass = ShieldAlert;
                  else if (ic.name === 'Layers') IconClass = Layers;
                  else if (ic.name === 'Activity') IconClass = Activity;

                  return (
                    <button
                      key={ic.name}
                      type="button"
                      onClick={() => setIconName(ic.name)}
                      title={ic.description}
                      className={`p-2.5 rounded border transition flex justify-center items-center cursor-pointer ${
                        iconName === ic.name
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <IconClass className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-950 text-slate-400 hover:text-white font-mono text-xs border border-slate-850 rounded hover:bg-slate-900 transition"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold rounded shadow-lg transition cursor-pointer"
              >
                SAVE TO HUB
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
