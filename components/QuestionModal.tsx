import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';
import { X } from 'lucide-react';

interface QuestionModalProps {
  question: Question | null;
  onAnswer: (isCorrect: boolean) => void;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, onAnswer, onClose }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (question) {
        // Reset state when new question opens
        setSelectedOption(null);
        setShowResult(false);
        setIsCorrect(false);
    }
  }, [question]);

  if (!question) return null;

  const handleOptionClick = (index: number) => {
    if (showResult) return; // Prevent double clicks

    setSelectedOption(index);
    const correct = index === question.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      audioService.playCorrect();
    } else {
      audioService.playWrong();
    }

    // Auto close or trigger callback after short delay
    setTimeout(() => {
        onAnswer(correct);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 transform transition-all scale-100 animate-in fade-in zoom-in duration-300 border-t-8 border-indigo-600">
        
        {/* Close button just in case */}
        <button onClick={onClose} className="absolute top-4 left-4 text-slate-400 hover:text-slate-600">
            <X size={24} />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-800 leading-tight">
          {question.text}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            let btnClass = "p-6 rounded-xl text-xl font-semibold border-2 transition-all duration-300 transform active:scale-95";
            
            if (showResult) {
                if (idx === question.correctIndex) {
                    btnClass += " bg-green-500 border-green-600 text-white shadow-lg scale-105"; // Correct answer shown
                } else if (idx === selectedOption && idx !== question.correctIndex) {
                    btnClass += " bg-red-500 border-red-600 text-white opacity-80"; // Wrong selection
                } else {
                    btnClass += " bg-gray-100 border-gray-200 text-gray-400 opacity-50"; // Other options
                }
            } else {
                btnClass += " bg-white border-slate-200 text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 shadow-sm hover:shadow-md";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={showResult}
                className={btnClass}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {showResult && (
            <div className={`mt-6 text-center text-xl font-bold animate-pulse ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'إجابة صحيحة! أحسنت 🎉' : 'للأسف، إجابة خاطئة 😔'}
            </div>
        )}
      </div>
    </div>
  );
};

export default QuestionModal;
