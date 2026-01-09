import { Icon } from './Icon'

export function InfoCard() {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <Icon name="info" className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">
                        Informações do Sistema
                    </h3>
                    <div className="space-y-2 text-sm text-slate-400">
                        <p className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong className="text-slate-300">
                                    Época de rega:
                                </strong>{' '}
                                25 de Junho a 29 de Setembro de cada ano.
                            </span>
                        </p>
                        <p className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong className="text-slate-300">
                                    Rotação:
                                </strong>{' '}
                                Os casaís seguem um padrão de rotação que muda
                                anualmente. nos anos pares começa pelos casais
                                da aldeia da Torre e nos anos ímpares pelos
                                casaís da aldeia de Santo António.
                            </span>
                        </p>
                        <p className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span>
                                <strong className="text-slate-300">
                                    11 casaís:
                                </strong>{' '}
                                Sistema cobre Torre, Crasto, Passo, Ramada,
                                Figueiredo, Redondinho, Casa Nova, Eirô, Cimo de
                                Aldeia, Portela e Casa de Baixo.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
