import Card from '~/components/Card'
import { Footer } from '~/components/Footer'
import { Icon } from '~/components/Icon'
import { PageHeader } from '~/components/PageHeader'
import type { Route } from './+types/home'

export function meta() {
    return [
        { title: 'Água de Víbora - Gestão de Águas Comunitárias' },
        {
            name: 'description',
            content:
                'Sistema secular de gestão de água em Abadim, Cabeceiras de Basto. Consulte horários de rega, crie calendários personalizados e exporte para PDF, Excel ou Google Calendar.',
        },
        {
            name: 'keywords',
            content:
                'água víbora, cabeceiras de basto, abadim, horário rega, levada, gestão água',
        },
        { property: 'og:title', content: 'Água de Víbora' },
        {
            property: 'og:description',
            content:
                'Sistema de gestão de águas comunitárias em Abadim, Cabeceiras de Basto',
        },
        { property: 'og:type', content: 'website' },
    ]
}

export async function loader() {
    return {
        info: {
            title: 'Sistema de Gestão de Águas de Víbora',
            subtitle: 'Abadim, Cabeceiras de Basto',
            description: `A Levada da Víbora é um sistema secular de gestão de água em Abadim. 
      Baseado numa organização comunitária rigorosa, divide o fluxo da Serra da Cabreira 
      por 'horas' e 'casais' entre os regantes da aldeia da Torre e de Santo António.`,
            heritage: `Este sistema alterna entre anos Pares e Ímpares, garantindo que a justiça 
      na distribuição da água se mantenha ao longo das gerações.`,
        },
    }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const { info } = loaderData

    return (
        <div className="relative w-full max-w-6xl mx-auto min-h-screen flex flex-col">
            <main className="grow">
                <div className="bg-slate-900/80 sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
                    <PageHeader
                        title={info.title}
                        subtitle={info.subtitle}
                        icon="balance"
                    />

                    <div className="p-6 sm:p-12 space-y-16">
                        <div className="max-w-3xl mx-auto text-center space-y-8">
                            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                                Uma Tradição que{' '}
                                <span className="text-cyan-500">Flui</span> no
                                Tempo
                            </h2>

                            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed font-light">
                                {info.description}
                            </p>

                            <div className="flex justify-center items-center gap-4">
                                <div className="h-px w-12 bg-slate-800"></div>
                                <Icon
                                    name="water"
                                    className="w-5 h-5 text-cyan-500/50"
                                />
                                <div className="h-px w-12 bg-slate-800"></div>
                            </div>

                            <p className="text-cyan-400 font-bold italic tracking-wide text-sm sm:text-base bg-cyan-500/5 py-3 px-6 rounded-full inline-block border border-cyan-500/10">
                                {info.heritage}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:justify-center">
                            <Card
                                color="cyan"
                                linkTo="/my-schedule"
                                title="Água de Víbora"
                                description="Consulta personalizada. Encontra rapidamente as tuas horas de rega."
                                actionLabel="Ver Meu Calendário"
                            />

                            <Card
                                color="emerald"
                                linkTo="/irrigation-pool-schedule"
                                title="Poça do Coblinho"
                                description="Acesso ao calendário específico da Poça do Coblinho e seus regantes."
                                actionLabel="Ver Calendário"
                            />

                            <Card
                                color="amber"
                                linkTo="/create-custom-schedule"
                                title="Configurações"
                                description="Ajusta horários e avianças personalizadas conforme a necessidade."
                                actionLabel="Configurar"
                            />

                            <Card
                                color="purple"
                                linkTo="/about"
                                title="Como Funciona"
                                description="Descobre a história e funcionamento do sistema de gestão de água."
                                actionLabel="Saber Mais"
                            />
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
