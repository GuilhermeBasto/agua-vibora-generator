import { useState, useEffect } from "react";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ year, onYearChange }: YearSelectorProps) {
  const [inputValue, setInputValue] = useState(String(year));

  // Sync input value when year prop changes externally
  useEffect(() => {
    setInputValue(String(year));
  }, [year]);

  // Debounce the year change
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsedYear = parseInt(inputValue, 10);
      if (!isNaN(parsedYear) && parsedYear !== year) {
        onYearChange(parsedYear);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onYearChange, year]);

  return (
    <div className="space-y-3">
      <label
        htmlFor="year"
        className="block text-sm font-semibold text-slate-300 uppercase tracking-wider"
      >
        Selecionar Ano
      </label>
      <input
        type="number"
        id="year"
        value={inputValue}
        min="2020"
        max="2050"
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        placeholder="2026"
      />
    </div>
  );
}
