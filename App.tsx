import React, { useState, useEffect, useMemo } from 'react';
import { Settings as SettingsIcon, LayoutGrid, Disc, CircleHelp, Send } from 'lucide-react';

import Wheel from './components/Wheel';
import Grid from './components/Grid';
import QuestionModal from './components/QuestionModal';
import EndScreen from './components/EndScreen';
import Settings from './components/Settings';
import HelpModal from './components/HelpModal';

import { AppConfig, GameState, Question, ViewMode, GamePhase } from './types';
import { getStoredConfig, saveConfig, getStoredState, saveState, clearState, resetConfig } from './services/storageService';

const App: React.FC = () => {
  // Application Configuration
  const [config, setConfig] = useState<AppConfig>(getStoredConfig());
  
  // Game State
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<GameState['history']>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>('playing');
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('wheel');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Compute active questions based on limit
  const gameQuestions = useMemo(() => {
    if (config.maxQuestions > 0 && config.maxQuestions < config.questions.length) {
        return config.questions.slice(0, config.maxQuestions);
    }
    return config.questions;
  }, [config]);

  // Initialize or load state
  useEffect(() => {
    const savedState = getStoredState();
    if (savedState) {
        setAnsweredIds(savedState.answeredIds);
        setScore(savedState.score);
        setHistory(savedState.history);
        
        if (savedState.answeredIds.length === gameQuestions.length && gameQuestions.length > 0) {
            setGamePhase('ended');
        }
    }
  }, [gameQuestions.length]);

  // Sync state to local storage when it changes
  useEffect(() => {
    saveState({ answeredIds, score, history });
  }, [answeredIds, score, history]);

  const handleSelectQuestion = (question: Question) => {
    setActiveQuestion(question);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeQuestion) return;

    // Update Score
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    // Update History & Answered IDs
    const newAnsweredIds = [...answeredIds, activeQuestion.id];
    const newHistory = [...history, { questionId: activeQuestion.id, isCorrect }];

    setAnsweredIds(newAnsweredIds);
    setHistory(newHistory);
    setActiveQuestion(null); // Close Modal

    // Check if game ended
    if (newAnsweredIds.length === gameQuestions.length) {
      setTimeout(() => setGamePhase('ended'), 500);
    }
  };

  const handleRestart = () => {
    clearState();
    setAnsweredIds([]);
    setScore(0);
    setHistory([]);
    setGamePhase('playing');
  };

  const handleFactoryReset = () => {
      // 1. Clear Game State
      clearState();
      setAnsweredIds([]);
      setScore(0);
      setHistory([]);
      setGamePhase('playing');

      // 2. Reset Config to Default
      const defaultConfig = resetConfig();
      setConfig(defaultConfig);
      
      setShowSettings(false);
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
    setShowSettings(false);
    // Restart game to apply changes cleanly (especially question count)
    handleRestart();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-800 font-[Cairo]">
      
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center bg-white shadow-sm z-10">
        <h1 className="text-xl md:text-2xl font-black text-indigo-700">{config.title}</h1>
        <div className="flex items-center gap-2 md:gap-3">
            <div className="bg-indigo-50 px-3 py-1 rounded-full text-indigo-700 font-bold border border-indigo-100 text-sm md:text-base">
                النقاط: {score} / {gameQuestions.length}
            </div>
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>

            <button 
                onClick={() => setShowHelp(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                title="طريقة الاستخدام"
            >
                <CircleHelp size={24} />
            </button>

            <button 
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                title="الإعدادات"
            >
                <SettingsIcon size={24} />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center p-4 relative">
        
        {gamePhase === 'playing' ? (
          <>
            {/* View Toggle */}
            <div className="flex bg-slate-200 p-1 rounded-xl mb-6 shadow-inner">
                <button
                    onClick={() => setViewMode('wheel')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'wheel' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <Disc size={18} /> العجلة
                </button>
                <button
                    onClick={() => setViewMode('grid')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutGrid size={18} /> الشبكة
                </button>
            </div>

            {/* Game Views */}
            <div className="w-full flex justify-center items-center min-h-[400px]">
                {viewMode === 'wheel' ? (
                    <Wheel 
                        questions={gameQuestions} 
                        answeredIds={answeredIds} 
                        colors={config.wheelColors}
                        onSelectQuestion={handleSelectQuestion} 
                    />
                ) : (
                    <Grid 
                        questions={gameQuestions} 
                        answeredIds={answeredIds} 
                        colors={config.wheelColors}
                        onSelectQuestion={handleSelectQuestion} 
                    />
                )}
            </div>
            
            <p className="mt-8 text-slate-400 text-sm">
                تمت الإجابة على {answeredIds.length} من أصل {gameQuestions.length}
            </p>
          </>
        ) : (
          <EndScreen 
            score={score} 
            totalQuestions={gameQuestions.length} 
            history={history}
            questions={gameQuestions}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-500 text-sm bg-white border-t border-slate-100 mt-auto">
        <div className="flex flex-col items-center justify-center gap-3">
            <p className="font-bold text-base text-slate-700">
                تم التصميم بواسطة <span className="text-indigo-600">صالح</span>
            </p>
            
            <a 
                href="https://t.me/salehapp" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-colors border border-blue-200 group"
            >
                <Send size={16} className="transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                <span>للتواصل تلجرام:</span>
                <span className="font-bold font-mono dir-ltr" dir="ltr">@salehapp</span>
            </a>
        </div>
      </footer>

      {/* Modals */}
      <QuestionModal 
        question={activeQuestion} 
        onAnswer={handleAnswer} 
        onClose={() => setActiveQuestion(null)}
      />

      {showSettings && (
        <Settings 
            config={config} 
            onSave={handleSaveConfig} 
            onClose={() => setShowSettings(false)}
            onResetGame={() => {
                handleRestart();
                setShowSettings(false);
            }}
            onFactoryReset={handleFactoryReset}
        />
      )}

      {showHelp && (
        <HelpModal onClose={() => setShowHelp(false)} />
      )}

    </div>
  );
};

export default App;