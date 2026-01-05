import { Link } from "react-router";
import { PageHeader } from "~/components/PageHeader";
import { Icon } from "~/components/Icon";
import { Footer } from "~/components/Footer";
import type { Route } from "./+types/home";

export async function loader() {
  return {
    info: {
      title: "Levada da Víbora",
      subtitle: "Abadim, Cabeceiras de Basto",
      description: `A Levada da Víbora é um sistema secular de gestão de água em Abadim. 
      Baseado numa organização comunitária rigorosa, divide o fluxo da Serra da Cabreira 
      por 'horas' e 'momentos' entre os herdeiros da Torre e Santo António.`,
      heritage: `Este sistema alterna entre anos Pares e Ímpares, garantindo que a justiça 
      na distribuição da água se mantenha ao longo das gerações.`,
    },
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { info } = loaderData;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6 sm:px-0">
      {/* Background Global */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950/20 via-slate-950 to-emerald-950/20 pointer-events-none -z-10"></div>

      <div className="bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
        {/* O Header agora será o escuro/compacto que definiu no componente */}
        <PageHeader
          title={info.title}
          subtitle={info.subtitle}
          icon="balance"
        />

        <div className="p-6 sm:p-12 space-y-16">
          {/* Seção de Texto Imersivo */}
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Uma Tradição que <span className="text-cyan-500">Flui</span> no
              Tempo
            </h2>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
              {info.description}
            </p>

            <div className="flex justify-center items-center gap-4">
              <div className="h-px w-12 bg-slate-800"></div>
              <Icon name="water" className="w-5 h-5 text-cyan-500/50" />
              <div className="h-px w-12 bg-slate-800"></div>
            </div>

            <p className="text-cyan-400 font-bold italic tracking-wide text-sm sm:text-base bg-cyan-500/5 py-3 px-6 rounded-full inline-block border border-cyan-500/10">
              {info.heritage}
            </p>
          </div>

          {/* Grid de Navegação Principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card: O Meu Horário */}
            <Link
              to="/my-schedule"
              className="group relative p-8 bg-slate-950/40 hover:bg-cyan-500/[0.03] border border-slate-800 hover:border-cyan-500/50 rounded-3xl transition-all duration-500"
            >
              <div className="mb-6 inline-flex p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 group-hover:scale-110 transition-transform duration-500">
                <Icon name="user" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                O Meu Horário
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Consulta personalizada para herdeiros. Encontra rapidamente as
                tuas horas pelo nome.
              </p>
              <div className="flex items-center text-cyan-400 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Aceder Agora{" "}
                <Icon name="arrow-right" className="w-4 h-4 ml-2" />
              </div>
            </Link>

            {/* Card: Calendário Geral */}
            <Link
              to="/schedule-display"
              className="group relative p-8 bg-slate-950/40 hover:bg-purple-500/[0.03] border border-slate-800 hover:border-purple-500/50 rounded-3xl transition-all duration-500"
            >
              <div className="mb-6 inline-flex p-4 bg-purple-500/10 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform duration-500">
                <Icon name="calendar" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Calendário Geral
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Visualização do ciclo completo. Exporta para PDF ou Google
                Calendar.
              </p>
              <div className="flex items-center text-purple-400 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Ver Completo{" "}
                <Icon name="arrow-right" className="w-4 h-4 ml-2" />
              </div>
            </Link>

            {/* Card: Configurações */}
            <Link
              to="/create-custom-schedule"
              className="group relative p-8 bg-slate-950/40 hover:bg-amber-500/[0.03] border border-slate-800 hover:border-amber-500/50 rounded-3xl transition-all duration-500"
            >
              <div className="mb-6 inline-flex p-4 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform duration-500">
                <Icon name="template" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Configurações
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Gestão técnica de aldeias e ciclos. Exclusivo para juízes e
                administradores.
              </p>
              <div className="flex items-center text-amber-400 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                Área Técnica{" "}
                <Icon name="arrow-right" className="w-4 h-4 ml-2" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
