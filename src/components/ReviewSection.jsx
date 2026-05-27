import React, { useState, useEffect } from 'react';
import { Star, MessageSquareCode, Send, Trash, User } from 'lucide-react';

const DEFAULT_USERNAMES = [
  'pixel_slayer', 'retro_enjoyer', 'giga_clicker', 
  'unblocked_pro', 'lobby_boss', 'cool_gamer42',
  'cyber_ninja', 'tetris_god', 'dino_jump99'
];

export default function ReviewSection({ gameId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');

  // Synchronize reviews from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`arcade-reviews-${gameId}`);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (_) {
        setReviews(getSpontaneousInitialReviews(gameId));
      }
    } else {
      const initial = getSpontaneousInitialReviews(gameId);
      localStorage.setItem(`arcade-reviews-${gameId}`, JSON.stringify(initial));
      setReviews(initial);
    }

    // Set a random funny gaming username
    setUserName(DEFAULT_USERNAMES[Math.floor(Math.random() * DEFAULT_USERNAMES.length)]);
  }, [gameId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview = {
      id: `review-${Date.now()}`,
      gameId: gameId,
      rating: rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      userName: userName
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`arcade-reviews-${gameId}`, JSON.stringify(updated));
    setComment('');
    // Trigger random username update
    setUserName(DEFAULT_USERNAMES[Math.floor(Math.random() * DEFAULT_USERNAMES.length)]);
  };

  const handleDelete = (id) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem(`arcade-reviews-${gameId}`, JSON.stringify(updated));
  };

  return (
    <div id={`micro-reviews-${gameId}`} className="border-t border-slate-800/80 pt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquareCode className="w-5 h-5 text-indigo-400" />
        <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
          Player Reviews &amp; Chat ({reviews.length})
        </h4>
      </div>

      {/* Review creator form */}
      <form onSubmit={handleSubmit} className="bg-slate-950 p-4 rounded-xl border border-slate-900 mb-6 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 uppercase">Poster name:</span>
            <span className="text-xs text-cyan-400 font-bold flex items-center gap-1 bg-cyan-950/20 border border-cyan-800/20 px-2 py-0.5 rounded">
              <User className="w-3 h-3" /> {userName}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase mr-1">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="hover:scale-115 transition-transform"
              >
                <Star
                  className={`w-4 h-4 cursor-pointer ${
                    star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Write a tip, review, or high score boast..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={150}
            className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-lg text-xs focus:outline-none focus:border-indigo-500 transition"
            id="review-comment-field"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Reviews feed */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {reviews.length === 0 ? (
          <p className="text-center text-xs text-slate-600 font-mono py-6">
            No public reviews yet. Be the first to leave a feedback!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3 bg-slate-950/45 border border-slate-900/60 rounded-xl flex items-start justify-between gap-3 font-mono text-xs hover:border-slate-800/60 transition"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5">
                  <span className="text-slate-300 font-bold font-mono">{rev.userName}</span>
                  <span className="text-[10px] text-slate-600">({rev.date})</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-400 leading-tight font-sans text-xs">{rev.comment}</p>
              </div>

              {/* Delete trigger for micro chats if user added them */}
              {rev.id.startsWith('review-') && (
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="text-slate-600 hover:text-red-400 p-1 rounded transition self-center"
                  title="Remove Comment"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Generate fun default reviews to populate each game on first launch
function getSpontaneousInitialReviews(gameId) {
  const genericReviews = [
    {
      comment: "100% unblocked at school! Thank god, plays perfectly on Chromebooks.",
      names: ["chrome_surfer", "school_hacker", "vpn_master"]
    },
    {
      comment: "Super nostalgic. This unblocked player is extremely fast.",
      names: ["giga_retro", "flash_rip", "arcade_fanatic"]
    },
    {
      comment: "Got a premium high score inside this portal! Highly recommended.",
      names: ["click_wizard", "perfect_play", "speedy_hands"]
    }
  ];

  // Pick 1-2 random mock reviews derived from seed
  const total = Math.floor((Math.abs(hashString(gameId)) % 2) + 1);
  const result = [];

  for (let idx = 0; idx < total; idx++) {
    const revTemplate = genericReviews[(hashString(gameId) + idx) % genericReviews.length];
    const username = revTemplate.names[(hashString(gameId) * 31 + idx) % revTemplate.names.length];
    result.push({
      id: `initial-${gameId}-${idx}`,
      gameId: gameId,
      rating: 5 - (idx % 2),
      comment: revTemplate.comment,
      date: "May 26, 2026",
      userName: username
    });
  }

  return result;
}

// Simple hash string helper
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}
