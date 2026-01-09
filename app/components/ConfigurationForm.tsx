import { useState } from 'react'
import type { CustomSchedule } from '~/lib/types'
import { ScheduleInputGroup } from './ScheduleInputGroup'

interface ConfigurationFormProps {
    onSubmit: (config: CustomSchedule) => void
}

export function ConfigurationForm({ onSubmit }: ConfigurationFormProps) {
    const [name, setName] = useState('Aviança Água de Víbora')
    const [year, setYear] = useState(String(new Date().getFullYear()))
    const [schedules, setSchedules] = useState<Record<string, string[]>>({})

    function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const configData: CustomSchedule = {
            name,
            year,
            schedules,
        }

        onSubmit(configData)
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label
                        htmlFor="schedule-name"
                        className="block text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] ml-1"
                    >
                        Nome da Aviança
                    </label>
                    <input
                        id="schedule-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Aviança 2026"
                        required
                        className="w-full px-5 py-4 bg-slate-950/40 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white placeholder-slate-600 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="schedule-year"
                        className="block text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] ml-1"
                    >
                        Ano de Referência
                    </label>
                    <input
                        id="schedule-year"
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        required
                        className="w-full px-5 py-4 bg-slate-950/40 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-white transition-all font-mono"
                    />
                </div>
            </div>

            <div className="pt-4">
                <ScheduleInputGroup
                    title="Horários por Casal"
                    color="emerald"
                    year={parseInt(year)}
                    schedules={schedules}
                    onChange={(newSchedules) => {
                        setSchedules(newSchedules)
                    }}
                />
            </div>

            <div className="pt-6 border-t border-slate-800">
                <button
                    type="submit"
                    className="w-full sm:w-auto sm:min-w-50 float-right px-8 py-5 bg-linear-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 rounded-2xl font-bold transition-all text-white shadow-lg shadow-cyan-900/30 active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                    Criar Aviança
                </button>
                <div className="clear-both"></div>
            </div>
        </form>
    )
}
