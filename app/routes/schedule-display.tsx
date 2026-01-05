import type { Route } from "./+types/schedule-display";
import { generateScheduleData } from "~/lib/schedule.server";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { getPageNumbers } from "~/lib/utils";
import { PageHeader } from "~/components/PageHeader";
import { Footer } from "~/components/Footer";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const year = parseInt(
    url.searchParams.get("year") || String(new Date().getFullYear()),
    10
  );
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  if (isNaN(year)) {
    throw new Response("Invalid year", { status: 400 });
  }

  const fullSchedule = generateScheduleData(year, false);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(fullSchedule.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const pageData = fullSchedule.slice(startIndex, startIndex + itemsPerPage);

  return {
    year,
    page,
    totalPages,
    totalEntries: fullSchedule.length,
    schedule: pageData,
    info: {
      title: `Calendário da Aviança`,
      subtitle: `Ano ${year} • Ciclo de Partilha de Água`,
      description: `Consulta detalhada das horas e momentos de rega para os herdeiros de Abadim.`,
    },
  };
}

export default function ScheduleDisplay({ loaderData }: Route.ComponentProps) {
  const { year, page, totalPages, totalEntries, schedule, info } = loaderData;
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      {/* Background Gradient Overlay (Mix com a Home) */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-emerald-950/20 pointer-events-none -z-10"></div>

      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <PageHeader
          title={info.title}
          subtitle={`${info.subtitle} (${totalEntries} entradas)`}
          icon="calendar"
          backLabel="voltar ao início"
          backLink="/"
        />

        <div className="p-4 sm:p-8 space-y-6">
          {/* Texto de Apoio Estilo Home */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              {info.description} Os períodos destacados em{" "}
              <span className="text-cyan-400 font-bold">azul</span> representam
              trocas de ciclo ou momentos de relevância na Aviança.
            </p>
          </div>

          <div className="overflow-hidden border border-slate-700/50 rounded-xl bg-slate-800/20">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-slate-800/80">
                <tr>
                  <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider">
                    Data e Momento
                  </th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider">
                    Aldeia / Herdeiro
                  </th>
                  <th className="px-6 py-4 text-left text-cyan-400 font-bold uppercase tracking-wider">
                    Horário de Rega
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {schedule.map((entry, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors hover:bg-slate-700/30 ${
                      entry.isBold ? "bg-cyan-500/10 font-semibold" : ""
                    }`}
                  >
                    <td className="px-6 py-4 text-slate-200">
                      {entry.dateFormatted}
                    </td>
                    <td
                      className={`px-6 py-4 ${entry.isBold ? "text-cyan-400" : "text-slate-200"}`}
                    >
                      {entry.location}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono">
                      {entry.schedule || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação Estilizada */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center space-y-4 pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-widest">
                Página {page} de {totalPages}
              </p>
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href={`/schedule-display?year=${year}&page=${page - 1}`}
                        className="text-slate-300 hover:bg-slate-800 border-slate-700"
                      />
                    </PaginationItem>
                  )}

                  {pageNumbers.map((pageNum, idx) =>
                    pageNum === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis className="text-slate-600" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href={`/schedule-display?year=${year}&page=${pageNum}`}
                          isActive={page === pageNum}
                          className={
                            page === pageNum
                              ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/20"
                              : "text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800"
                          }
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  {page < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href={`/schedule-display?year=${year}&page=${page + 1}`}
                        className="text-slate-300 hover:bg-slate-800 border-slate-700"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return [
    { title: `Calendário de Rega ${loaderData.year} | Levada da Víbora` },
    {
      name: "description",
      content: `Consulte a escala de rega da Levada da Víbora para o ano ${loaderData.year}.`,
    },
  ];
};
