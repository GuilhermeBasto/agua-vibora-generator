import type { Route } from "./+types/create-custom-schedule";
import { useFetcher } from "react-router";
import { ConfigurationForm } from "~/components/ConfigurationForm";
import { Footer } from "~/components/Footer";
import { PageHeader } from "~/components/PageHeader";
import type { CustomSchedule, GeneratedSchedule } from "~/lib/types";
import { useEffect, useState } from "react";
import { ScheduleTable } from "~/components/ScheduleTable";
import { usePagination } from "~/hooks/usePagination";
import InfoBlock from "~/components/InfoBlock";

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
  const [currentPage, setCurrentPage] = useState(1);
  const fetcher = useFetcher<GeneratedSchedule>();

  const { paginatedData, totalPages, pageNumbers } = usePagination(
    generatedSchedule?.data || [],
    currentPage
  );

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      setGeneratedSchedule(fetcher.data);
      setCurrentPage(1);
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
            <div className="p-4 sm:p-10 ">
              <InfoBlock
                text="Esta ferramenta permite criar uma aviança personalizada. Defina os seus próprios horários e rotações para as aldeias conforme as suas necessidades."
                type="warning"
              />

              <div className="mt-8 bg-slate-950/30 rounded-2xl border border-slate-700/30 p-2 sm:p-6">
                <ConfigurationForm onSubmit={handleFormSubmit} />
              </div>
            </div>
          </>
        ) : (
          <>
            <PageHeader
              title={generatedSchedule.name || "Resultado da Aviança"}
              subtitle={`Calendário personalizado para o ano ${generatedSchedule.year}`}
              icon="check"
              backLabel="Voltar"
              onClick={() => setGeneratedSchedule(null)}
            />

            <div className="p-4 sm:p-10 space-y-8">
              {generatedSchedule && (
                <ScheduleTable
                  schedule={paginatedData}
                  totalPages={totalPages}
                  page={currentPage}
                  pageNumbers={pageNumbers}
                  onNextPage={() => setCurrentPage((prev) => prev + 1)}
                  onPreviousPage={() => setCurrentPage((prev) => prev - 1)}
                  goToPage={(pageNum) => setCurrentPage(pageNum)}
                />
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
