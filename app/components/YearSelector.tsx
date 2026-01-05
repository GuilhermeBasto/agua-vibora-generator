import { useState, useEffect } from "react";
import { Icon } from "./Icon";

interface YearSelectorProps {
  year: number;
  onYearChange: (year: number) => void;
}

export function YearSelector({ year, onYearChange }: YearSelectorProps) {
  const [inputValue, setInputValue] = useState(String(year));

  useEffect(() => {
    setInputValue(String(year));
  }, [year]);

  // Debounce the year change
  useEffect(() => {
    const timer = setTimeout(() => {
      const parsedYear = parseInt(inputValue, 10);
      // Validamos um intervalo razoável para evitar erros de processamento
      if (
        !isNaN(parsedYear) &&
        parsedYear !== year &&
        parsedYear > 1900 &&
        parsedYear < 2100
      ) {
        onYearChange(parsedYear);
      }
    }, 500); // Aumentei ligeiramente o debounce para uma experiência mais fluida

    return () => clearTimeout(timer);
  }, [inputValue, onYearChange, year]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Icon name="calendar" className="w-4 h-4 text-cyan-500/70" />
        <label
          htmlFor="year"
          className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]"
        >
          Ciclo de Aviança (Ano)
        </label>
      </div>

      <div className="relative group">
        <input
          type="number"
          id="year"
          value={inputValue}
          min="2020"
          max="2050"
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full bg-slate-950/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-white text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all shadow-inner placeholder:text-slate-700"
          placeholder="2026"
        />

        {/* Adereço visual: Indicador lateral de foco */}
        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-500 rounded-r-full scale-y-0 group-focus-within:scale-y-100 transition-transform duration-300"></div>

        {/* Botões de atalho subtis (Opcional, apenas visual) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col text-slate-600">
          <span className="text-[10px] select-none italic font-mono uppercase tracking-tighter">
            Editável
          </span>
        </div>
      </div>

      <p className="text-[10px] text-slate-500 italic ml-1">
        A escala será recalculada automaticamente para o ano selecionado.
      </p>
    </div>
  );
}
