import type { ScheduleEntry } from "~/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
} from "./ui/pagination";
import { cn } from "~/lib/utils";

interface Props {
  schedule: ScheduleEntry[];
  totalPages: number;
  page: number;
  pageNumbers: (number | "ellipsis")[];
  hasPagination?: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  goToPage: (page: number) => void;
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-8 py-6 text-[11px] font-black text-cyan-400 uppercase tracking-[0.25em] whitespace-nowrap">
    {children}
  </th>
);

export function ScheduleTable({
  schedule,
  totalPages,
  page,
  pageNumbers,
  hasPagination = true,
  onNextPage,
  onPreviousPage,
  goToPage,
}: Props) {
  const showPagination = hasPagination && totalPages > 1;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return (
    <>
      <div className="overflow-hidden bg-slate-950/20 border border-white/5 rounded-[32px] shadow-2xl">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-white/2">
                <Th>Data</Th>
                <Th>Casal</Th>
                <Th>Horário</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {schedule.map((entry, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "group transition-colors hover:bg-white/2",
                    entry.isBold ? "bg-cyan-500/3" : ""
                  )}
                >
                  <td className="px-8 py-5 text-slate-400 text-sm whitespace-nowrap">
                    {entry.dateFormatted}
                  </td>
                  <td
                    className={cn(
                      "px-8 py-5 text-lg whitespace-nowrap",
                      entry.isBold
                        ? "text-white font-bold"
                        : "text-slate-200 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {entry.isBold && (
                        <div className="w-1 h-5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
                      )}
                      {entry.location}
                    </div>
                  </td>
                  <td className="px-8 py-5 font-mono text-slate-500 group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                    {entry.schedule || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && (
        <div className="flex flex-col items-center space-y-4 pt-4">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            Página {page} de {totalPages}
          </p>
          <Pagination>
            <PaginationContent className="gap-2">
              {hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious
                    onClick={onPreviousPage}
                    className="bg-slate-900 border-white/5 text-slate-400 rounded-xl px-4 hover:bg-slate-800 transition-colors"
                  />
                </PaginationItem>
              )}

              {pageNumbers.map((pageNum, idx) => (
                <PaginationItem key={idx}>
                  {pageNum === "ellipsis" ? (
                    <PaginationEllipsis className="text-slate-600" />
                  ) : (
                    <PaginationLink
                      onClick={() => goToPage && goToPage(pageNum)}
                      isActive={page === pageNum}
                      className={`rounded-xl w-10 h-10 font-bold transition-all ${
                        page === pageNum
                          ? "bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-500/20"
                          : "bg-slate-900/50 text-slate-400 border-white/5 hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    onClick={onNextPage}
                    className="bg-slate-900 border-white/5 text-slate-400 rounded-xl px-4 hover:bg-slate-800 transition-colors"
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
