import { Link } from "react-router";
import { PageHeader } from "~/components/PageHeader";
import { Icon } from "~/components/Icon";
import { Footer } from "~/components/Footer";
import type { Route } from "./+types/home";
import Card from "~/components/Card";

export async function loader() {
  return {
    info: {
      title: "Sistema de Gestão de Águas de Víbora",
      subtitle: "Abadim, Cabeceiras de Basto",
      description: `A Levada da Víbora é um sistema secular de gestão de água em Abadim. 
      Baseado numa organização comunitária rigorosa, divide o fluxo da Serra da Cabreira 
      por 'horas' e 'casais' entre os regantes da aldeia da Torre e de Santo António.`,
      heritage: `Este sistema alterna entre anos Pares e Ímpares, garantindo que a justiça 
      na distribuição da água se mantenha ao longo das gerações.`,
    },
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { info } = loaderData;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-6 sm:px-0">
      <div className="bg-slate-900/80 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
        <PageHeader
          title={info.title}
          subtitle={info.subtitle}
          icon="balance"
        />

        <div className="p-6 sm:p-12 space-y-16">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              color="cyan"
              linkTo="/my-schedule"
              title="O Meu Horário"
              description="Consulta personalizada. Encontra rapidamente as tuas horas de rega."
              actionLabel="Consultar"
            />

            <Card
              color="emerald"
              linkTo="/irrigation-pool-schedule"
              title="Poça do Coblinho"
              description="Acesso ao calendário específico da Poça do Coblinho e seus regantes."
              actionLabel="Ver Calendário"
            />

            <Card
              color="purple"
              linkTo="/template"
              title="Calendário Geral"
              description="Consulta o calendário padrão da Víbora para todos os casais."
              actionLabel="Ver Tudo"
            />

            <Card
              color="amber"
              linkTo="/create-custom-schedule"
              title="Configurações"
              description="Ajusta horários e avianças personalizadas conforme a necessidade."
              actionLabel="Configurar"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
