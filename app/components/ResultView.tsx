import { PageHeader } from "~/components/PageHeader";
import { ScheduleTable } from "~/components/ScheduleTable";
import { Icon } from "~/components/Icon";
import type { GeneratedSchedule } from "~/lib/types";

interface ResultViewProps {
  generatedSchedule: GeneratedSchedule;
  download: (format: "pdf" | "xlsx") => Promise<void>;
  isDownloading: boolean;
  activeFormat: "pdf" | "xlsx" | null;
  paginatedData: any[];
  totalPages: number;
  currentPage: number;
  pageNumbers: (number | "ellipsis")[];
  onBackClick: () => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
  goToPage: (page: number) => void;
}

export function ResultView({
  generatedSchedule,
  download,
  isDownloading,
  activeFormat,
  paginatedData,
  totalPages,
  currentPage,
  pageNumbers,
  onBackClick,
  onNextPage,
  onPreviousPage,
  goToPage,
}: ResultViewProps) {
  return (
    <>
      <PageHeader
        title={generatedSchedule.name || "Resultado"}
        subtitle={`Calendário para ${generatedSchedule.year}`}
        icon="template"
        backLabel="Voltar ao formulário"
        onClick={onBackClick}
      />

      <div className="px-4 sm:px-10 pt-6 flex flex-wrap gap-3 justify-end">
        <button
          onClick={() => download("pdf")}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/60 disabled:opacity-50 border border-white/5 text-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          {isDownloading && activeFormat === "pdf" ? (
            "A gerar..."
          ) : (
            <>
              <Icon name="download" className="w-3.5 h-3.5 text-cyan-400" />{" "}
              Exportar PDF
            </>
          )}
        </button>

        <button
          onClick={() => download("xlsx")}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/60 disabled:opacity-50 border border-white/5 text-slate-300 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
        >
          {isDownloading && activeFormat === "xlsx" ? (
            "A gerar..."
          ) : (
            <>
              <Icon name="download" className="w-3.5 h-3.5 text-emerald-400" />{" "}
              Exportar Excel
            </>
          )}
        </button>
      </div>

      <div className="p-4 sm:p-10 space-y-8">
        <ScheduleTable
          schedule={paginatedData}
          totalPages={totalPages}
          page={currentPage}
          pageNumbers={pageNumbers}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          goToPage={goToPage}
        />
      </div>
    </>
  );
}
