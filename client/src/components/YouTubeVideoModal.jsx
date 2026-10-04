import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Play,
  ExternalLink,
  Youtube,
  Link as LinkIcon,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

export const YouTubeVideoModal = ({
  isOpen,
  onClose,
  defaultVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ'
}) => {
  const [videoUrl, setVideoUrl] = useState(() => {
    return localStorage.getItem('setulink_guide_video_url') || defaultVideoUrl;
  });
  const [customInput, setCustomInput] = useState('');
  const [showUrlEditor, setShowUrlEditor] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  // Convert various YouTube link formats to embed URL
  const formatYouTubeEmbed = (url) => {
    if (!url) return defaultVideoUrl;
    let trimmed = url.trim();

    // Already an embed URL
    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed;
    }

    // Standard watch URL: youtube.com/watch?v=ID
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=1`;
    }

    // Shortened URL: youtu.be/ID
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=1`;
    }

    // Embed with params
    return trimmed;
  };

  const handleSaveCustomLink = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const formatted = formatYouTubeEmbed(customInput);
    setVideoUrl(formatted);
    localStorage.setItem('setulink_guide_video_url', formatted);
    setShowUrlEditor(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/30">
              <Youtube className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  SIH 2026 LIVE DEMO
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  System Walkthrough
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                SetuLink Architecture & Live Guide Video
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUrlEditor(!showUrlEditor)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5"
              title="Provide or update YouTube video link"
            >
              <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Change Video Link</span>
              <span className="sm:hidden">Edit Link</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
              title="Close Video"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Link Update Panel (when toggled) */}
        {showUrlEditor && (
          <form
            onSubmit={handleSaveCustomLink}
            className="p-4 bg-amber-50/70 border-b border-amber-200 text-xs flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-top-2 duration-150"
          >
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-amber-900 mb-1 font-mono">
                Paste your YouTube video link or embed URL:
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-mono"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto sm:mt-5">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow transition flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Apply Link</span>
              </button>
              <button
                type="button"
                onClick={() => setShowUrlEditor(false)}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition shrink-0"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Success toast notice */}
        {savedNotice && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>YouTube video link updated and saved successfully!</span>
          </div>
        )}

        {/* 16:9 Responsive Video Player Container */}
        <div className="relative aspect-video w-full bg-slate-950">
          <iframe
            src={videoUrl}
            title="SetuLink Live System Walkthrough"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Modal Footer Description */}
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-800">
              Smart India Hackathon 2026 — Problem Statement SIH26129
            </div>
            <p className="text-slate-500 text-[11px]">
              Complete architecture walk-through: Deterministic Levenshtein matching, DPDP consent revocation, and 3-silo federation.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={videoUrl.replace('/embed/', '/watch?v=')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
            >
              <span>Open in YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-gov-600 hover:bg-gov-500 text-white font-bold text-xs shadow-md transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
