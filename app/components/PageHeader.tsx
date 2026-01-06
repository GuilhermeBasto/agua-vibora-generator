import { Icon } from "./Icon";
import { Link } from "react-router";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  backLink?: string;
  backLabel?: string;
  onClick?: () => void;
}

export function PageHeader({
  title,
  subtitle,
  icon,
  backLink,
  backLabel,
  onClick,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800">
      {/* Background Decorativo Suave */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 pointer-events-none"></div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-12">
        {/* Navegação Superior */}
        <div className="flex items-center justify-between mb-8">
          {backLink && (
            <Link
              to={backLink}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all duration-200 text-slate-300 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest group shadow-sm"
            >
              <Icon
                name="arrow-right"
                className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform"
              />
              <span>{backLabel || "voltar"}</span>
            </Link>
          )}

          {onClick && (
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 hover:bg-cyan-500/20 border border-slate-700 hover:border-cyan-500/50 rounded-xl transition-all duration-200 text-slate-300 hover:text-cyan-400 text-xs font-bold uppercase tracking-widest group shadow-sm"
              onClick={onClick}
            >
              <Icon
                name="arrow-right"
                className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform"
              />
              <span>{backLabel || "voltar"}</span>
            </button>
          )}

          {/* Badge de Status/Ano (Opcional) */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Sistema Ativo
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          {icon && (
            <div className="relative mb-6">
              {/* Brilho por trás do ícone */}
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full"></div>
              <div className="relative inline-flex items-center justify-center w-14 h-14 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <Icon name={icon} className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {title}
          </h1>

          {subtitle && (
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md italic">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
