import { AppConfig, GameState } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const CONFIG_KEY = 'quiz_game_config';
const STATE_KEY = 'quiz_game_state';

export const getStoredConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
        const parsed = JSON.parse(stored);
        // Merge defaults to handle missing fields in old configs
        return { 
            ...DEFAULT_CONFIG, 
            ...parsed,
            // Ensure data integrity
            questions: parsed.questions || DEFAULT_CONFIG.questions,
            wheelColors: parsed.wheelColors || DEFAULT_CONFIG.wheelColors,
            maxQuestions: parsed.maxQuestions !== undefined ? parsed.maxQuestions : DEFAULT_CONFIG.maxQuestions
        };
    }
    return DEFAULT_CONFIG;
  } catch (e) {
    console.error("Failed to load config", e);
    return DEFAULT_CONFIG;
  }
};

export const saveConfig = (config: AppConfig) => {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config", e);
  }
};

export const resetConfig = () => {
    localStorage.removeItem(CONFIG_KEY);
    return DEFAULT_CONFIG;
}

export const getStoredState = (): GameState | null => {
    try {
        const stored = localStorage.getItem(STATE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch(e) {
        return null;
    }
}

export const saveState = (state: GameState) => {
    try {
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error(e);
    }
}

export const clearState = () => {
    localStorage.removeItem(STATE_KEY);
}
