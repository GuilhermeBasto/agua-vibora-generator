import { useSearchParams, Link } from "react-router";
import { Header } from "./Header";
import { YearSelector } from "./YearSelector";
import { DownloadSection } from "./DownloadSection";
import { InfoCard } from "./InfoCard";
import { Icon } from "./Icon";
import { Footer } from "./Footer";

export function WaterManagement() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Obtém o ano da URL ou usa o ano atual como fallback
  const year = parseInt(
    searchParams.get("year") || String(new Date().getFullYear()),
    10
  );

  const handleYearChange = (newYear: number) => {
    setSearchParams({ year: String(newYear) });
  };

  return (
    <div className="relative w-full max-w-6xl">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-sm">
        <Header />

        <div className="p-8 space-y-8">
          <YearSelector year={year} onYearChange={handleYearChange} />

          <DownloadSection
            title="Descarregar Calendários Completos"
            buttons={[
              {
                label: "Excel (XLSX)",
                href: `/api/xlsx?year=${year}`,
                variant: "excel" as const,
                icon: "download",
              },
              {
                label: "PDF",
                href: `/api/pdf?year=${year}`,
                variant: "pdf" as const,
                icon: "file",
              },
            ]}
          />

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Visualizar Calendário
            </label>
            <Link
              to={`/schedule-display?year=${year}`}
              className="w-full group relative bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 inline-flex items-center justify-center"
            >
              <Icon name="eye" className="w-5 h-5 mr-2" />
              <span>Pré-visualizar Calendário</span>
            </Link>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Configurações Personalizadas
            </label>
            <Link
              to="/create-custom-schedule"
              className="w-full group relative bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 inline-flex items-center justify-center"
            >
              <Icon name="template" className="w-5 h-5 mr-2" />
              <span>Criar Calendário Personalizado</span>
            </Link>
          </div>

          <DownloadSection
            title="Descarregar Template (sem horários)"
            buttons={[
              {
                label: "Template Excel (XLSX)",
                href: `/api/xlsx?year=${year}&template=true`,
                variant: "template" as const,
                icon: "template",
              },
              {
                label: "Template PDF",
                href: `/api/pdf?year=${year}&template=true`,
                variant: "template" as const,
                icon: "template",
              },
            ]}
          />

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Adicionar ao Calendário
            </label>
            <Link
              to={`/api/ics?year=${year}`}
              reloadDocument
              className="w-full group relative bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 inline-flex flex-col items-center justify-center"
            >
              <div className="flex items-center space-x-2">
                <Icon name="calendar" className="w-5 h-5" />
                <span>Descarregar Calendário (.ics)</span>
              </div>
              <p className="text-xs text-violet-200 mt-2">
                Para Google Calendar, Outlook, Apple Calendar
              </p>
            </Link>
          </div>

          <InfoCard />
        </div>
      </div>

      <Footer />
    </div>
  );
}
