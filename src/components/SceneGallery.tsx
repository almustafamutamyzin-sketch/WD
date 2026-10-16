import React from 'react';
import { Film, Play, Sparkles } from 'lucide-react';
import { VIDEO_SCENES, VideoScene } from '../data/anthemData';

interface SceneGalleryProps {
  currentTime: number;
  onSeek: (seconds: number) => void;
  onOpenSnapshot: (scene: VideoScene) => void;
}

export const SceneGallery: React.FC<SceneGalleryProps> = ({
  currentTime,
  onSeek,
  onOpenSnapshot,
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-rose-900/40 p-4 md:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-900/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-950 border border-amber-600/40 text-amber-300">
            <Film className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">مشاهد الفيديو كليب السينمائي</h3>
            <p className="text-xs text-slate-400">انقر للتنقل المباشر بين مقاطع النشيد والبيئات المدرسية</p>
          </div>
        </div>
        <span className="text-xs text-rose-300 font-semibold bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800">
          {VIDEO_SCENES.length} مشاهد سينمائية
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {VIDEO_SCENES.map((scene: VideoScene) => {
          const isActive = currentTime >= scene.startTime && currentTime < scene.endTime;

          return (
            <div
              key={scene.id}
              onClick={() => onSeek(scene.startTime)}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'border-amber-400 shadow-lg shadow-amber-900/30 ring-2 ring-amber-400/50 scale-[1.02]'
                  : 'border-slate-800 hover:border-rose-500/50 hover:shadow-md'
              }`}
            >
              {/* Image Preview */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={scene.image}
                  alt={scene.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-black/70 text-slate-200 border border-white/20'
                    }`}
                  >
                    {scene.badge}
                  </span>
                </div>

                {/* Active Indicator / Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="h-10 w-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>
                </div>

                {isActive && (
                  <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 animate-spin" />
                    <span>يعرض الآن</span>
                  </div>
                )}
              </div>

              {/* Scene Content */}
              <div className="p-3 bg-slate-900/95 space-y-1">
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {scene.title}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {scene.description}
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-mono">
                  <span>
                    {Math.floor(scene.startTime / 60)}:
                    {Math.floor(scene.startTime % 60)
                      .toString()
                      .padStart(2, '0')}{' '}
                    -{' '}
                    {Math.floor(scene.endTime / 60)}:
                    {Math.floor(scene.endTime % 60)
                      .toString()
                      .padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSnapshot(scene);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-sans font-medium"
                  >
                    بطاقة تذكارية 📷
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
