import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Music,
  Sparkles,
  BookOpen,
  Film,
  Camera,
  Heart,
  Share2,
  Volume2,
} from 'lucide-react';
import { VideoPlayer } from './components/VideoPlayer';
import { LyricsKaraoke } from './components/LyricsKaraoke';
import { SceneGallery } from './components/SceneGallery';
import { UniformCard } from './components/UniformCard';
import { AudioUploader } from './components/AudioUploader';
import { SnapshotModal } from './components/SnapshotModal';
import { anthemEngine } from './services/audioSynth';
import { AnthemStudyGuide } from './components/AnthemStudyGuide';
import { VIDEO_SCENES, ANTHEM_LYRICS, VideoScene, LyricLine } from './data/anthemData';

export default function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEnglish, setShowEnglish] = useState(true);
  const [singAlongMode, setSingAlongMode] = useState(false);
  const [snapshotScene, setSnapshotScene] = useState<VideoScene | null>(null);
  const [snapshotLyric, setSnapshotLyric] = useState<LyricLine | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);

  useEffect(() => {
    anthemEngine.onTimeUpdate((time) => {
      setCurrentTime(time);
    });

    anthemEngine.onStateChange((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      anthemEngine.pause();
    } else {
      anthemEngine.play();
    }
  };

  const handleSeek = (seconds: number) => {
    anthemEngine.seek(seconds);
    setCurrentTime(seconds);
  };

  const handleOpenSnapshot = (scene: VideoScene, lyric?: LyricLine | null) => {
    setSnapshotScene(scene);
    setSnapshotLyric(
      lyric ||
        ANTHEM_LYRICS.find((l) => scene.startTime >= l.startTime && scene.startTime < l.endTime) ||
        null
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-cairo">
      {/* Top Golden & Burgundy Ribbon Header */}
      <header className="relative bg-gradient-to-r from-rose-950 via-slate-950 to-rose-950 border-b border-rose-900/50 shadow-2xl sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & School Title */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-900 to-amber-700 flex items-center justify-center shadow-lg border border-amber-400/50 text-amber-200 font-extrabold text-base tracking-wider">
              الود
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg md:text-xl font-black text-white tracking-wide">
                  مدرسة الود الأساسية الأهلية
                </h1>
                <span className="text-[10px] sm:text-xs font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                  معايير دولية
                </span>
              </div>
              <p className="text-xs text-rose-300 font-medium">
                فيديو كليب كورال التلاميذ: «بالودِّ نبني… وبالعلم نسمو»
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSingAlongMode(!singAlongMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                singAlongMode
                  ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-950/60'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
            >
              <Music className="h-3.5 w-3.5 text-amber-300" />
              <span className="hidden sm:inline">
                {singAlongMode ? 'النمط السينمائي' : 'نمط الإنشاد والغناء'}
              </span>
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/50 border border-rose-400/50 transition-transform active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5 fill-current" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>تشغيل الكليب</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with Iraqi Spirit & Welcome */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950 border-b border-rose-950/60 py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-rose-950/70 border border-rose-700/50 px-3 py-1 rounded-full text-xs text-rose-200 font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>إهداء إلى براعم وأسرة مدرسة الود الأساسية في بغداد</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white font-amiri leading-snug">
                «بالودِّ نبني، بالعلمِ نسمو .. وبحبِّ بغدادَ نعلو ونحلو»
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                كليب غنائي وتربوي متكامل يجسد الزي الرسمي الأنيق لمدرسة الود (البيريه الخمري والسترة الخمرية والقميص الأزرق)، ويعزز قيم المحبة والتفوق والانتماء للعراق.
              </p>
            </div>

            {/* Stats Badges */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-900/90 border border-rose-900/40 p-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-lg font-black text-amber-300 font-mono">03:48</span>
                <span className="text-[11px] text-slate-400">مدة النشيد</span>
              </div>
              <div className="bg-slate-900/90 border border-rose-900/40 p-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-lg font-black text-rose-400 font-mono">39</span>
                <span className="text-[11px] text-slate-400">بيتاً ومقطعاً</span>
              </div>
              <div className="bg-slate-900/90 border border-rose-900/40 p-3 rounded-2xl text-center min-w-[90px]">
                <span className="block text-lg font-black text-emerald-400 font-mono">6</span>
                <span className="text-[11px] text-slate-400">مشاهد كليب</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Row 1: The Video Player (Primary Focus) and Synchronized Lyrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Video Player Column */}
          <div id="video-player-container" className="lg:col-span-8 space-y-4">
            <VideoPlayer
              currentTime={currentTime}
              isPlaying={isPlaying}
              onSeek={handleSeek}
              onTogglePlay={handleTogglePlay}
              onOpenSnapshot={handleOpenSnapshot}
              showEnglish={showEnglish}
              onToggleEnglish={() => setShowEnglish(!showEnglish)}
              singAlongMode={singAlongMode}
              onToggleSingAlong={() => setSingAlongMode(!singAlongMode)}
            />

            {/* Quick Scene Jump Timeline */}
            <div className="bg-slate-900/80 p-3 rounded-xl border border-rose-900/30 flex items-center justify-between gap-2 overflow-x-auto text-xs">
              <span className="text-slate-400 font-semibold shrink-0">محطات النشيد:</span>
              <div className="flex items-center gap-2">
                {VIDEO_SCENES.map((s) => {
                  const isCurrent = currentTime >= s.startTime && currentTime < s.endTime;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSeek(s.startTime)}
                      className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors font-medium ${
                        isCurrent
                          ? 'bg-rose-700 text-amber-200 border border-rose-400 shadow-sm'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {s.badge}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Synchronized Karaoke Column */}
          <div className="lg:col-span-4 h-[440px] md:h-[500px] lg:h-[530px]">
            <LyricsKaraoke
              currentTime={currentTime}
              onSeek={handleSeek}
              showEnglish={showEnglish}
            />
          </div>
        </div>

        {/* Navigation Section Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 p-1.5 bg-slate-900/90 rounded-2xl border border-rose-900/40 max-w-2xl mx-auto shadow-lg">
          <a
            href="#video-section"
            className="flex-1 py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm font-bold bg-rose-900/80 hover:bg-rose-800 text-white transition-all shadow border border-rose-500/40"
          >
            🎬 مشاهد الكليب
          </a>
          <a
            href="#study-guide-section"
            className="flex-1 py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm font-bold bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 transition-all border border-amber-500/30"
          >
            📖 شرح النشيد والترجمة
          </a>
          <a
            href="#uniform-section"
            className="flex-1 py-2.5 px-3 rounded-xl text-center text-xs sm:text-sm font-bold bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700"
          >
            🎓 الزي وهوية المدرسة
          </a>
        </div>

        {/* Row 2: Cinematic Video Scenes Showcase */}
        <div id="video-section">
          <SceneGallery
            currentTime={currentTime}
            onSeek={handleSeek}
            onOpenSnapshot={handleOpenSnapshot}
          />
        </div>

        {/* Row 3: Anthem Study Guide, Imagery & Translation */}
        <div id="study-guide-section">
          <AnthemStudyGuide
            onSeekToVerse={(startTime) => {
              handleSeek(startTime);
              if (!isPlaying) {
                anthemEngine.play();
              }
              const playerEl = document.getElementById('video-player-container');
              if (playerEl) {
                playerEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        </div>

        {/* Row 4: School Uniform & Institutional Vision Card */}
        <div id="uniform-section">
          <UniformCard />
        </div>

        {/* Row 5: Audio Source & MP3 Uploader / Accompaniment Synth */}
        <AudioUploader
          onAudioLoaded={(fname) => setCustomAudioName(fname)}
          isCustomLoaded={!!customAudioName}
          customName={customAudioName}
        />
      </main>

      {/* Snapshot Modal */}
      {snapshotScene && (
        <SnapshotModal
          scene={snapshotScene}
          lyric={snapshotLyric}
          onClose={() => setSnapshotScene(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-rose-900/40 py-6 text-center text-xs text-slate-400 mt-12 space-y-2">
        <div className="flex items-center justify-center gap-2 text-rose-300 font-semibold text-sm">
          <span>مدرسة الود الأساسية الأهلية</span>
          <span>•</span>
          <span>معايير دولية</span>
          <span>•</span>
          <span>بغداد — العراق</span>
        </div>
        <p className="text-slate-500">
          «بالودِّ نبني، بالعلمِ نسمو .. وبحبِّ بغدادَ نعلو ونحلو» — نشيد المحبة والعلم والوطن
        </p>
      </footer>
    </div>
  );
}
