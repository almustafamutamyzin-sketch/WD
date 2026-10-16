import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Check, Sparkles } from 'lucide-react';
import { VideoScene, LyricLine } from '../data/anthemData';

interface SnapshotModalProps {
  scene: VideoScene | null;
  lyric: LyricLine | null;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ scene, lyric, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!scene) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = scene.image;

    img.onload = () => {
      canvas.width = 1280;
      canvas.height = 720;

      // Draw image
      ctx.drawImage(img, 0, 0, 1280, 720);

      // Dark gradient overlay for typography
      const grad = ctx.createLinearGradient(0, 0, 0, 720);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.2)');
      grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.92)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // School Crest Header
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px Cairo, sans-serif';
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillText('مدرسة الود الأساسية الأهلية — ذات المعايير الدولية', 1230, 60);

      ctx.fillStyle = '#fecdd3';
      ctx.font = '20px Cairo, sans-serif';
      ctx.fillText('بغداد — جمهورية العراق  •  نشيد «بالودِّ نبني… وبالعلم نسمو»', 1230, 95);

      // Decorative divider
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(700, 115);
      ctx.lineTo(1230, 115);
      ctx.stroke();

      // Lyric Quote Box
      const quoteText = lyric?.arabicText || '«بالودِّ نبني، بالعلمِ نسمو .. وبحبِّ بغدادَ نعلو ونحلو»';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 38px Amiri, serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 12;
      ctx.fillText(quoteText, 640, 610);
      ctx.shadowBlur = 0;

      if (lyric?.englishText) {
        ctx.fillStyle = '#fde68a';
        ctx.font = 'italic 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(lyric.englishText, 640, 655);
      }

      // Performer & Scene info badge
      ctx.fillStyle = 'rgba(159, 18, 57, 0.85)';
      ctx.beginPath();
      ctx.roundRect(50, 40, 240, 46, [10]);
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Cairo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(scene.badge, 170, 70);

      // Generate download url
      try {
        const url = canvas.toDataURL('image/jpeg', 0.92);
        setDownloadUrl(url);
      } catch {
        // Fallback
      }
    };
  }, [scene, lyric]);

  if (!scene) return null;

  const handleShare = async () => {
    if (navigator.share && downloadUrl) {
      try {
        const blob = await (await fetch(downloadUrl)).blob();
        const file = new File([blob], 'al_wudd_school_anthem.jpg', { type: 'image/jpeg' });
        await navigator.share({
          title: 'نشيد مدرسة الود الأساسية',
          text: 'بالود نبني وبالعلم نسمو - نشيد مدرسة الود الأساسية الدولية في بغداد',
          files: [file],
        });
      } catch {
        // Fallback copy
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-rose-900/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-rose-900/40 bg-slate-950">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h3 className="font-bold text-white text-base md:text-lg">
              بطاقة المشهد التذكارية — مدرسة الود
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="p-4 flex-1 flex items-center justify-center bg-black/60 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="max-h-[60vh] w-auto max-w-full rounded-xl shadow-2xl border border-white/10"
          />
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 border-t border-rose-900/40 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            بطاقة عالية الدقة مناسبة للمشاركة على وسائل التواصل وتطبيقات المدرسة
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
              <span>{copied ? 'تم نسخ الرابط' : 'مشاركة'}</span>
            </button>

            {downloadUrl && (
              <a
                href={downloadUrl}
                download={`Al_Wudd_School_${scene.badge}.jpg`}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-900/40 border border-rose-400/50 transition-all hover:scale-105"
              >
                <Download className="h-4 w-4" />
                <span>تحميل البطاقة (JPG)</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
