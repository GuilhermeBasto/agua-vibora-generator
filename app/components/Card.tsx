import { Link } from "react-router";
import { Icon } from "./Icon";

interface CardProps {
  color: "purple" | "amber" | "cyan";
  linkTo: string;
  title: string;
  description: string;
  actionLabel: string;
}

export default function Card({
  color,
  linkTo,
  title,
  description,
  actionLabel,
}: CardProps) {
  return (
    <>
      <Link
        to={linkTo}
        className={`group relative p-8 bg-slate-950/40 hover:bg-${color}-500/[0.03] border border-slate-800 hover:border-${color}-500/50 rounded-3xl transition-all duration-500`}
      >
        <div
          className={`mb-6 inline-flex p-4 bg-${color}-500/10 rounded-2xl text-${color}-400 group-hover:scale-110 transition-transform duration-500`}
        >
          <Icon name="calendar" className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
        <div
          className={`flex items-center text-${color}-400 text-xs font-black uppercase`}
        >
          {actionLabel} <Icon name="arrow-right" className="w-4 h-4 ml-2" />
        </div>
      </Link>
    </>
  );
}
