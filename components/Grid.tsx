import React from 'react';
import { Question } from '../types';
import { Check } from 'lucide-react';

interface GridProps {
  questions: Question[];
  answeredIds: string[];
  colors: string[];
  onSelectQuestion: (question: Question) => void;
}

const Grid: React.FC<GridProps> = ({ questions, answeredIds, colors, onSelectQuestion }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 w-full max-w-4xl mx-auto">
      {questions.map((q, i) => {
        const isAnswered = answeredIds.includes(q.id);
        const color = colors[i % colors.length];

        return (
          <button
            key={q.id}
            onClick={() => !isAnswered && onSelectQuestion(q)}
            disabled={isAnswered}
            className={`
              relative h-32 rounded-xl shadow-lg flex items-center justify-center text-3xl font-black text-white
              transition-all duration-300 transform hover:scale-105
              ${isAnswered ? 'bg-slate-300 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{ backgroundColor: isAnswered ? undefined : color }}
          >
            {isAnswered ? (
               <Check className="w-12 h-12 text-slate-500" />
            ) : (
                <span>{i + 1}</span>
            )}
            
            {!isAnswered && (
                <div className="absolute bottom-2 text-xs font-normal opacity-80">
                    اضغط للفتح
                </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Grid;
