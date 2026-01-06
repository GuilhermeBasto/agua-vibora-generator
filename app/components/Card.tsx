import { Link } from "react-router";
import { Icon } from "./Icon";

interface CardProps {
  color: "purple" | "amber" | "cyan" | "emerald";
  linkTo: string;
  title: string;
  description: string;
  actionLabel: string;
}

const colorClasses = {
  purple: {
    hoverBg: "hover:bg-purple-500/[0.03]",
    hoverBorder: "hover:border-purple-500/50",
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-400",
    text: "text-purple-400",
  },
  amber: {
    hoverBg: "hover:bg-amber-500/[0.03]",
    hoverBorder: "hover:border-amber-500/50",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    text: "text-amber-400",
  },
  cyan: {
    hoverBg: "hover:bg-cyan-500/[0.03]",
    hoverBorder: "hover:border-cyan-500/50",
    iconBg: "bg-cyan-500/10",
    iconText: "text-cyan-400",
    text: "text-cyan-400",
  },
  emerald: {
    hoverBg: "hover:bg-emerald-500/[0.03]",
    hoverBorder: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    text: "text-emerald-400",
  },
};

export default function Card({
  color,
  linkTo,
  title,
  description,
  actionLabel,
}: CardProps) {
  const colors = colorClasses[color];

  return (
    <>
      <Link
        to={linkTo}
        className={`group relative p-8 flex flex-col h-full overflow-hidden bg-slate-950/40 ${colors.hoverBg} border border-slate-800 ${colors.hoverBorder} rounded-3xl transition-all duration-500`}
      >
        <div
          className={`mb-6 self-center inline-flex items-center justify-center w-12 h-12 shrink-0 ${colors.iconBg} rounded-2xl ${colors.iconText} transition-transform duration-500`}
        >
          <Icon name="calendar" className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
        <div
          className={`mt-auto flex items-center ${colors.text} text-xs font-black uppercase`}
        >
          {actionLabel} <Icon name="arrow-right" className="w-4 h-4 ml-2" />
        </div>
      </Link>
    </>
  );
}
