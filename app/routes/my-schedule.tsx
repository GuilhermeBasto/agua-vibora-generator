import { useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/my-schedule";
import { generateScheduleData } from "~/lib/schedule.server";
import { PageHeader } from "~/components/PageHeader";
import { Footer } from "~/components/Footer";
import { Icon } from "~/components/Icon";
import { YearSelector } from "~/components/YearSelector";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const year = parseInt(
    url.searchParams.get("year") || String(new Date().getFullYear()),
    10
  );
  const fullSchedule = generateScheduleData(year, false);
  return { year, fullSchedule };
}

export default function MySchedulePage({ loaderData }: Route.ComponentProps) {
  const { year, fullSchedule } = loaderData;
  const [, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  const handleYearChange = (newYear: number) => {
    setSearchParams({ year: String(newYear) });
  };

  const filteredSchedule = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return fullSchedule;
    return fullSchedule.filter((entry) =>
      entry.location.toLowerCase().includes(term)
    );
  }, [searchTerm, fullSchedule]);

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-screen flex flex-col">
      {/* Background Global */}
      <div className="fixed inset-0 bg-slate-950 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-emerald-900/10" />
      </div>

      <main className="flex-grow pb-20">
        <div className="bg-slate-900/40 sm:rounded-[40px] shadow-2xl border-x sm:border border-white/5 overflow-hidden backdrop-blur-2xl">
          <PageHeader
            title="O Meu Horário de Rega"
            subtitle={`Consulta da Aviança de ${year}`}
            icon="user"
            backLabel="VOLTAR AO INÍCIO"
            backLink="/"
          />

          <div className="p-6 sm:p-12 space-y-10">
            {/* Secção de Controlos: Grid Alinhada */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Coluna do Ano */}
              <div className="lg:col-span-4 space-y-3">
                <YearSelector year={year} onYearChange={handleYearChange} />
              </div>

              {/* Coluna da Pesquisa */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2 ml-1 text-cyan-400">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    Filtrar por Herdeiro ou Campo
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <Icon
                      name="search"
                      className="w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ex: Guilherme, Torre, Ramada..."
                    className="w-full h-[64px] bg-slate-950/40 border border-white/5 rounded-2xl pl-16 pr-6 text-white text-lg placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            {/* Tabela de Resultados Estilo Premium */}
            <div className="overflow-hidden bg-slate-950/20 border border-white/5 rounded-[32px] shadow-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="px-8 py-6 text-[11px] font-black text-cyan-400 uppercase tracking-[0.25em]">
                      Data
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black text-cyan-400 uppercase tracking-[0.25em]">
                      Local / Herdeiro
                    </th>
                    <th className="px-8 py-6 text-[11px] font-black text-cyan-400 uppercase tracking-[0.25em]">
                      Horário de Rega
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredSchedule.map((entry, idx) => (
                    <tr
                      key={idx}
                      className={`group transition-colors hover:bg-white/[0.02] ${entry.isBold ? "bg-cyan-500/[0.03]" : ""}`}
                    >
                      <td className="px-8 py-5 text-slate-400 group-hover:text-slate-200 transition-colors text-sm">
                        {entry.dateFormatted}
                      </td>
                      <td
                        className={`px-8 py-5 text-lg ${entry.isBold ? "text-white font-bold" : "text-slate-200 font-medium"}`}
                      >
                        {entry.location}
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                          {entry.schedule || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredSchedule.length === 0 && (
                <div className="py-24 text-center border-t border-white/5">
                  <Icon
                    name="search"
                    className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20"
                  />
                  <p className="text-slate-600 uppercase tracking-widest text-xs font-bold">
                    Nenhum resultado encontrado para "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
