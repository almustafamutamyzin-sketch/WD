import React from 'react';
import { ShieldCheck, Award, Heart, Sparkles, GraduationCap } from 'lucide-react';

export const UniformCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 rounded-2xl border border-rose-900/40 p-5 md:p-7 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-700 via-rose-900 to-amber-700 p-0.5 shadow-lg flex items-center justify-center border border-amber-400/40">
            <GraduationCap className="h-6 w-6 text-amber-200" />
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              هوية مدرسة الود الأساسية
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-semibold">
                معايير دولية
              </span>
            </h3>
            <p className="text-xs text-rose-300 font-medium">
              الزي المدرسي المعتمد ورؤية المدرسة في بناء جيل المعالي
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-rose-500/30 text-amber-300 text-xs">
          <Award className="h-4 w-4 text-amber-400" />
          <span>بغداد — جمهورية العراق</span>
        </div>
      </div>

      {/* Uniform Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Item 1 */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <h4 className="font-bold text-sm text-white">البيريه الخمري الأنيق</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            قبعة البيريه الخمرية بتصميمها الأوروبي الراقي، تمنح التلميذ وقاراً وانضباطاً يعكس المعايير الدولية الرفيعة.
          </p>
        </div>

        {/* Item 2 */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <h4 className="font-bold text-sm text-white">السترة الخمرية العصرية</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            سترة بقلنسوة وسحاب باللون الخمري (Burgundy) توفر للتلاميذ راحة وأناقة حركية في الأنشطة المدرسية واليومية.
          </p>
        </div>

        {/* Item 3 */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <h4 className="font-bold text-sm text-white">القميص الأزرق وربطة العنق</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            قميص بياقة كلاسيكية باللون الأزرق الفاتح مع ربطة عنق خمرية متناسقة تبرز الهيبة الأكاديمية والتربوية.
          </p>
        </div>

        {/* Item 4 */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
            <h4 className="font-bold text-sm text-white">التنورة الرمادية ذات الكسرات</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            تنورة بكسرات أنيقة مع جوارب بيضاء نقية تكمل اللوحة المدرسية النموذجية لطالبات مدرسة الود.
          </p>
        </div>
      </div>

      {/* School Mission & Values */}
      <div className="bg-black/40 p-4 md:p-5 rounded-xl border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            شعارنا التربوي: «بالودِّ نبني… وبالعلم نسمو»
          </h4>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            رسالة مدرسة الود الأساسية ترتكز على بناء الإنسان قلباً وعقلاً، معتزين بجذور العراق وتراث دجلة الخالد، ومنطلقين بأجنحة العلم والمعايير الدولية نحو أفق المستقبل.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 bg-rose-950 text-rose-200 px-3 py-1.5 rounded-lg border border-rose-800">
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            محبة وانتماء
          </span>
          <span className="flex items-center gap-1 bg-amber-950 text-amber-200 px-3 py-1.5 rounded-lg border border-amber-800">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            ريادة أكاديمية
          </span>
        </div>
      </div>
    </div>
  );
};
