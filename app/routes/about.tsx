import { Link } from 'react-router'
import { VILLAGES } from '~/lib/schedule.server'
import { Footer } from '~/components/Footer'
import { Icon } from '~/components/Icon'
import { PageHeader } from '~/components/PageHeader'
import type { Route } from './+types/about'

export function meta() {
    return [
        { title: 'Sobre o Sistema - Água de Víbora' },
        {
            name: 'description',
            content:
                'Conheça a história e o funcionamento do sistema secular de gestão de água da Levada da Víbora em Abadim, Cabeceiras de Basto.',
        },
        {
            name: 'keywords',
            content:
                'levada víbora, história, tradição, abadim, sistema rega, cabeceiras basto',
        },
    ]
}

export async function loader() {
    return {
        header: {
            title: 'Como Funciona',
            subtitle: 'O Sistema de Água de Víbora',
        },
        sections: {
            history: {
                title: 'Uma Tradição Secular',
                paragraphs: [
                    'A Levada da Víbora é um sistema de gestão comunitária de água que atravessa gerações em Abadim, Cabeceiras de Basto.',
                    'Este sistema distribui o fluxo de água proveniente da Serra da Cabreira por "horas" e "casais" (lugares) entre os regantes da aldeia da Torre e de Santo António.',
                ],
            },
            heritage: {
                title: 'Uma História Pessoal',
                content:
                    'Este sistema foi-me ensinado pelo meu pai, que adorava profundamente esta tradição e que, por sua vez, tinha sido ensinado pelo seu avô. É um conhecimento que passa de geração em geração, carregado de memórias e sabedoria ancestral. Criei esta aplicação para garantir que este legado familiar e comunitário não seja esquecido, preservando-o digitalmente para as gerações futuras.',
            },
            rotation: {
                title: 'Como Funciona a Rotação',
                principles: [
                    {
                        title: 'Rotação Anual',
                        description:
                            'Todos os anos a ordem dos casais muda, garantindo justiça na distribuição.',
                    },
                    {
                        title: 'Anos Pares vs Ímpares',
                        description:
                            'Horários diferentes conforme o ano, alternando prioridades entre Torre e Santo António.',
                    },
                    {
                        title: 'Ciclo de 11 Dias',
                        description:
                            'São 11 casais que recebem água numa ordem rotativa, repetindo o ciclo.',
                    },
                ],
                period: {
                    title: 'Período de Rega',
                    description:
                        'O sistema opera anualmente entre 25 de Junho e 29 de Setembro, num total de aproximadamente 97 dias de ciclo de rega.',
                },
            },
            villages: {
                title: 'Os Casais (Lugares)',
                torre: VILLAGES.Torre,
                santo: VILLAGES['Santo-Antonio'],
            },
            ancestral: {
                title: 'Uma Tradição Ancestral: O Dia Começa ao Pôr do Sol',
                intro: [
                    'Uma das características mais únicas deste sistema é que segue uma tradição ancestral onde o "dia" não começa à meia-noite, mas sim ao pôr do sol.',
                    'Isto significa que quando um horário de rega é marcado para começar "à noite", ele na realidade pertence ao dia anterior no calendário moderno.',
                ],
                example: {
                    tableText: '25 de agosto - 10 da noite até à 1h30',
                    calendarText: '24 de agosto às 22:00',
                    explanation:
                        'Isto respeita a tradição ancestral onde a "noite" pertence ao dia seguinte.',
                },
                precision: {
                    title: 'Precisão Astronómica',
                    description:
                        'Este sistema calcula o pôr do sol exato para Abadim todos os dias, porque o pôr do sol varia ao longo do ano:',
                    seasons: [
                        { name: 'Verão (Junho-Julho)', time: '~21:30h' },
                        { name: 'Outono (Setembro)', time: '~20:00h' },
                    ],
                },
            },
            usage: {
                title: 'Como Usar Esta Aplicação',
                steps: [
                    {
                        title: '1. Consultar',
                        description:
                            'Escolha o ano e veja o calendário completo com todos os horários de rega.',
                    },
                    {
                        title: '2. Exportar',
                        description:
                            'Descarregue em PDF para imprimir, Excel para editar, ou ICS para o seu calendário.',
                    },
                    {
                        title: '3. Notificações',
                        description:
                            'Adicione ao Google Calendar ou Apple Calendar e receba alertas 2 horas antes.',
                    },
                ],
            },
            formats: {
                title: 'Formatos Disponíveis',
                items: [
                    {
                        name: 'PDF',
                        description:
                            'Perfeito para imprimir e afixar. Visual e pronto a usar.',
                    },
                    {
                        name: 'Excel',
                        description:
                            'Editável. Pode modificar horários e fazer ajustes conforme necessário.',
                    },
                    {
                        name: 'ICS (Calendário)',
                        description:
                            'Integra com Google Calendar, Apple Calendar e outros. Receba notificações automáticas.',
                    },
                ],
            },
            preservation: {
                title: 'Preservação Cultural',
                items: [
                    {
                        title: 'Documenta',
                        description:
                            'Regista tradições seculares para as gerações futuras.',
                    },
                    {
                        title: 'Mantém Viva',
                        description:
                            'A gestão comunitária da água continua através da tecnologia.',
                    },
                    {
                        title: 'Moderniza',
                        description:
                            'Ferramentas digitais sem perder a essência tradicional.',
                    },
                    {
                        title: 'Facilita',
                        description:
                            'A participação das novas gerações na tradição comunitária.',
                    },
                ],
            },
        },
    }
}

