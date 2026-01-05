import type { Route } from "./+types/create-custom-schedule";
import { useFetcher } from "react-router";
import { ConfigurationForm } from "~/components/ConfigurationForm";
import { Footer } from "~/components/Footer";
import { PageHeader } from "~/components/PageHeader";
import type { CustomSchedule, GeneratedSchedule } from "~/lib/types";
import { useEffect, useState } from "react";

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
      const responseData = fetcher.data;
      setGeneratedSchedule(responseData);
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
    <div className="relative w-full max-w-7xl">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        {!generatedSchedule ? (
          <>
            <PageHeader
              title="Nova Aviança Personalizada"
              subtitle="Configure os horários de rega das aldeias"
              icon="template"
              backLink="/"
              backLabel="Voltar"
            />

            <div className="p-8 space-y-6">
              <ConfigurationForm onSubmit={handleFormSubmit} />
            </div>
          </>
        ) : (
          <>
            <PageHeader
              title={generatedSchedule.name || "Nova Aviança Personalizada"}
              subtitle="Sua aviança personalizada"
              icon="template"
              onClick={() => setGeneratedSchedule(null)}
              backLabel="Voltar"
            />
            <div className="p-8 space-y-6">
              <div className="p-8 space-y-6">
                <div className="overflow-x-auto border border-slate-700 rounded-xl">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                          Data
                        </th>
                        <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                          Aldeia
                        </th>
                        <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                          Horário
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-slate-900/50">
                      {generatedSchedule.data.map((entry, idx) => (
                        <tr
                          key={idx}
                          className={
                            entry.isBold
                              ? "font-bold bg-cyan-900/30 border-b border-slate-700"
                              : "border-b border-slate-700"
                          }
                        >
                          <td className="px-4 py-3 text-slate-200">
                            {entry.dateFormatted}
                          </td>
                          <td className="px-4 py-3 text-slate-200">
                            {entry.location}
                          </td>
                          <td className="px-4 py-3 text-slate-300">
                            {entry.schedule || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
