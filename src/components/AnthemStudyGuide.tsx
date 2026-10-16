import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Languages,
  Heart,
  Award,
  Globe2,
  HelpCircle,
  Play,
  Lightbulb,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { ANTHEM_SECTIONS_ANALYSIS, AnthemSectionAnalysis } from '../data/anthemAnalysisData';

interface AnthemStudyGuideProps {
  onSeekToVerse: (time: number) => void;
}

export const AnthemStudyGuide: React.FC<AnthemStudyGuideProps> = ({ onSeekToVerse }) => {
  const [activeTab, setActiveTab] = useState<'sections' | 'vocabulary' | 'english' | 'values'>(
    'sections'
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec-1');

  const selectedSection =
    ANTHEM_SECTIONS_ANALYSIS.find((s) => s.id === selectedSectionId) ||
    ANTHEM_SECTIONS_ANALYSIS[0];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950/40 rounded-2xl border border-rose-900/50 p-5 md:p-8 shadow-2xl space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-900/40 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-700 to-rose-900 p-0.5 shadow-xl flex items-center justify-center border border-amber-400/50 text-white">
            <BookOpen className="h-6 w-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-2xl font-black text-white font-cairo">
                دليل شرح وبلاغة نشيد مدرسة الود
              </h3>
              <span className="text-xs bg-rose-900/80 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-500/40 font-bold">
                دراسة تفصيلية
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              توضيح المعاني اللغوية، الصور الشعرية والبلاغية، والترجمة الإنجليزية الشاملة لمقاطع النشيد
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-black/60 p-1 rounded-xl border border-rose-900/40 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sections'
                ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>شرح المقاطع</span>
          </button>

          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vocabulary'
                ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            <span>معجم الكلمات البلاغية</span>
          </button>

          <button
            onClick={() => setActiveTab('english')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'english'
                ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Languages className="h-3.5 w-3.5" />
            <span>المقطع الإنجليزي وترجمته</span>
          </button>

          <button
            onClick={() => setActiveTab('values')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'values'
                ? 'bg-gradient-to-r from-rose-700 to-rose-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>القيم والرسالة التربوية</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SECTION-BY-SECTION ANALYSIS */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {/* Section selector buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {ANTHEM_SECTIONS_ANALYSIS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                  selectedSectionId === sec.id
                    ? 'bg-rose-900/90 text-amber-300 border-amber-400/60 shadow-lg shadow-rose-950/50 scale-[1.02]'
                    : 'bg-slate-900/70 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                }`}
              >
                {sec.titleAr}
              </button>
            ))}
          </div>

          {/* Section Details Card */}
          <div className="bg-slate-900/90 rounded-2xl border border-rose-900/40 p-5 md:p-7 space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs text-amber-400 font-semibold">{selectedSection.badge}</span>
                <h4 className="text-xl md:text-2xl font-black text-white font-amiri mt-0.5">
                  {selectedSection.titleAr}
                </h4>
                <p className="text-xs text-slate-400 italic font-sans" dir="ltr">
                  {selectedSection.titleEn}
                </p>
              </div>

              <button
                onClick={() => onSeekToVerse(selectedSection.startTime)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-bold flex items-center gap-2 border border-rose-400/40 shadow-md transition-all active:scale-95"
              >
                <Play className="h-3.5 w-3.5 fill-current text-amber-300" />
                <span>استمع لهذا المقطع في الفيديو ({selectedSection.timeRange})</span>
              </button>
            </div>

            {/* Lyrics Preview with Tashkeel */}
            <div className="bg-black/50 p-4 md:p-5 rounded-xl border border-amber-500/20 space-y-2">
              <span className="text-xs text-amber-400 font-bold block mb-1">أبيات المقطع:</span>
              {selectedSection.verses.map((v, idx) => (
                <p
                  key={idx}
                  className="text-base sm:text-lg font-amiri font-bold text-amber-100 leading-relaxed"
                >
                  {v}
                </p>
              ))}
            </div>

            {/* General Meaning */}
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-400" />
                المعنى العام والرسالة التربوية للمقطع:
              </h5>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-white/5">
                {selectedSection.generalMeaning}
              </p>
            </div>

            {/* Poetic Imagery & Metaphors */}
            <div className="space-y-3">
              <h5 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                الصور الشعرية واللمسات البلاغية:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedSection.poeticImagery.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/60 p-3.5 rounded-xl border border-rose-900/30 text-xs text-slate-300 leading-relaxed space-y-1"
                  >
                    <span className="inline-block text-[11px] font-bold text-rose-400">
                      صورة شعرية {idx + 1}:
                    </span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Difficult Words in this Section */}
            {selectedSection.vocabulary.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  شرح الكلمات والمفردات الدقيقة في هذا المقطع:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {selectedSection.vocabulary.map((vocab, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/80 p-3 rounded-xl border border-emerald-900/40 text-xs space-y-1"
                    >
                      <span className="font-bold text-amber-300 font-amiri text-sm block">
                        {vocab.word}
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{vocab.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: VOCABULARY GLOSSARY */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-5">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-rose-900/30">
            <h4 className="text-base font-bold text-amber-300 mb-1">
              معجم مفردات نشيد مدرسة الود الأساسية
            </h4>
            <p className="text-xs text-slate-300">
              دليل لغوي شامل يوضح أصول الكلمات الصعبة والبلاغية الواردة في الأبيات ومعانيها الدقيقة لمساعدة التلاميذ على تذوق النص.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                word: 'الـوُدّ',
                root: 'و د د',
                meaning:
                  'أصفى درجات المحبة وأخلصها، وهو العطف والرأفة والتآلف القلبي الصادق بين أسرة المدرسة وتلاميذها.',
              },
              {
                word: 'فَجْرَ النَّهَارْ',
                root: 'ف ج ر',
                meaning:
                  'بداية انشقاق الضوء وتبدد الظلام؛ كناية عن انبثاق نور العلم في عقول الصغار وانطلاق المستقبل.',
              },
              {
                word: 'تَـزْهُـو',
                root: 'ز ه و',
                meaning: 'تشرق وتفتخر وتتلألأ حسناً وجمالاً وإشراقاً على وجوه الأطفال.',
              },
              {
                word: 'الصَّـفَـاءْ',
                root: 'ص ف و',
                meaning: 'النقاء والطهور والبراءة الخالصة الخالية من أي شوائب أو كدر.',
              },
              {
                word: 'قُـدْوَةٌ',
                root: 'ق د و',
                meaning:
                  'الأسوة الحسنة والنموذج الأخلاقي والأكاديمي الصالح الذي يُحتذى به في السلوك والعطاء.',
              },
              {
                word: 'نَسْمُو',
                root: 'س م و',
                meaning: 'نرتفع ونعلو شأناً ومكانةً وأخلاقاً وفكراً بين الأمم.',
              },
              {
                word: 'نَعْلُو وَنَحْلُو',
                root: 'ع ل و / ح ل و',
                meaning:
                  'جناس صوتي جميل يعبر عن علو المرتبة وطيب الحياة وازدهار بغداد وسعادة أهلها.',
              },
              {
                word: 'نَبْعَ السَّلَامْ',
                root: 'ن ب ع',
                meaning: 'عين الماء المتدفقة الصافية المستمرة؛ رمز للأمان المستدام والسكينة.',
              },
              {
                word: 'العُـلَا',
                root: 'ع ل و',
                meaning: 'قمم الشرف والرفعة والمجد والنجاح المتألق.',
              },
              {
                word: 'نَصُونَ مَجْدًا',
                root: 'ص و ن',
                meaning: 'نحفظ ونحمي وندافع عن تراث بلادنا وحضارتها التاريخية من النسيان.',
              },
              {
                word: 'الغَـرَّاءُ',
                root: 'غ ر ر',
                meaning:
                  'البيضاء الساطعة الشريفة الكريمة؛ مأخوذة من الغرّة (بياض جبهة الفرس) كناية عن رفعة لغتنا العربية.',
              },
              {
                word: 'نَفْتَدِي',
                root: 'ف د ي',
                meaning: 'نبذل الجهد والوقت والعمل المخلص بكل حب لبناء مستقبل الوطن والاعتزاز به.',
              },
              {
                word: 'بَصِيـرَةً',
                root: 'ب ص ر',
                meaning: 'نور العقل وقوة الإدراك والوعي الداخلي والفطنة، وهي أسمى من مجرد الرؤية البصرية.',
              },
              {
                word: 'تَصُـوغُ',
                root: 'ص ي غ',
                meaning:
                  'تشكل وتهذب وتسبك بإتقان كما يسبك الصائغ الماهر الحلي الذهبية، وهنا لصناعة الحضارة والأخلاق.',
              },
              {
                word: 'يُضَاهِي',
                root: 'ض ه ي',
                meaning:
                  'يماثل وينافس ويكافئ في الجودة الرفيعة؛ إشارة إلى المعايير الدولية لمدرسة الود.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 p-4 rounded-xl border border-rose-900/40 hover:border-amber-400/50 transition-colors space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-amber-300 font-amiri text-lg">{item.word}</h5>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                    الجذر: {item.root}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENGLISH VERSE & DETAILED TRANSLATION */}
      {activeTab === 'english' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-amber-950/40 via-rose-950/40 to-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Globe2 className="h-5 w-5 text-amber-400" />
              <span>المقطع الرابع: English — Let Our Dreams Fly (الترجمة والتحليل الشامل)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              يمثل هذا المقطع انعكاساً صريحاً للمعايير الدولية لمدرسة الود، حيث يصدح تلاميذ المدرسة باللغة الإنجليزية في تناغم بديع يربط جذورهم العراقية الأصيلة بآفاق العالم الواسع.
            </p>
          </div>

          {/* Bilingual Side-by-Side Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Stanza 1 */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-900/40 space-y-4">
              <div className="space-y-2 border-b border-white/10 pb-3" dir="ltr">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Stanza 1 (Rhyme: AABB)
                </span>
                <p className="text-sm font-serif italic text-white leading-relaxed">
                  "With love we learn, with hope we rise,<br />
                  We reach our dreams beyond the skies.<br />
                  With hearts of kindness, minds so bright,<br />
                  Al-Wudd, you lead us to the light."
                </p>
              </div>

              <div className="space-y-1.5 text-right">
                <span className="text-xs text-rose-300 font-bold">الترجمة العربية الدقيقة:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-amiri font-bold">
                  «بالمحبّة نتعلّم، وبالأمل نسمو ونرتقي،<br />
                  نصل بأحلامنا إلى ما وراء عنان السماء.<br />
                  بقلوب عامرة بالطيبة، وعقول ناصعة بالذكاء،<br />
                  يا مدرسة الودّ، أنتِ من تقودين خطانا نحو النور.»
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400">التحليل الشعري واللغوي:</span>
                <p>
                  قافية متناظرة (rise / skies ثم bright / light). الكلمات تعبر عن فلسفة المدرسة الثلاثية: المحبة (Hearts of kindness)، التفكير النيّر (Minds so bright)، والقيادة المعرفية نحو النور (Lead us to the light).
                </p>
              </div>
            </div>

            {/* English Stanza 2 */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-900/40 space-y-4">
              <div className="space-y-2 border-b border-white/10 pb-3" dir="ltr">
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  Stanza 2 (Rhyme: CCDD)
                </span>
                <p className="text-sm font-serif italic text-white leading-relaxed">
                  "Rooted in Iraq, our wings fly high,<br />
                  We learn, we grow, we touch the sky.<br />
                  Together we build a world of peace,<br />
                  With knowledge, hope, and love increased."
                </p>
              </div>

              <div className="space-y-1.5 text-right">
                <span className="text-xs text-rose-300 font-bold">الترجمة العربية الدقيقة:</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-amiri font-bold">
                  «بجذور راسخة في أرض العراق، وأجنحة تحلّق في الأعالي،<br />
                  نتعلّم، وننمو، ونلامس قمم السماء.<br />
                  معاً نشيّد عالماً يسوده السلام،<br />
                  مع تنامي العلم، وتعاظم الأمل، وازدهار المحبة.»
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-lg text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400">التحليل الشعري واللغوي:</span>
                <p>
                  الصورة الرمزية الأقوى: "Rooted in Iraq, our wings fly high" مطابقة تماماً لشطر "جذرٌ عراقي وجناحٌ للعلا"، تؤكد أن الانفتاح على العالم ينطلق من جذور وطنية متجذرة في أرض الرافدين.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VALUES & PEDAGOGICAL PHILOSOPHY */}
      {activeTab === 'values' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Value 1 */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-900/40 space-y-2">
              <div className="h-10 w-10 rounded-xl bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800">
                <Heart className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-white text-base">المحبة والبيئة الآمنة (الود)</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                اختيار اسم "الود" ليس صدفة؛ فهو يعكس بيئة مدرسية تحتضن الطفل بحنان، وتجعل المدرسة بيتاً ثانياً يشعر فيه التلميذ بالأمان والكرامة والصفاء.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-900/40 space-y-2">
              <div className="h-10 w-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-800">
                <Award className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-white text-base">العلم والتفكير النقدي (المعايير الدولية)</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                «ما العلم أوراقاً تُخط وتحفظ، بل فكرة تسمو وعقل يبدع»؛ نبذ للتلقين واعتماد لطرائق الاستكشاف، وتجارب العلوم الحديثة، وثنائية اللغة.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-900/40 space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
                <Globe2 className="h-5 w-5" />
              </div>
              <h5 className="font-bold text-white text-base">الأصالة والانتماء الوطني لبغداد والعراق</h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                الاعتزاز بنهر دجلة الخالد وتاريخ العراق، وغرس فخر الهوية العربية والعراقية في قلوب التلاميذ لتصنع منهم قادة الغد وبناة السلام.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