export default function About({ loaderData }: Route.ComponentProps) {
    const { header, sections } = loaderData
    return (
        <div className="relative w-full max-w-6xl mx-auto min-h-screen flex flex-col">
            <main className="grow">
                <div className="bg-slate-900/80 sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
                    <PageHeader
                        title={header.title}
                        subtitle={header.subtitle}
                        icon="info"
                        backLink="/"
                        backLabel="Voltar ao Início"
                    />

                    <div className="p-6 sm:p-12 space-y-12">
                        {/* Contexto Histórico */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="book"
                                    className="w-6 h-6 text-cyan-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.history.title}
                                </h2>
                            </div>

                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                {sections.history.paragraphs.map(
                                    (paragraph, index) => (
                                        <p
                                            key={index}
                                            className={
                                                index === 0 ? 'text-lg' : ''
                                            }
                                        >
                                            {paragraph}
                                        </p>
                                    )
                                )}
                            </div>
                        </section>

                        {/* História Pessoal */}
                        <section className="space-y-6">
                            <div className="bg-linear-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-8 border border-amber-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="shrink-0">
                                        <Icon
                                            name="heart"
                                            className="w-8 h-8 text-amber-400"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">
                                            {sections.heritage.title}
                                        </h2>
                                        <p className="text-slate-300 leading-relaxed italic">
                                            {sections.heritage.content}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Como Funciona */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="rotate"
                                    className="w-6 h-6 text-emerald-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.rotation.title}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {sections.rotation.principles.map(
                                    (principle, index) => {
                                        const colors = [
                                            'cyan',
                                            'emerald',
                                            'amber',
                                        ]
                                        const color = colors[index]
                                        return (
                                            <div
                                                key={index}
                                                className={`bg-${color}-500/5 rounded-2xl p-6 border border-${color}-500/20`}
                                            >
                                                <h3
                                                    className={`text-lg font-bold text-${color}-400 mb-3`}
                                                >
                                                    {principle.title}
                                                </h3>
                                                <p className="text-sm text-slate-300">
                                                    {principle.description}
                                                </p>
                                            </div>
                                        )
                                    }
                                )}
                            </div>

                            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Icon
                                        name="calendar"
                                        className="w-5 h-5 text-cyan-500"
                                    />
                                    {sections.rotation.period.title}
                                </h3>
                                <p className="text-slate-300">
                                    {sections.rotation.period.description}
                                </p>
                            </div>
                        </section>

                        {/* Os Casais */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="home"
                                    className="w-6 h-6 text-amber-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.villages.title}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-cyan-500/5 rounded-2xl p-6 border border-cyan-500/20">
                                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
                                        <Icon
                                            name="tower"
                                            className="w-5 h-5"
                                        />
                                        Torre
                                    </h3>
                                    <ul className="space-y-2 text-slate-300">
                                        {sections.villages.torre.map(
                                            (village) => (
                                                <li
                                                    key={village}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                                                    {village}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div className="bg-emerald-500/5 rounded-2xl p-6 border border-emerald-500/20">
                                    <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                        <Icon
                                            name="church"
                                            className="w-5 h-5"
                                        />
                                        Santo António
                                    </h3>
                                    <ul className="space-y-2 text-slate-300">
                                        {sections.villages.santo.map(
                                            (village) => (
                                                <li
                                                    key={village}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    {village}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <p className="text-slate-400 text-center text-sm">
                                <span className="text-white font-bold">
                                    11 casais
                                </span>{' '}
                                que recebem água numa ordem rotativa
                            </p>
                        </section>

                        {/* Sistema Ancestral */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="sunset"
                                    className="w-6 h-6 text-orange-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.ancestral.title}
                                </h2>
                            </div>

                            <div className="space-y-4 text-slate-300 leading-relaxed">
                                {sections.ancestral.intro.map(
                                    (paragraph, index) => (
                                        <p
                                            key={index}
                                            className={
                                                index === 0 ? 'text-lg' : ''
                                            }
                                        >
                                            {paragraph}
                                        </p>
                                    )
                                )}
                            </div>

                            <div className="bg-linear-to-br from-orange-500/10 to-amber-500/10 rounded-2xl p-6 border border-orange-500/20">
                                <h3 className="text-lg font-bold text-orange-400 mb-3">
                                    Exemplo Prático:
                                </h3>
                                <div className="space-y-3 text-slate-300">
                                    <p>
                                        Se a tabela mostra:{' '}
                                        <span className="text-white font-mono bg-slate-800/50 px-2 py-1 rounded">
                                            {
                                                sections.ancestral.example
                                                    .tableText
                                            }
                                        </span>
                                    </p>
                                    <p>
                                        O evento no calendário digital começa:{' '}
                                        <span className="text-cyan-400 font-bold">
                                            {
                                                sections.ancestral.example
                                                    .calendarText
                                            }
                                        </span>
                                    </p>
                                    <p className="text-sm text-slate-400">
                                        {sections.ancestral.example.explanation}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/50">
                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                    <Icon
                                        name="sun"
                                        className="w-5 h-5 text-yellow-500"
                                    />
                                    {sections.ancestral.precision.title}
                                </h3>
                                <p className="text-slate-300 mb-3">
                                    {sections.ancestral.precision.description}
                                </p>
                                <ul className="space-y-2 text-slate-400 text-sm">
                                    {sections.ancestral.precision.seasons.map(
                                        (season) => (
                                            <li
                                                key={season.name}
                                                className="flex justify-between"
                                            >
                                                <span>{season.name}:</span>
                                                <span className="text-orange-400 font-semibold">
                                                    {season.time}
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </section>

                        {/* Como Usar */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="help"
                                    className="w-6 h-6 text-purple-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.usage.title}
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {sections.usage.steps.map((step, index) => {
                                    const icons = [
                                        'calendar',
                                        'download',
                                        'bell',
                                    ]
                                    const colors = ['cyan', 'emerald', 'purple']
                                    const icon = icons[index]
                                    const color = colors[index]
                                    return (
                                        <div
                                            key={index}
                                            className="bg-slate-800/40 rounded-xl p-5 border border-slate-700/50 space-y-3"
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full bg-${color}-500/10 flex items-center justify-center`}
                                            >
                                                <Icon
                                                    name={icon}
                                                    className={`w-6 h-6 text-${color}-500`}
                                                />
                                            </div>
                                            <h3 className="text-lg font-bold text-white">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-slate-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Formatos Disponíveis */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="file"
                                    className="w-6 h-6 text-slate-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.formats.title}
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {sections.formats.items.map((format, index) => {
                                    const icons = ['file', 'table', 'calendar']
                                    const colors = ['red', 'green', 'blue']
                                    const icon = icons[index]
                                    const color = colors[index]
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-start gap-4 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50"
                                        >
                                            <Icon
                                                name={icon}
                                                className={`w-5 h-5 text-${color}-500 mt-1`}
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-white font-bold">
                                                    {format.name}
                                                </h3>
                                                <p className="text-sm text-slate-400">
                                                    {format.description}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Preservação Cultural */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <Icon
                                    name="heart"
                                    className="w-6 h-6 text-red-500"
                                />
                                <h2 className="text-2xl sm:text-3xl font-black text-white">
                                    {sections.preservation.title}
                                </h2>
                            </div>

                            <div className="bg-linear-to-br from-cyan-500/10 to-emerald-500/10 rounded-2xl p-8 border border-cyan-500/20">
                                <div className="grid md:grid-cols-2 gap-6 text-slate-300">
                                    {sections.preservation.items.map(
                                        (item, index) => {
                                            const icons = [
                                                'book',
                                                'rotate',
                                                'sparkles',
                                                'users',
                                            ]
                                            const colors = [
                                                'cyan',
                                                'emerald',
                                                'purple',
                                                'amber',
                                            ]
                                            const icon = icons[index]
                                            const color = colors[index]
                                            return (
                                                <div
                                                    key={index}
                                                    className="space-y-2"
                                                >
                                                    <div
                                                        className={`flex items-center gap-2 text-${color}-400 font-bold`}
                                                    >
                                                        <Icon
                                                            name={icon}
                                                            className="w-4 h-4"
                                                        />
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            )
                                        }
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* CTA */}
                        <div className="text-center pt-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-cyan-500/25"
                            >
                                <Icon name="home" className="w-5 h-5" />
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
