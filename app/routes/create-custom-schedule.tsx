import type { Route } from "./+types/create-custom-schedule";
import { useFetcher } from "react-router";
import { ConfigurationForm } from "~/components/ConfigurationForm";
import { Footer } from "~/components/Footer";
import { PageHeader } from "~/components/PageHeader";
import type { CustomSchedule, GeneratedSchedule } from "~/lib/types";
import { useEffect, useState } from "react";
import { Icon } from "~/components/Icon";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Criar Calendário Personalizado - Água de Víbora" },
    {
      name: "description",
      content:
        "Crie calendários personalizados com configurações de rotação e horários das aldeias",
    },
  ];
}

export default function CreateCustomSchedulePage() {
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);
  const fetcher = useFetcher<GeneratedSchedule>();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setGeneratedSchedule(fetcher.data);
    }
  }, [fetcher.state, fetcher.data]);

  function handleFormSubmit(formData: CustomSchedule) {
    const fd = new FormData();
    fd.append("data", JSON.stringify(formData));

    fetcher.submit(fd, {
      method: "POST",
      action: "/api/create-schedule",
    });
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-0 sm:px-4">
      {/* Background Global Imersivo */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-emerald-950/20 pointer-events-none -z-10"></div>

      <div className="bg-slate-900/80 sm:rounded-2xl shadow-2xl border-x sm:border border-slate-800 overflow-hidden backdrop-blur-xl transition-all duration-500">
        {!generatedSchedule ? (
          <>
            <PageHeader
              title="Nova Aviança Personalizada"
              subtitle="Configure os horários de rega das aldeias"
              icon="template"
              backLink="/"
              backLabel="Voltar"
            />

            <div className="p-4 sm:p-10">
              {/* Info Box - Ajustada para Mobile */}
              <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3">
                <Icon
                  name="info"
                  className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
                />
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Esta ferramenta permite gerar uma escala temporária fora do
                  ciclo padrão. Ideal para anos de exceção ou novos acordos
                  entre herdeiros.
                </p>
              </div>

              <div className="bg-slate-950/30 rounded-2xl border border-slate-700/30 p-2 sm:p-6">
                <ConfigurationForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </>
        ) : (
          <>
            <PageHeader
              title={generatedSchedule.name || "Resultado da Escala"}
              subtitle={`Calendário gerado para o ano ${generatedSchedule.year}`}
              icon="check"
              backLabel="Editar"
              onClick={() => setGeneratedSchedule(null)}
            />

            <div className="p-4 sm:p-10 space-y-8">
              {/* Resultado Mobile: Cards */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {generatedSchedule.data.map((entry, idx) => (
                  <div
                    key={`res-mob-${idx}`}
                    className={`p-5 rounded-2xl border transition-all ${
                      entry.isBold
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-slate-800/40 border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                        Data
                      </span>
                      {entry.isBold && (
                        <Icon name="water" className="w-3 h-3 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-slate-100 font-semibold mb-4 italic">
                      {entry.dateFormatted}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">
                          Aldeia
                        </p>
                        <p
                          className={`text-sm ${entry.isBold ? "text-cyan-400 font-bold" : "text-white"}`}
                        >
                          {entry.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">
                          Horário
                        </p>
                        <p className="text-sm text-slate-300 font-mono">
                          {entry.schedule || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resultado Desktop: Tabela */}
              <div className="hidden sm:block overflow-hidden border border-slate-700/50 rounded-xl bg-slate-800/20">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-slate-800/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        Data
                      </th>
                      <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        Aldeia
                      </th>
                      <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider text-xs">
                        Horário
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {generatedSchedule.data.map((entry, idx) => (
                      <tr
                        key={idx}
                        className={`transition-colors hover:bg-slate-700/30 ${entry.isBold ? "bg-cyan-500/5" : ""}`}
                      >
                        <td className="px-6 py-4 text-slate-200">
                          {entry.dateFormatted}
                        </td>
                        <td
                          className={`px-6 py-4 ${entry.isBold ? "text-cyan-400 font-bold" : "text-slate-200"}`}
                        >
                          {entry.location}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-mono italic">
                          {entry.schedule || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button
                  onClick={() => setGeneratedSchedule(null)}
                  className="w-full sm:w-auto px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl transition-all font-bold shadow-lg shadow-cyan-900/20 active:scale-95"
                >
                  Editar Configuração
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
