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
  };
}

export default function ScheduleDisplay({ loaderData }: Route.ComponentProps) {
  const { year, page, totalPages, totalEntries, schedule } = loaderData;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="relative w-full max-w-6xl">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <PageHeader
          title={`Aviança da Água de Víbora - Ano ${year}`}
          subtitle={`Total: ${totalEntries} dias • Página ${page} de ${totalPages}`}
          icon="calendar"
          backLabel="voltar"
          backLink="/"
        />

        <div className="p-4 sm:p-8 space-y-6">
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
                {schedule.map((entry, idx) => (
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

          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                {page > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/schedule-display?year=${year}&page=${page - 1}`}
                      className="text-slate-200 hover:text-white hover:bg-slate-800"
                    />
                  </PaginationItem>
                )}

                {pageNumbers.map((pageNum, idx) =>
                  pageNum === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis className="text-slate-400" />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={`/schedule-display?year=${year}&page=${pageNum}`}
                        isActive={page === pageNum}
                        className={
                          page === pageNum
                            ? "bg-cyan-500 text-white hover:bg-cyan-600 border-cyan-500"
                            : "text-slate-200 hover:text-white hover:bg-slate-800 border-slate-700"
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
                      className="text-slate-200 hover:text-white hover:bg-slate-800"
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export const meta: Route.MetaFunction = ({ loaderData }) => {
  return [
    { title: `Calendário de Rega ${loaderData.year}` },
    {
      name: "description",
      content: `Visualize o calendário de rega de ${loaderData.year}. Total de ${loaderData.totalEntries} dias de irrigação.`,
    },
  ];
};
