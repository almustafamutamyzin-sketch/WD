import React, { useRef, useState } from 'react';
import { Upload, Music, CheckCircle2, Mic, Info } from 'lucide-react';
import { anthemEngine } from '../services/audioSynth';

interface AudioUploaderProps {
  onAudioLoaded: (filename: string) => void;
  isCustomLoaded: boolean;
  customName: string | null;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioLoaded,
  isCustomLoaded,
  customName,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|m4a|wav|ogg|aac)$/i)) {
      alert('يرجى اختيار ملف صوتي صالح (MP3, M4A, WAV)');
      return;
    }
    anthemEngine.setCustomAudioFile(file);
    onAudioLoaded(file.name);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-rose-900/40 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-rose-900/30">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-950 border border-rose-600/40 text-rose-300">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">مصدر الصوت والموسيقى</h3>
            <p className="text-xs text-slate-400">
              يمكنك الاستماع للتوزيع الأوركسترالي المدمج، أو رفع التسجيل الصوتي المباشر للتلاميذ
            </p>
          </div>
        </div>

        {isCustomLoaded ? (
          <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-xs px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>ملف مرفوع مفعّل</span>
          </span>
        ) : (
          <span className="flex items-center gap-1.5 bg-rose-950/80 text-rose-300 border border-rose-800 text-xs px-2.5 py-1 rounded-full">
            <Music className="h-3.5 w-3.5 text-amber-400" />
            <span>التوزيع الأوركسترالي التفاعلي</span>
          </span>
        )}
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-amber-400 bg-amber-950/20'
            : isCustomLoaded
            ? 'border-emerald-600/50 bg-emerald-950/10'
            : 'border-slate-700 hover:border-rose-500/60 bg-slate-950/40 hover:bg-rose-950/20'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.mp3,.m4a,.wav"
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="p-3 rounded-full bg-rose-900/30 text-rose-300 border border-rose-700/40">
            <Upload className="h-6 w-6 text-amber-300" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {isCustomLoaded ? `الملف الحالي: ${customName}` : 'اسحب وأفلت الملف الصوتي للنشيد هنا'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              أو انقر لاختيار ملف MP3 أو M4A من جهازك للمزامنة الفورية مع الفيديو
            </p>
          </div>
        </div>
      </div>

      {/* Helpful Hint */}
      <div className="flex items-start gap-2 text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5">
        <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          جميع مشاهد الفيديو وكلمات النشيد الـ 39 بيتاً مؤقتة بدقة متناهية وفق المقطع الأصلي (مدته 3 دقائق و48 ثانية)، مما يتيح تجربة كليب غنائي متكامل لكورال مدرسة الود.
        </p>
      </div>
    </div>
  );
};
