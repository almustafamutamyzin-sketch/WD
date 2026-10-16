import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Camera,
  Music,
  SkipBack,
  SkipForward,
  Mic,
  MicOff,
  Languages,
} from 'lucide-react';
import { VIDEO_SCENES, ANTHEM_LYRICS, VideoScene, LyricLine } from '../data/anthemData';
import { anthemEngine } from '../services/audioSynth';
import { AudioVisualizer } from './AudioVisualizer';

interface VideoPlayerProps {
  currentTime: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  onTogglePlay: () => void;
  onOpenSnapshot: (scene: VideoScene, lyric: LyricLine | null) => void;
  showEnglish: boolean;
  onToggleEnglish: () => void;
  singAlongMode: boolean;
  onToggleSingAlong: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentTime,
  isPlaying,
  onSeek,
  onTogglePlay,
  onOpenSnapshot,
  showEnglish,
  onToggleEnglish,
  singAlongMode,
  onToggleSingAlong,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Find active scene
  const activeScene =
    VIDEO_SCENES.find((s) => currentTime >= s.startTime && currentTime < s.endTime) ||
    VIDEO_SCENES[0];

  // Find active lyric line
  const activeLyric =
    ANTHEM_LYRICS.find((l) => currentTime >= l.startTime && currentTime < l.endTime) || null;

