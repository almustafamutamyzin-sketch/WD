import React, { useEffect, useRef, useState } from 'react';
import { Play, Sparkles, BookOpen, Check } from 'lucide-react';
import { ANTHEM_LYRICS, VIDEO_SCENES, LyricLine } from '../data/anthemData';

interface LyricsKaraokeProps {
  currentTime: number;
  onSeek: (time: number) => void;
  showEnglish: boolean;
}

export const LyricsKaraoke: React.FC<LyricsKaraokeProps> = ({
  currentTime,
  onSeek,
  showEnglish,
}) => {
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);

  // Active line
  const activeLyric =
    ANTHEM_LYRICS.find((l) => currentTime >= l.startTime && currentTime < l.endTime) || null;

  // Auto-scroll to active lyric smoothly
  useEffect(() => {
    if (autoScroll && activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeLyric?.id, autoScroll]);

  const copyFullLyrics = () => {
    const fullText = ANTHEM_LYRICS.map(
      (l) => `${l.arabicText}${l.englishText ? `\n(${l.englishText})` : ''}`
    ).join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-rose-900/40 p-4 md:p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-rose-900/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-950 border border-rose-600/40 text-rose-300">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              كلمات نشيد مدرسة الود
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                متزامن
              </span>
            </h3>
            <p className="text-xs text-slate-400">انقر على أي بيت للانتقال إليه مباشرة في الفيديو</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              autoScroll
                ? 'bg-rose-900/60 text-rose-200 border-rose-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            تتبع تلقائي: {autoScroll ? 'مفعّل' : 'متوقف'}
          </button>

          {/* Copy Lyrics */}
          <button
            onClick={copyFullLyrics}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs flex items-center gap-1 transition-colors"
            title="نسخ كلمات النشيد كاملة"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300 text-[11px]">تم النسخ</span>
              </>
            ) : (
              <span className="text-[11px]">نسخ الكلمات</span>
            )}
          </button>
        </div>
      </div>

      {/* Synchronized Lyrics List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto space-y-2.5 py-4 pr-1 pl-2 text-right"
      >
        {ANTHEM_LYRICS.map((line: LyricLine) => {
          const isActive = activeLyric?.id === line.id;
          const isPassed = currentTime > line.endTime;
          const scene = VIDEO_SCENES[line.sceneIndex] || VIDEO_SCENES[0];

          return (
            <div
              key={line.id}
              ref={isActive ? activeLineRef : null}
              onClick={() => onSeek(line.startTime)}
              className={`group relative p-3.5 rounded-xl cursor-pointer transition-all duration-300 border ${
                isActive
                  ? 'bg-gradient-to-r from-rose-950/90 via-rose-900/60 to-amber-950/60 border-rose-500/70 shadow-lg shadow-rose-950/50 scale-[1.01]'
                  : isPassed
                  ? 'bg-slate-900/40 hover:bg-slate-850/60 border-white/5 opacity-75'
                  : 'bg-slate-850/40 hover:bg-slate-800/60 border-white/5'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute right-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-amber-400 to-rose-500 rounded-l-full shadow-md" />
              )}

              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                      isActive
                        ? 'bg-rose-800 text-amber-200 border-rose-400/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {line.performer}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    {scene.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] font-mono text-slate-400">
                    {Math.floor(line.startTime / 60)}:
                    {Math.floor(line.startTime % 60)
                      .toString()
                      .padStart(2, '0')}
                  </span>
                  <Play className="h-3 w-3 text-rose-400 group-hover:text-amber-300" />
                </div>
              </div>

              {/* Arabic Lyric Line */}
              <p
                className={`text-base md:text-lg font-amiri font-bold leading-relaxed transition-colors ${
                  isActive
                    ? 'text-amber-100 font-extrabold text-lg md:text-xl'
                    : isPassed
                    ? 'text-slate-300'
                    : 'text-slate-200'
                }`}
              >
                {line.arabicText}
              </p>

              {/* English translation if enabled */}
              {showEnglish && line.englishText && (
                <p
                  className={`text-xs md:text-sm font-sans italic mt-1 ${
                    isActive ? 'text-amber-300' : 'text-slate-400'
                  }`}
                  dir="ltr"
                >
                  {line.englishText}
                </p>
              )}

              {isActive && (
                <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-300/80">
                  <Sparkles className="h-3 w-3 text-amber-400 animate-spin" />
                  <span>ينشد الآن في الكليب</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
