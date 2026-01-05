import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { AVAILABLE_VILLAGES } from "~/lib/constants";

interface ScheduleInputGroupProps {
  title: string;
  color: "emerald" | "purple";
  year: number;
  schedules: Record<string, string[]>;
  onChange: (schedules: Record<string, string[]>) => void;
}

export function ScheduleInputGroup({
  title,
  color,
  year,
  schedules,
  onChange,
}: ScheduleInputGroupProps) {
  const colorClasses = {
    emerald: "text-emerald-400",
    purple: "text-purple-400",
  };

  const allVillages = new Set(Object.keys(schedules));

  const [entries, setEntries] = useState<
    { location: string; times: string[] }[]
  >(
    allVillages.size > 0
      ? Array.from(allVillages).map((village) => ({
          location: village,
          times: schedules[village] || [""],
        }))
      : [{ location: "", times: [""] }]
  );

  function updateEntry(index: number, village: string, times: string[]) {
    const newEntries = [...entries];
    newEntries[index] = { location: village, times };

    setEntries(newEntries);

    const newSchedules: Record<string, string[]> = {};

    newEntries.forEach(({ location, times }) => {
      const trimmedVillage = location.trim();
      const validTimes = times.filter((time) => time.trim());

      if (trimmedVillage && validTimes.length > 0) {
        newSchedules[trimmedVillage] = validTimes;
      }
    });

    onChange(newSchedules);
  }

  function addEntry() {
    setEntries([...entries, { location: "", times: [""] }]);
  }

  function removeEntry(index: number) {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);

      const newSchedules: Record<string, string[]> = {};

      newEntries.forEach(({ location, times }) => {
        const trimmedVillage = location.trim();
        const validTimes = times.filter((time) => time.trim());

        if (trimmedVillage && validTimes.length > 0) {
          newSchedules[trimmedVillage] = validTimes;
        }
      });

      onChange(newSchedules);
    }
  }

  return (
    <div className="mb-6">
      <h3 className={`text-xl font-semibold mb-2 ${colorClasses[color]}`}>
        {title}
      </h3>
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <ScheduleEntry
            key={index}
            village={entry.location}
            times={entry.times}
            onUpdate={(village, times) => updateEntry(index, village, times)}
            onRemove={() => removeEntry(index)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={addEntry}
        className="mt-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white"
      >
        + Adicionar Aldeia
      </button>
    </div>
  );
}

interface ScheduleEntryProps {
  village: string;
  times: string[];
  onUpdate: (village: string, times: string[]) => void;
  onRemove: () => void;
}

function ScheduleEntry({
  village,
  times,
  onUpdate,
  onRemove,
}: ScheduleEntryProps) {
  const timesText = times.join("\n");

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      <div className="flex gap-2 mb-4">
        <Select
          value={village || ""}
          onValueChange={(value) => onUpdate(value, times)}
        >
          <SelectTrigger className="flex-1 bg-slate-800 border-slate-600 text-slate-100">
            <SelectValue placeholder="Selecionar aldeia" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-600">
            {AVAILABLE_VILLAGES.map((v) => (
              <SelectItem key={v} value={v} className="text-slate-100">
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded text-sm"
        >
          ✕
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-white mb-2">
          Horários
        </label>
        <textarea
          placeholder={"1h30 da tarde\n12h até as 2h da tarde"}
          rows={3}
          value={timesText}
          onChange={(e) => onUpdate(village, e.target.value.split("\n"))}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 font-mono text-sm"
        ></textarea>
        <p className="text-xs text-slate-400 mt-2">
          💡 <strong>Dica:</strong> Para adicionar vários horários, coloque cada
          um numa nova linha. Certifique-se que os horários estão pela ordem
          correcta — o primeiro horário no campo será o horário que aparecerá na
          aviança.
        </p>
      </div>
    </div>
  );
}
