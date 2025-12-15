import React, { useEffect } from 'react';
import { GameState, Question } from '../types';
import { Trophy, RefreshCw, List } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioService } from '../services/audioService';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  history: GameState['history'];
  questions: Question[];
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, history, questions, onRestart }) => {
  
    useEffect(() => {
        if (score > 0) {
            audioService.playWin();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [score]);

    const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-6 animate-in slide-in-from-bottom duration-700">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full text-center border-t-8 border-yellow-400">
        <div className="bg-yellow-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-600" />
        </div>
        
        <h2 className="text-4xl font-bold text-slate-800 mb-2">انتهت المسابقة!</h2>
        <p className="text-slate-500 mb-8">إليك ملخص أدائك</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="block text-sm text-slate-500 mb-1">النقاط</span>
                <span className="block text-4xl font-black text-indigo-600">{score}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
                <span className="block text-sm text-slate-500 mb-1">النسبة</span>
                <span className={`block text-4xl font-black ${percentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>{percentage}%</span>
            </div>
        </div>

        <div className="text-right mb-8">
            <h3 className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                <List size={20} />
                <span>تفاصيل الإجابات</span>
            </h3>
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 max-h-60 overflow-y-auto">
                {questions.map((q, i) => {
                    const record = history.find(h => h.questionId === q.id);
                    // If no record, maybe didn't answer? (shouldn't happen in full game)
                    const isCorrect = record?.isCorrect;
                    
                    return (
                        <div key={q.id} className="p-3 border-b border-slate-100 last:border-0 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold bg-slate-200 text-slate-600 w-6 h-6 flex items-center justify-center rounded-full">
                                    {i + 1}
                                </span>
                                <span className="text-sm text-slate-700 truncate max-w-[200px] md:max-w-xs">{q.text}</span>
                             </div>
                             <span className={`text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                {isCorrect ? 'صحيحة' : 'خاطئة'}
                             </span>
                        </div>
                    )
                })}
            </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw />
          <span>إعادة اللعب</span>
        </button>
      </div>
    </div>
  );
};

export default EndScreen;