  // Trigger confetti during the chorus drops
  const lastConfettiTriggerRef = useRef<number>(-1);
  useEffect(() => {
    // Chorus 1 starts at 45s, Finale starts at 194s
    const chorusTimes = [45, 194];
    for (const ct of chorusTimes) {
      if (Math.abs(currentTime - ct) < 0.8 && lastConfettiTriggerRef.current !== ct) {
        lastConfettiTriggerRef.current = ct;
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#fbbf24', '#e11d48', '#ffffff', '#10b981'],
          });
        } catch {
          // Ignore
        }
      }
    }
  }, [currentTime]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    anthemEngine.setVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = anthemEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    anthemEngine.setPlaybackRate(speed);
  };

  const handleToggleMic = async () => {
    if (isRecordingMic) {
      const blob = anthemEngine.stopMicRecording();
      setIsRecordingMic(false);
      if (blob) {
        alert('تم حفظ تسجيل صوتك بنجاح! يمكنك الاستماع إلى غنائك مع النشيد.');
      }
    } else {
      const ok = await anthemEngine.startMicRecording();
      if (ok) {
        setIsRecordingMic(true);
      }
    }
  };

  const triggerSparkles = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 90,
        origin: { y: 0.7 },
        colors: ['#ffd700', '#c2410c', '#ec4899', '#ffffff'],
      });
    } catch {
      // Ignore
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalDuration = anthemEngine.getDuration() || 228;
  const progressPercent = Math.min(100, Math.max(0, (currentTime / totalDuration) * 100));

  // Auto-hide controls when playing and inactive
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 4000);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetControlsTimeout}
      onTouchStart={resetControlsTimeout}
      className={`group relative overflow-hidden rounded-2xl bg-black border border-rose-900/40 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'w-screen h-screen rounded-none' : 'w-full aspect-video'
      }`}
    >
      {/* Background Cinematic Video Scene */}
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <img
          key={activeScene.id}
          src={activeScene.image}
          alt={activeScene.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-all duration-1000 ease-out animate-kenburns-1 filter brightness-90 contrast-105"
        />

        {/* Ambient lighting overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/75 pointer-events-none" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/85 pointer-events-none" />

        {/* Stage lighting beams (simulated concert glow) */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Header Overlay: School Branding & Active Badge */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 md:opacity-40 hover:opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* School Emblem Badge */}
          <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-rose-500/30 shadow-lg">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-700 via-rose-900 to-amber-700 flex items-center justify-center shadow-inner text-amber-200 font-bold border border-amber-400/40 text-sm">
              الود
            </div>
            <div>
              <h2 className="text-sm md:text-base font-bold text-white tracking-wide flex items-center gap-2">
                مدرسة الود الأساسية الأهلية
                <span className="hidden sm:inline-block text-[10px] bg-rose-900/80 text-rose-200 px-2 py-0.5 rounded-full border border-rose-400/40">
                  معايير دولية
                </span>
              </h2>
              <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5">
                <span>بغداد — العراق</span>
                <span>•</span>
                <span>«بالودِّ نبني… وبالعلم نسمو»</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Badges: Current Section & Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Active Scene Badge */}
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 text-xs md:text-sm font-semibold flex items-center gap-1.5 shadow-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{activeScene.badge}</span>
          </div>

          {/* Snapshot Button */}
          <button
            onClick={() => onOpenSnapshot(activeScene, activeLyric)}
            title="التقاط بطاقة تذكارية للمشهد"
            className="p-2 rounded-xl bg-black/50 hover:bg-rose-900/60 backdrop-blur-md border border-white/10 hover:border-rose-400/50 text-white transition-all shadow-md"
          >
            <Camera className="h-4 w-4 text-amber-200" />
          </button>
        </div>
      </div>

      {/* Center Display: Sing-Along Karaoke Mode or Dynamic Lyrics */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-12 z-10 pointer-events-none">
        {singAlongMode ? (
          /* Prominent Sing-Along View */
          <div className="max-w-3xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-rose-950/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-lg">
              <Music className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
              <span>نمط الإنشاد والغناء الجماعي (Karaoke)</span>
            </div>

            {activeLyric ? (
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white font-amiri tracking-wide leading-relaxed animate-pulse-glow drop-shadow-2xl">
                  {activeLyric.arabicText}
                </h1>
                {showEnglish && activeLyric.englishText && (
                  <p className="text-sm md:text-lg text-amber-300 font-medium italic drop-shadow-md">
                    {activeLyric.englishText}
                  </p>
                )}
                <div className="inline-block mt-2 px-3 py-1 bg-black/40 backdrop-blur-xs rounded-full border border-amber-400/30 text-amber-200 text-xs">
                  🎙️ {activeLyric.performer}
                </div>
              </div>
            ) : (
              <h2 className="text-2xl md:text-3xl font-bold text-amber-100 font-cairo">
                «بالودِّ نبني… وبالعلم نسمو»
              </h2>
            )}
          </div>
        ) : (
          /* Subtle Cinematic Lower-Third Lyrics */
          <div className="absolute bottom-24 md:bottom-28 left-4 right-4 md:left-12 md:right-12 text-center pointer-events-auto">
            {activeLyric && (
              <div className="inline-block max-w-4xl bg-black/75 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-rose-500/40 shadow-2xl text-center transition-all duration-300">
                <div className="flex items-center justify-center gap-2 text-rose-300 text-xs mb-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>{activeLyric.performer}</span>
                  <span>•</span>
                  <span>{activeScene.title}</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-amber-100 font-amiri tracking-wide leading-relaxed">
                  {activeLyric.arabicText}
                </p>
                {showEnglish && activeLyric.englishText && (
                  <p className="text-xs md:text-sm text-amber-300/90 font-sans italic mt-1">
                    {activeLyric.englishText}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Video Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-gradient-to-t from-black via-black/85 to-transparent z-30 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 md:opacity-20 hover:opacity-100'
        }`}
      >
        {/* Progress Scrub Bar */}
        <div className="space-y-1.5 mb-2">
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              onSeek(ratio * totalDuration);
            }}
            className="group/bar relative h-2.5 w-full bg-slate-800/80 hover:h-3.5 rounded-full cursor-pointer transition-all overflow-hidden border border-white/10"
          >
            {/* Filled Progress */}
            <div
              className="h-full bg-gradient-to-r from-rose-700 via-rose-500 to-amber-400 rounded-full relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md border-2 border-rose-600 scale-0 group-hover/bar:scale-100 transition-transform" />
            </div>

            {/* Chapter Break Marks */}
            {VIDEO_SCENES.map((scene) => {
              const markPercent = (scene.startTime / totalDuration) * 100;
              return (
                <div
                  key={scene.id}
                  title={`${scene.badge}: ${scene.title}`}
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400/60 hover:w-1 hover:bg-amber-300 transition-all z-10"
                  style={{ left: `${markPercent}%` }}
                />
              );
            })}
          </div>

          {/* Time & Chapter Indicators */}
          <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-amber-300 font-bold">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(totalDuration)}</span>
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-rose-300 font-sans hidden sm:inline">{activeScene.title}</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Audio Visualizer Mini */}
              <AudioVisualizer isPlaying={isPlaying} />
            </div>
          </div>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Left Actions: Play, Skip, Replay */}
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlay}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-900/40 border border-rose-400/50 hover:scale-105 active:scale-95 transition-all"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل النشيد'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current mr-0.5" />
              )}
            </button>

            {/* 10s Backward */}
            <button
              onClick={() => onSeek(currentTime - 10)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              title="تراجع 10 ثوانٍ"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            {/* 10s Forward */}
            <button
              onClick={() => onSeek(currentTime + 10)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              title="تقديم 10 ثوانٍ"
            >
              <SkipForward className="h-4 w-4" />
            </button>

            {/* Replay */}
            <button
              onClick={() => onSeek(0)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors hidden sm:block"
              title="إعادة النشيد من البداية"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={handleToggleMute}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-20 accent-rose-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Actions: Sing-along, English subtitles, Speed, Confetti, Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sing-along toggle */}
            <button
              onClick={onToggleSingAlong}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border ${
                singAlongMode
                  ? 'bg-rose-700 text-white border-rose-400 shadow-md shadow-rose-900/30'
                  : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
              }`}
              title="تبديل نمط الإنشاد والغناء الجماعي"
            >
              <Music className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden md:inline">نمط الغناء</span>
            </button>

            {/* English Subtitles Toggle */}
            <button
              onClick={onToggleEnglish}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border ${
                showEnglish
                  ? 'bg-amber-600/80 text-white border-amber-400 shadow-md shadow-amber-900/30'
                  : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
              }`}
              title="تبديل الترجمة الإنجليزية"
            >
              <Languages className="h-3.5 w-3.5" />
              <span className="hidden md:inline">English</span>
            </button>

            {/* Microphone recorder */}
            <button
              onClick={handleToggleMic}
              className={`p-2 rounded-lg text-xs transition-all border ${
                isRecordingMic
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
              }`}
              title={isRecordingMic ? 'إيقاف تسجيل صوتك' : 'سجّل صوتك وأنت تنشد النشيد'}
            >
              {isRecordingMic ? (
                <MicOff className="h-4 w-4 text-white" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>

            {/* Playback Speed selector */}
            <div className="flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10 text-xs">
              {[0.75, 1, 1.25].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-rose-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Confetti Trigger */}
            <button
              onClick={triggerSparkles}
              className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 transition-colors"
              title="إطلاق ألعاب نارية واحتفال"
            >
              <Sparkles className="h-4 w-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
              title={isFullscreen ? 'الخروج من الشاشة الكاملة' : 'شاشة كاملة'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
