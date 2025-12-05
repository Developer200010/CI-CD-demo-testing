import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiRefreshCw, FiLoader } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function App() {
  const [moods, setMoods] = useState([]);
  const [text, setText] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [addingMood, setAddingMood] = useState(false);

  const fetchMoods = async () => {
    setLoadingInitial(true);
    try {
      const res = await fetch(`${API_URL}/api/moods`);
      const data = await res.json();
      setMoods(data);
    } catch (err) {
      console.error('Failed to fetch moods', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    fetchMoods();
  }, []);

  const handleAddMood = async (e) => {
    e.preventDefault();
    if (!text.trim() || addingMood) return;

    const clientId = `temp-${Date.now()}`;
    const optimisticMood = {
      id: clientId,
      text,
      createdAt: new Date().toISOString(),
      _optimistic: true,
    };

    // Optimistic update: show immediately
    setMoods((prev) => [optimisticMood, ...prev]);
    setText('');
    setAddingMood(true);

    try {
      const res = await fetch(`${API_URL}/api/moods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: optimisticMood.text }),
      });

      const newMood = await res.json();

      if (res.ok) {
        // Replace optimistic mood with real one from backend
        setMoods((prev) =>
          prev.map((m) => (m.id === clientId ? newMood : m))
        );
      } else {
        console.error('Error creating mood', newMood);
        // Remove optimistic mood on error
        setMoods((prev) => prev.filter((m) => m.id !== clientId));
      }
    } catch (err) {
      console.error('Failed to create mood', err);
      setMoods((prev) => prev.filter((m) => m.id !== clientId));
    } finally {
      setAddingMood(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-xl bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-[0_22px_60px_rgba(0,0,0,0.65)] border border-slate-800/80 p-6 md:p-8"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 tracking-tight">
              Mood Board
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Capture quick snapshots of how you&apos;re feeling.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={fetchMoods}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <FiRefreshCw className="text-[13px]" />
            Refresh
          </motion.button>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleAddMood}
          className="flex flex-col sm:flex-row gap-3 mb-6"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <motion.div
            className="relative flex-1"
            whileFocus={{ scale: 1.01 }}
          >
            <input
              className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/80 focus:border-indigo-500/80 transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a mood: calm, excited, overwhelmed..."
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              ✍️
            </span>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!text.trim() || addingMood}
            whileHover={{ scale: !text.trim() || addingMood ? 1 : 1.03 }}
            whileTap={{ scale: !text.trim() || addingMood ? 1 : 0.96 }}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-all
              ${
                !text.trim() || addingMood
                  ? 'bg-slate-700/70 text-slate-300 cursor-not-allowed'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white'
              }`}
          >
            {addingMood ? (
              <>
                <FiLoader className="animate-spin text-sm" />
                Saving…
              </>
            ) : (
              <>
                <FiPlus className="text-sm" />
                Add mood
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Content */}
        {loadingInitial ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <motion.div
              className="h-7 w-7 rounded-full border-[2.5px] border-slate-600 border-t-indigo-400"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
            />
            <span className="text-xs text-slate-300">
              Loading your moods…
            </span>
          </div>
        ) : moods.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-10 gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-slate-300">
              No moods yet. Start with the first one ✨
            </p>
            <p className="text-xs text-slate-500">
              Think &quot;How would I describe this moment in one line?&quot;
            </p>
          </motion.div>
        ) : (
          <motion.ul
            className="space-y-3 max-h-80 overflow-y-auto pr-1"
            initial={false}
          >
            <AnimatePresence initial={false}>
              {moods.map((mood) => (
                <motion.li
                  key={mood.id}
                  layout="position"
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="group rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 shadow-sm hover:border-indigo-500/70 hover:bg-slate-900/90 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-slate-50 leading-snug">
                      {mood.text}
                    </p>
                    {mood._optimistic && (
                      <span className="text-[10px] text-indigo-300/80">
                        syncing…
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(mood.createdAt).toLocaleString()}</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      • captured mood
                    </span>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </motion.div>
    </div>
  );
}

export default App;
