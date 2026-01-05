import { useState } from "react";
import { ScheduleInputGroup } from "./ScheduleInputGroup";
import type { CustomSchedule } from "~/lib/types";

interface ConfigurationFormProps {
  onSubmit: (config: CustomSchedule) => void;
}

export function ConfigurationForm({ onSubmit }: ConfigurationFormProps) {
  const [name, setName] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [schedules, setSchedules] = useState<Record<string, string[]>>({});

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const configData: CustomSchedule = {
      name,
      year,
      schedules,
    };

    onSubmit(configData);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">
          Nome da Aviança
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-white">Ano</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-slate-400"
        />
      </div>

      {/* Schedules */}
      <ScheduleInputGroup
        title="Horários"
        color="emerald"
        year={parseInt(year)}
        schedules={schedules}
        onChange={(newSchedules) => {
          setSchedules(newSchedules);
        }}
      />

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end mt-8">
        <button
          type="submit"
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 rounded-lg font-medium transition-all text-white"
        >
          Criar Aviança
        </button>
      </div>
    </form>
  );
}
