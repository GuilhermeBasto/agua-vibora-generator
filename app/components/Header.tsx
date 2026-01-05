import { Icon } from "./Icon";

export function Header() {
  return (
    <div className="bg-gradient-to-r from-cyan-600 to-emerald-600 p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
        <Icon name="water" className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-white mb-2">
        Gestão de Água de Víbora
      </h1>
      <p className="text-cyan-100 text-lg">Aviança dos Calendários de Rega</p>
    </div>
  );
}
