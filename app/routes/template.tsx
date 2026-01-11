import { useSearchParams, useNavigation, Link } from 'react-router'
import { useCloseKeyboardOnNavigation } from '~/hooks/useCloseKeyboardOnNavigation'
import { DownloadSection } from '~/components/DownloadSection'
import { Footer } from '~/components/Footer'
import { Icon } from '~/components/Icon'
import { InfoCard } from '~/components/InfoCard'
import { LoadingOverlay } from '~/components/LoadingOverlay'
import { PageHeader } from '~/components/PageHeader'
import { YearSelector } from '~/components/YearSelector'
import type { Route } from './+types/my-schedule'

export function meta({ loaderData }: Route.MetaArgs) {
    const year = loaderData?.year || new Date().getFullYear()
    return [
        { title: `Templates e Downloads - Água de Víbora ${year}` },
        {
            name: 'description',
            content: `Baixe templates e calendários da água de Víbora para ${year}. Formatos disponíveis: PDF, Excel e Google Calendar (ICS).`,
        },
    ]
}

export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url)
    const year = parseInt(
        url.searchParams.get('year') || String(new Date().getFullYear()),
        10
    )
    return { year }
}

export default function Index({ loaderData }: Route.ComponentProps) {
    const [, setSearchParams] = useSearchParams()
    const navigation = useNavigation()
    const { year } = loaderData

    const isLoading = navigation.state === 'loading'

    // Close keyboard when navigation starts
    useCloseKeyboardOnNavigation()

    const handleYearChange = (newYear: number) => {
        setSearchParams({ year: String(newYear) })
    }

    return (
        <div className="relative w-full max-w-6xl mx-auto">
            <LoadingOverlay isLoading={isLoading} />

            <div className="bg-slate-900/80 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden backdrop-blur-xl">
                <PageHeader
                    title={'Calendário Geral de Rega'}
                    subtitle={'Visualize e baixe o calendário completo de rega'}
                    icon="calendar"
                    backLabel="voltar ao início"
                    backLink="/"
                />

                <div className="p-6 sm:p-10 space-y-10">
                    <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50">
                        <YearSelector
                            year={year}
                            onYearChange={handleYearChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] ml-1">
                                Visualização Direta
                            </div>
                            <Link
                                to={`/my-schedule?year=${year}`}
                                className="w-full group relative bg-linear-to-r from-purple-600/90 to-indigo-700/90 hover:from-purple-500 hover:to-indigo-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 flex items-center justify-center border border-white/10"
                            >
                                <Icon
                                    name="eye"
                                    className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                                />
                                <span>Pré-visualizar Calendário</span>
                            </Link>
                        </div>

                        <div className="space-y-4">
                            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] ml-1">
                                Administração
                            </div>
                            <Link
                                to="/create-custom-schedule"
                                className="w-full group relative bg-linear-to-r from-amber-600/90 to-orange-700/90 hover:from-amber-500 hover:to-orange-600 text-white font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 flex items-center justify-center border border-white/10"
                            >
                                <Icon
                                    name="template"
                                    className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform"
                                />
                                <span>Criar Configuração Personalizada</span>
                            </Link>
                        </div>
                    </div>

                    {/* Template e Calendário Digital */}
                    <div className="pt-4 border-t border-slate-800">
                        <DownloadSection
                            title="Templates e Integrações Digitais"
                            buttons={[
                                {
                                    label: 'Excel (Vazio)',
                                    href: `/api/xlsx?year=${year}&template=true`,
                                    variant: 'template' as const,
                                    icon: 'template',
                                },
                                {
                                    label: 'PDF (Vazio)',
                                    href: `/api/pdf?year=${year}&template=true`,
                                    variant: 'template' as const,
                                    icon: 'template',
                                },
                            ]}
                        />
                    </div>

                    <div className="mt-4">
                        <InfoCard />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
