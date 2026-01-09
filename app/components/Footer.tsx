import { Icon } from './Icon'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-16 pb-12 px-6">
            {/* Linha Divisora com Gradiente */}
            <div className="h-px w-full bg-linear-to-r from-transparent via-slate-700 to-transparent mb-8" />

            <div className="flex flex-col items-center space-y-6">
                {/* Links Rápidos ou Âncoras */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-medium text-slate-500">
                    <a
                        href="#top"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        Voltar ao Topo
                    </a>
                    <a
                        href="mailto:contato@exemplo.com"
                        className="hover:text-cyan-400 transition-colors"
                    >
                        Suporte
                    </a>
                    <span className="text-slate-800">|</span>
                    <span className="text-slate-600 italic">
                        Abadim, Cabeceiras de Basto
                    </span>
                </div>

                <div className="flex flex-col items-center space-y-2 text-center">
                    <div className="flex items-center space-x-2 text-slate-400">
                        <Icon
                            name="water"
                            className="w-4 h-4 text-cyan-500/60"
                        />
                        <span className="font-semibold tracking-wide uppercase text-[10px] sm:text-xs">
                            Sistema de Gestão de Águas de Víbora
                        </span>
                    </div>

                    <p className="text-sm text-slate-500">
                        &copy; {currentYear}{' '}
                        <span className="text-slate-300">Guilherme Basto</span>
                        <span className="mx-2 text-slate-700">•</span>
                        Levada da Víbora de Abadim
                    </p>
                </div>
            </div>
        </footer>
    )
}
