import type { Route } from "./+types/create-custom-schedule.view";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Footer } from "~/components/Footer";
import { ResultView } from "~/components/ResultView";
import type { GeneratedSchedule } from "~/lib/types";
import { usePagination } from "~/hooks/usePagination";
import { useDownload } from "~/hooks/useDownload";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resultado - Calendário Personalizado" },
    {
      name: "description",
      content: "Visualize e exporte seu calendário personalizado",
    },
  ];
}

export default function CreateCustomScheduleViewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [generatedSchedule, setGeneratedSchedule] =
    useState<GeneratedSchedule | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const state = location.state as { generatedSchedule?: GeneratedSchedule };
    if (state?.generatedSchedule) {
      setGeneratedSchedule(state.generatedSchedule);
    } else {
      navigate("/create-custom-schedule");
    }
  }, [location.state, navigate]);

  const { download, isDownloading, activeFormat } =
    useDownload(generatedSchedule);

  const { paginatedData, totalPages, pageNumbers } = usePagination(
    generatedSchedule?.data || [],
    currentPage
  );

  if (!generatedSchedule) {
    return null;
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto px-0 sm:px-4">
      <div className="bg-slate-900/80 sm:rounded-2xl shadow-2xl border-x sm:border border-slate-800 overflow-hidden backdrop-blur-xl transition-all duration-500">
        <ResultView
          generatedSchedule={generatedSchedule}
          download={download}
          isDownloading={isDownloading}
          activeFormat={activeFormat}
          paginatedData={paginatedData}
          totalPages={totalPages}
          currentPage={currentPage}
          pageNumbers={pageNumbers}
          onBackClick={() => navigate("/create-custom-schedule")}
          onNextPage={() => setCurrentPage((prev) => prev + 1)}
          onPreviousPage={() => setCurrentPage((prev) => prev - 1)}
          goToPage={(p) => setCurrentPage(p)}
        />
      </div>
      <Footer />
    </div>
  );
}
