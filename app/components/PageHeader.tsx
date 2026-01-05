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
    <div className="bg-gradient-to-r from-cyan-600 to-emerald-600 p-8 text-center relative">
      {backLink && (
        <div className="absolute top-4 left-4">
          <Link
            to={backLink}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <span className="group-hover:translate-x-1 transition-transform">
              ←
            </span>
            <span>{backLabel || "Voltar"}</span>
          </Link>
        </div>
      )}
      {onClick && (
        <div className="absolute top-4 left-4">
          <button
            onClick={onClick}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 text-white text-sm font-medium hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <span className="group-hover:translate-x-1 transition-transform">
              ←
            </span>
            <span>{backLabel || "Voltar"}</span>
          </button>
        </div>
      )}
      {icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
          <Icon name={icon} className="w-8 h-8 text-white" />
        </div>
      )}
      <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
      {subtitle && <p className="text-cyan-100 text-lg">{subtitle}</p>}
    </div>
  );
}
