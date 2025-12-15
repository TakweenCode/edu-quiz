import React from 'react';
import { X, MousePointerClick, Trophy, Settings, Disc, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="bg-white/20 p-2 rounded-lg"><CheckCircle2 /></span>
                دليل الاستخدام
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto space-y-8">
            
            {/* Section 1: How to Play */}
            <section>
                <h3 className="text-lg font-bold text-indigo-700 mb-4 border-b border-indigo-100 pb-2">كيفية اللعب</h3>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="bg-slate-100 p-3 h-fit rounded-xl text-slate-600">
                            <Disc size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">1. تدوير العجلة</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mt-1">
                                اضغط على زر <strong>"دوّر"</strong> في منتصف العجلة. ستدور العجلة وتقف عشوائياً على رقم سؤال لم تتم الإجابة عليه بعد. يمكنك أيضاً استخدام "عرض الشبكة" لاختيار الأسئلة يدوياً.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 p-3 h-fit rounded-xl text-slate-600">
                            <MousePointerClick size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">2. الإجابة على السؤال</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mt-1">
                                سيظهر السؤال مع خيارين للإجابة. اختر الإجابة الصحيحة لتكسب نقطة. الإجابة الخاطئة لن تحتسب نقطة وسيتم تعليم السؤال كـ "مجاب".
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-slate-100 p-3 h-fit rounded-xl text-slate-600">
                            <Trophy size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800">3. الفوز وإنهاء اللعبة</h4>
                            <p className="text-slate-600 text-sm leading-relaxed mt-1">
                                استمر في اللعب حتى تنتهي جميع الأسئلة المحددة. ستظهر شاشة النهاية لتعرض نتيجتك ونسبة نجاحك.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: For Teachers/Admins */}
            <section className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-700 mb-3 flex items-center gap-2">
                    <Settings size={20} />
                    إعدادات المعلم (لوحة التحكم)
                </h3>
                <p className="text-slate-700 text-sm mb-3">
                    يمكنك الضغط على زر <strong>الإعدادات (الترس)</strong> في أعلى يسار الشاشة للقيام بما يلي:
                </p>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    <li>تعديل عنوان المسابقة.</li>
                    <li>إضافة، تعديل، أو حذف الأسئلة والخيارات.</li>
                    <li>تغيير ألوان العجلة لتناسب ذوقك.</li>
                    <li>تحديد عدد الأسئلة المطلوبة لجولة قصيرة.</li>
                </ul>
            </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-center">
            <button 
                onClick={onClose}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold transition-colors"
            >
                فهمت، لنبدأ!
            </button>
        </div>

      </div>
    </div>
  );
};

export default HelpModal;
