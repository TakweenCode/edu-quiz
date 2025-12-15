import { Question, AppConfig } from './types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'في أي سنة وقعت غزوة أحد؟',
    options: ['3 هجري', '5 هجري'],
    correctIndex: 0,
  },
  {
    id: '2',
    text: 'من كان قائد المشركين في غزوة أحد؟',
    options: ['أبو جهل', 'أبو سفيان'],
    correctIndex: 1,
  },
  {
    id: '3',
    text: 'ما هو اسم الجبل الذي تمركز عليه الرماة؟',
    options: ['جبل عينين (الرماة)', 'جبل النور'],
    correctIndex: 0,
  },
  {
    id: '4',
    text: 'كم كان عدد الرماة الذين عينهم النبي ﷺ؟',
    options: ['50 رامياً', '100 رامٍ'],
    correctIndex: 0,
  },
  {
    id: '5',
    text: 'من هو الصحابي الذي استشهد ولقب بـ "غسيل الملائكة"؟',
    options: ['حمزة بن عبد المطلب', 'حنظلة بن أبي عامر'],
    correctIndex: 1,
  },
  {
    id: '6',
    text: 'من هو الصحابي الذي قتل حمزة بن عبد المطلب؟',
    options: ['وحشي بن حرب', 'خالد بن الوليد'],
    correctIndex: 0,
  },
  {
    id: '7',
    text: 'ماذا فعل الرماة عندما رأوا المسلمين يجمعون الغنائم؟',
    options: ['بقوا في أماكنهم', 'نزلوا عن الجبل'],
    correctIndex: 1,
  },
  {
    id: '8',
    text: 'من الذي قاد هجوم التفاف الفرسان حول الجبل؟',
    options: ['خالد بن الوليد', 'عمرو بن العاص'],
    correctIndex: 0,
  },
];

export const DEFAULT_WHEEL_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export const DEFAULT_CONFIG: AppConfig = {
  title: 'مسابقة غزوة أحد',
  questions: DEFAULT_QUESTIONS,
  wheelColors: DEFAULT_WHEEL_COLORS,
  maxQuestions: 0, // 0 means all
};

// Kept for legacy reference if needed, but preference is to use config
export const WHEEL_COLORS = DEFAULT_WHEEL_COLORS;
