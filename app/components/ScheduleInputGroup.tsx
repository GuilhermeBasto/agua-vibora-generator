import { useState } from "react";
import { Icon } from "./Icon";
import { AVAILABLE_VILLAGES } from "~/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import InfoBlock from "./InfoBlock";

interface ScheduleInputGroupProps {
  title: string;
  color: "emerald";
  year: number;
  schedules: Record<string, string[]>;
  onChange: (newSchedules: Record<string, string[]>) => void;
}

export function ScheduleInputGroup({
  title,
  schedules,
  onChange,
}: ScheduleInputGroupProps) {
  const [villageToAdd, setVillageToAdd] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const addedVillages = Object.keys(schedules);

  const handleAddVillage = () => {
    if (villageToAdd && !schedules[villageToAdd]) {
      onChange({ ...schedules, [villageToAdd]: [] });
      setSelectedVillage(villageToAdd);
      setVillageToAdd("");
    }
  };

  const handleRemoveVillage = (villageName: string) => {
    const { [villageName]: _, ...rest } = schedules;
    onChange(rest);
    if (selectedVillage === villageName) {
      setSelectedVillage("");
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedVillage) return;
    const lines = e.target.value.split("\n");
    onChange({ ...schedules, [selectedVillage]: lines });
  };

  return (
    <div className="space-y-6 border border-slate-800 bg-slate-950/20 p-5 rounded-3xl">
      <h3 className="text-emerald-400 font-bold uppercase tracking-widest text-[10px] ml-1">
        {title}
      </h3>

      {/* Adicionar Aldeia */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Select value={villageToAdd} onValueChange={setVillageToAdd}>
            <SelectTrigger className="w-full h-[58px] bg-slate-900 border-slate-700 rounded-2xl px-5 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none">
              <SelectValue placeholder="Escolher aldeia para adicionar..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-white rounded-xl">
              {AVAILABLE_VILLAGES.filter((v) => !addedVillages.includes(v)).map(
                (v) => (
                  <SelectItem
                    key={v}
                    value={v}
                    className="focus:bg-emerald-500/20 focus:text-emerald-400 cursor-pointer"
                  >
                    {v}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          disabled={!villageToAdd}
          onClick={handleAddVillage}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Icon name="plus" className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {/* INDICADOR DE ALDEIAS JÁ SELECIONADAS */}
      {addedVillages.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 animate-in fade-in duration-500">
          {addedVillages.map((v) => (
            <button
              key={`badge-${v}`}
              type="button"
              onClick={() => setSelectedVillage(v)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                selectedVillage === v
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400 ring-2 ring-cyan-500/20"
                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${schedules[v].length > 0 ? "bg-emerald-400" : "bg-slate-600"}`}
              />
              {v}
              {selectedVillage === v && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVillage(v);
                  }}
                >
                  <Icon name="x" className="w-3 h-3 hover:text-red-400" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {addedVillages.length > 0 && (
        <>
          <div className="h-px bg-slate-800/50 w-full my-6"></div>

          {/* Editar Horários */}
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Select
                  value={selectedVillage}
                  onValueChange={setSelectedVillage}
                >
                  <SelectTrigger className="w-full h-[58px] bg-slate-900 border-slate-700 rounded-2xl px-5 text-white focus:ring-2 focus:ring-cyan-500/50 outline-none">
                    <SelectValue placeholder="Configurar horários de..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700 text-white rounded-xl">
                    {addedVillages.map((v) => (
                      <SelectItem
                        key={v}
                        value={v}
                        className="focus:bg-cyan-500/20 focus:text-cyan-400 cursor-pointer"
                      >
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedVillage && (
                <button
                  type="button"
                  onClick={() => handleRemoveVillage(selectedVillage)}
                  className="p-4 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all active:scale-90"
                  title="Remover aldeia"
                >
                  <Icon name="x" className="w-6 h-6" />
                </button>
              )}
            </div>

            {selectedVillage ? (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Definir horarios: {selectedVillage}
                </label>

                <textarea
                  value={schedules[selectedVillage]?.join("\n") || ""}
                  onChange={handleTextChange}
                  rows={5}
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-3xl px-6 py-5 text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500/50 outline-none placeholder-slate-800 transition-all shadow-2xl"
                  placeholder="Ex:&#10;1h30 da tarde&#10;Por do sol ate a Meia noite"
                />

                <InfoBlock
                  text="Escreva cada horário numa linha nova. A primeira linha será o destaque visual no calendário final."
                  type="info"
                />

                {/*  <div className="flex items-start gap-3 p-4 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 ">
                  <Icon
                    name="info"
                    className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5"
                  />
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Escreva cada horário numa linha nova. A primeira linha será
                    o destaque visual no calendário final.
                  </p>
                </div> */}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-slate-800/50 rounded-3xl bg-slate-900/10">
                <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">
                  Selecione uma aldeia acima para editar os horários
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
