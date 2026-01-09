import type { GeneratedSchedule, ScheduleEntry } from '~/lib/types'
import { Icon } from '~/components/Icon'
import { PageHeader } from '~/components/PageHeader'
import { ScheduleTable } from '~/components/ScheduleTable'

interface ResultViewProps {
    generatedSchedule: GeneratedSchedule
    download: (format: 'pdf' | 'xlsx' | 'ics') => Promise<void>
    isDownloading: boolean
    activeFormat: 'pdf' | 'xlsx' | 'ics' | null
    paginatedData: ScheduleEntry[]
    totalPages: number
    currentPage: number
    pageNumbers: (number | 'ellipsis')[]
    onBackClick: () => void
    onNextPage: () => void
    onPreviousPage: () => void
    goToPage: (page: number) => void
}

export function ResultView({
    generatedSchedule,
    download,
    isDownloading,
    activeFormat,
    paginatedData,
    totalPages,
    currentPage,
    pageNumbers,
    onBackClick,
    onNextPage,
    onPreviousPage,
    goToPage,
}: ResultViewProps) {
    return (
        <>
            <PageHeader
                title={generatedSchedule.name || 'Resultado'}
                subtitle={`Calendário para ${generatedSchedule.year}`}
                icon="template"
                backLabel="Voltar ao formulário"
                onClick={onBackClick}
            />

            <div className="px-4 sm:px-10 pt-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 ml-1 text-cyan-400/70">
                        <Icon name="download" className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                            Exportar Calendário
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => download('pdf')}
                            disabled={isDownloading}
                            className="flex items-center gap-3 sm:gap-2 bg-slate-800/40 hover:bg-slate-800/60 disabled:opacity-50 border border-white/5 text-slate-300 px-6 py-3.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            {isDownloading && activeFormat === 'pdf' ? (
                                'A gerar...'
                            ) : (
                                <>
                                    <Icon
                                        name="download"
                                        className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-cyan-400"
                                    />
                                    PDF
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => download('xlsx')}
                            disabled={isDownloading}
                            className="flex items-center gap-3 sm:gap-2 bg-slate-800/40 hover:bg-slate-800/60 disabled:opacity-50 border border-white/5 text-slate-300 px-6 py-3.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            {isDownloading && activeFormat === 'xlsx' ? (
                                'A gerar...'
                            ) : (
                                <>
                                    <Icon
                                        name="download"
                                        className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-emerald-400"
                                    />
                                    Excel
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-10 space-y-8">
                <ScheduleTable
                    schedule={paginatedData}
                    totalPages={totalPages}
                    page={currentPage}
                    pageNumbers={pageNumbers}
                    onNextPage={onNextPage}
                    onPreviousPage={onPreviousPage}
                    goToPage={goToPage}
                />
            </div>
        </>
    )
}
