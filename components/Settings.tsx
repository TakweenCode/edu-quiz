import React, { useState } from 'react';
import { AppConfig, Question } from '../types';
import { Save, X, Plus, Trash2, RotateCcw, Database, AlertTriangle } from 'lucide-react';
import { DEFAULT_WHEEL_COLORS } from '../constants';

interface SettingsProps {
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onClose: () => void;
  onResetGame: () => void;
  onFactoryReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ config, onSave, onClose, onResetGame, onFactoryReset }) => {
  const [title, setTitle] = useState(config.title);
  const [questions, setQuestions] = useState<Question[]>(JSON.parse(JSON.stringify(config.questions)));
  const [wheelColors, setWheelColors] = useState<string[]>(config.wheelColors || DEFAULT_WHEEL_COLORS);
  
  // 0 means "All", but in UI we treat it as max length or a toggle
  const [useMaxLimit, setUseMaxLimit] = useState(config.maxQuestions > 0);
  const [maxLimitValue, setMaxLimitValue] = useState(config.maxQuestions > 0 ? config.maxQuestions : questions.length);

  const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const newOptions = [...updated[qIndex].options];
    newOptions[oIndex] = value;
    updated[qIndex].options = newOptions;
    setQuestions(updated);
  };

  const handleSave = () => {
    onSave({ 
        title, 
        questions, 
        wheelColors,
        maxQuestions: useMaxLimit ? maxLimitValue : 0 
    });
  };

  const handleResetGameClick = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف تقدم اللعبة الحالي وتصفير النقاط؟')) {
        onResetGame();
    }
  };

  const handleFactoryResetClick = () => {
    if (window.confirm('تحذير: هذا الإجراء سيحذف جميع الأسئلة المضافة والألوان ويعيد التطبيق لحالته الأصلية. هل أنت متأكد؟')) {
        onFactoryReset();
    }
  };

  const addNewQuestion = () => {
      const newQ: Question = {
          id: Date.now().toString(),
          text: 'سؤال جديد...',
          options: ['خيار 1', 'خيار 2'],
          correctIndex: 0
      };
      setQuestions([...questions, newQ]);
  };

  const removeQuestion = (index: number) => {
      if (questions.length <= 1) return; // Prevent empty
      const updated = questions.filter((_, i) => i !== index);
      setQuestions(updated);
  }

  const addColor = () => {
      // Add a random nice color or just duplicate last
      setWheelColors([...wheelColors, '#6366f1']);
  }

  const removeColor = (index: number) => {
      if (wheelColors.length <= 1) return;
      setWheelColors(wheelColors.filter((_, i) => i !== index));
  }

  const updateColor = (index: number, color: string) => {
      const updated = [...wheelColors];
      updated[index] = color;
      setWheelColors(updated);
  }

  const resetColors = () => {
      setWheelColors([...DEFAULT_WHEEL_COLORS]);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Database size={20} className="text-indigo-600"/>
            إعدادات المسابقة
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">عنوان المسابقة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-slate-900"
                />
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">عدد الأسئلة في اللعبة</label>
                  <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={useMaxLimit} 
                            onChange={(e) => setUseMaxLimit(e.target.checked)}
                            className="w-5 h-5 accent-indigo-600"
                          />
                          <span className="text-sm font-semibold">تحديد عدد معين</span>
                      </label>
                      
                      <input 
                        type="number"
                        min="1"
                        max={questions.length}
                        value={maxLimitValue}
                        onChange={(e) => setMaxLimitValue(Math.min(parseInt(e.target.value) || 1, questions.length))}
                        disabled={!useMaxLimit}
                        className="w-20 p-2 border border-slate-300 rounded-md disabled:opacity-50 disabled:bg-slate-100 bg-white text-slate-900"
                      />
                      <span className="text-xs text-slate-500">
                          (من أصل {questions.length})
                      </span>
                  </div>
              </div>
          </div>
          
          {/* Colors */}
          <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-slate-700">ألوان العجلة ({wheelColors.length})</h3>
                  <button onClick={resetColors} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-700">
                      <RotateCcw size={14}/> استعادة الافتراضي
                  </button>
              </div>
              <div className="flex flex-wrap gap-3">
                  {wheelColors.map((color, idx) => (
                      <div key={idx} className="relative group">
                           <input 
                              type="color" 
                              value={color}
                              onChange={(e) => updateColor(idx, e.target.value)}
                              className="w-12 h-12 rounded-full overflow-hidden border-0 p-0 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                           />
                           <button 
                                onClick={() => removeColor(idx)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                title="حذف"
                           >
                               <X size={12} />
                           </button>
                      </div>
                  ))}
                  <button 
                    onClick={addColor}
                    className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                  >
                      <Plus size={20} />
                  </button>
              </div>
          </div>

          {/* Questions */}
          <div className="border-t border-slate-200 pt-6">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-bold text-slate-700">قائمة الأسئلة</h3>
                 <button onClick={addNewQuestion} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg hover:bg-indigo-100 font-bold">
                    <Plus size={16}/> إضافة سؤال
                 </button>
            </div>
           
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => removeQuestion(idx)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={18}/></button>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-bold text-slate-500 mb-1">السؤال #{idx + 1}</label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => handleQuestionChange(idx, 'text', e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:border-indigo-500 outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleQuestionChange(idx, 'correctIndex', oIdx)}
                          className="w-4 h-4 text-indigo-600 accent-indigo-600"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                          className={`flex-1 p-2 border rounded-lg text-sm outline-none ${
                            q.correctIndex === oIdx ? 'border-green-400 bg-green-50 text-green-900 font-bold' : 'border-slate-300 bg-white text-slate-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management Section */}
          <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Database size={18} /> إدارة البيانات المحفوظة (LocalStorage)
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                  <button 
                    onClick={handleResetGameClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl hover:bg-orange-100 transition-colors font-semibold"
                  >
                      <RotateCcw size={18} />
                      تصفير النتائج والبدء من جديد
                  </button>

                  <button 
                    onClick={handleFactoryResetClick}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-semibold"
                  >
                      <AlertTriangle size={18} />
                      استعادة ضبط المصنع (حذف الكل)
                  </button>
              </div>
          </div>

        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-slate-600 font-bold hover:bg-slate-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            حفظ التعديلات
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;