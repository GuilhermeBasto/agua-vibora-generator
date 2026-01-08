import { useNavigate, Link } from "react-router";
import type { Route } from "./+types/irrigation-pool-schedule";
import { generatePoolScheduleData } from "~/lib/poolSchedule.server";
import { getPageNumbers } from "~/lib/utils";
import { PageHeader } from "~/components/PageHeader";
import { Footer } from "~/components/Footer";
import { YearSelector } from "~/components/YearSelector";
import { Icon } from "~/components/Icon";
import { ScheduleTable } from "~/components/ScheduleTable";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const year = parseInt(
    url.searchParams.get("year") || String(new Date().getFullYear()),
    10
  );
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const fullSchedule = generatePoolScheduleData(year);
  const itemsPerPage = 20;
  const totalPages = Math.ceil(fullSchedule.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const pageData = fullSchedule.slice(startIndex, startIndex + itemsPerPage);

  return {
    year,
    page,
    totalPages,
    schedule: pageData,
  };
}

export default function MySchedulePage({ loaderData }: Route.ComponentProps) {
  const { year, page, totalPages, schedule } = loaderData;
  const pageNumbers = getPageNumbers(page, totalPages);
  const navigate = useNavigate();

  const handleYearChange = (newYear: number) => {
    navigate(`/irrigation-pool-schedule?year=${newYear}&page=1`);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto min-h-screen flex flex-col">
      <main className="grow pb-20">
        <div className="bg-slate-900/40 sm:rounded-[40px] shadow-2xl border-x sm:border border-white/5 overflow-hidden backdrop-blur-2xl">
          <PageHeader
            title={"Avança da Água do Coblinho"}
            subtitle={
              "Consulta e descarrega o horário de rega anual da poça do Coblinho"
            }
            icon="calendar"
            backLabel="voltar ao início"
            backLink="/"
          />

          <div className="p-6 sm:p-12 space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-2 ml-1 text-cyan-400">
                  <Icon name="calendar" className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                    Selecionar Ano
                  </span>
                </div>
                <YearSelector year={year} onYearChange={handleYearChange} />
              </div>

              <div className="lg:col-span-7 flex flex-wrap gap-2 lg:justify-end lg:pt-7">
                <Link
                  to={`/api/pdf?year=${year}&type=irrigation-pool`}
                  reloadDocument
                  className="flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 text-slate-300 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  <Icon name="download" className="w-3.5 h-3.5 text-cyan-400" />{" "}
                  Exportar PDF
                </Link>
                <Link
                  to={`/api/xlsx?year=${year}&type=irrigation-pool`}
                  reloadDocument
                  className="flex items-center gap-2 bg-slate-800/40 hover:bg-slate-800/60 border border-white/5 text-slate-300 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  <Icon
                    name="download"
                    className="w-3.5 h-3.5 text-emerald-400"
                  />{" "}
                  Exportar Excel
                </Link>
              </div>
            </div>

            <ScheduleTable
              schedule={schedule}
              totalPages={totalPages}
              page={page}
              pageNumbers={pageNumbers}
              onNextPage={() =>
                navigate(
                  `/irrigation-pool-schedule?year=${year}&page=${page + 1}`
                )
              }
              onPreviousPage={() =>
                navigate(
                  `/irrigation-pool-schedule?year=${year}&page=${page - 1}`
                )
              }
              goToPage={(pageNum) =>
                navigate(
                  `/irrigation-pool-schedule?year=${year}&page=${pageNum}`
                )
              }
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
