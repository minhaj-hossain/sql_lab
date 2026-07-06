import React, { useState } from 'react';
import { 
  BookOpen, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles
} from 'lucide-react';

interface Flashcard {
  id: string;
  term?: string;
  title?: string;
  keyword?: string;
  definition: string;
  analogy?: string;
  meaning?: string;
  easy_example?: string;
  mistake?: string;
  common_mistake?: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 'db',
    term: 'Database',
    definition: 'A highly organized digital filing cabinet designed to store, retrieve, and update structured records rapidly.',
    analogy: 'Imagine an entire warehouse filled with perfectly sorted rows of file drawers.',
    mistake: 'Thinking a database is just one big excel spreadsheet. In reality, it consists of dozens of interrelated tables.'
  },
  {
    id: 'table',
    term: 'Table',
    definition: 'A collection of related data stored in a structured grid format consisting of vertical columns and horizontal rows.',
    analogy: 'Like an individual tab in an Excel workbook labeled "employees" or "departments".',
    mistake: 'Forgetting that database table names in Oracle are usually plural (employees, not employee).'
  },
  {
    id: 'select',
    term: 'SELECT',
    definition: 'The very first clause of a SQL query, instructing the database engine which specific columns or headers to fetch.',
    analogy: 'Like telling a waiter: "I want only the soup and the dessert from the menu."',
    mistake: 'Typing columns without commas between them, or adding a trailing comma after the last column.'
  },
  {
    id: 'asterisk',
    term: 'The Asterisk (*)',
    definition: 'A wildcard symbol used in the SELECT list that acts as a shortcut to request all columns from the target table.',
    analogy: 'Like telling a buffet waiter: "Give me one plate of every dish you have out."',
    mistake: 'Using SELECT * in production apps. It is too slow and fetches unneeded metadata. Name your columns!'
  },
  {
    id: 'from',
    term: 'FROM',
    definition: 'A mandatory clause that specifies exactly which table drawer the relational engine should search.',
    analogy: 'Opening the specific drawer in a file cabinet marked "departments".',
    mistake: 'Writing column names after FROM instead of table names.'
  },
  {
    id: 'where',
    term: 'WHERE',
    definition: 'A filter clause checking conditions on each row, keeping only those that evaluate to TRUE.',
    analogy: 'WHERE salary > 10000',
    mistake: 'Putting WHERE before the FROM clause, e.g. SELECT * WHERE salary > 10000 FROM employees;'
  },
  {
    id: 'order_by',
    term: 'ORDER BY',
    definition: 'A sorting clause that rearranges output rows based on a chosen column, ascending by default.',
    analogy: 'Like arranging playing cards in hand from smallest number to largest.',
    mistake: 'Forgetting that ORDER BY must be the absolute final clause in any SQL query block.'
  },
  {
    id: 'distinct',
    term: 'DISTINCT',
    definition: 'A deduplication modifier placed after SELECT that collapses duplicate row combinations into single records.',
    analogy: 'Asking: "What unique brands of cars are in our garage?" rather than listing every single car.',
    mistake: 'Thinking DISTINCT only applies to the first column. It applies to the entire row combination.'
  },
  {
    id: 'alias',
    term: 'AS (Aliases)',
    definition: 'A cosmetic re-labeling clause that temporarily renames output column headers for human-readable reports.',
    analogy: 'Putting a friendly label like "Total Pay" over a system code column named "sal_raw".',
    mistake: 'Using single quotes instead of double quotes for aliased headers with spaces.'
  }
];

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const activeCard = FLASHCARDS[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    }, 150);
  };

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const isMastered = masteredIds.includes(activeCard.id);
  const progressPercent = Math.round((masteredIds.length / FLASHCARDS.length) * 100);

  const cardTitle = activeCard.term || activeCard.title || activeCard.keyword || '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[640px] mx-auto pt-6 pb-24" id="flashcards-view">
      
      {/* Visual Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Flashcards Deck</h1>
        <p className="text-sm text-on-surface-variant font-serif italic">
          Master foundational terminology, analogies, and pitfall warnings.
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant font-mono space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-on-surface">
          <span>Mastery Progress</span>
          <span className="text-primary">{masteredIds.length} / {FLASHCARDS.length}</span>
        </div>
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Main Flashcard Stage */}
      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        
        {/* Flashcard Frame Wrapper with perspective styling */}
        <div 
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-72 cursor-pointer relative transition-all duration-500 transform-style-3d hover:scale-[1.01]"
          id="flashcard-container"
          style={{ perspective: '1000px' }}
        >
          {/* Front Face Card */}
          <div 
            className={`absolute inset-0 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-500 backface-hidden ${
              isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-mono font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded border border-outline-variant/30">
                SQL TERM CARD
              </span>
              <span className="text-on-surface-variant text-[10px] flex items-center gap-1 font-mono font-bold">
                <RotateCw size={11} /> Flip Card
              </span>
            </div>

            <div className="text-center py-4">
              <h2 className="text-3xl font-mono font-black text-on-surface tracking-tight">{cardTitle}</h2>
              <p className="text-[10px] font-serif italic text-on-surface-variant mt-1">Core SQL Vocabulary</p>
            </div>

            <div className="flex justify-between items-center text-[10px] text-on-surface-variant font-mono">
              <span>Card {currentIndex + 1} of {FLASHCARDS.length}</span>
              {isMastered && (
                <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Check className="w-3 h-3" strokeWidth={3} /> Mastered
                </span>
              )}
            </div>
          </div>

          {/* Back Face Card */}
          <div 
            className={`absolute inset-0 bg-[#11151C] text-white border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-500 backface-hidden ${
              isFlipped ? 'rotate-y-0 opacity-100' : 'rotate-y-180 opacity-0'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-850 font-mono">
                DEFINITION & ANALOGY
              </span>
              <span className="text-slate-500 text-[10px] flex items-center gap-1 font-mono font-bold">
                <RotateCw size={11} /> Flip Card
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-40 pr-1 text-left pt-2 select-text">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Meaning</span>
                <p className="text-[11px] text-slate-200 leading-relaxed font-serif">
                  {activeCard.definition}
                </p>
              </div>

              {activeCard.analogy && (
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Analogy</span>
                  <p className="text-[11px] text-indigo-200 italic leading-normal font-serif">
                    "{activeCard.analogy}"
                  </p>
                </div>
              )}

              {(activeCard.mistake || activeCard.common_mistake) && (
                <div className="p-2 bg-rose-950/20 rounded border border-rose-900/40 text-[10px] text-rose-300 leading-normal font-serif">
                  <span className="font-mono font-bold text-[8px] tracking-wider uppercase text-rose-400 block mb-0.5">⚠️ Common Pitfall</span>
                  <p className="text-rose-250">
                    {activeCard.mistake || activeCard.common_mistake}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1.5 border-t border-slate-800 font-mono">
              <span>Card {currentIndex + 1} of {FLASHCARDS.length}</span>
              <span>Glossary Entry</span>
            </div>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-all cursor-pointer shadow-sm"
            title="Previous Card"
            id="flashcard-prev-btn"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => toggleMastered(activeCard.id)}
            className={`font-mono font-bold text-xs px-6 py-2.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              isMastered 
                ? 'bg-emerald-600 border-emerald-600 text-white' 
                : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container'
            }`}
            id="flashcard-mastery-btn"
          >
            {isMastered ? (
              <>
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                <span>Mastered</span>
              </>
            ) : (
              <span>Mark Mastered</span>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-all cursor-pointer shadow-sm"
            title="Next Card"
            id="flashcard-next-btn"
          >
            <ChevronRight size={16} />
          </button>
        </div>

      </div>

    </div>
  );
}
