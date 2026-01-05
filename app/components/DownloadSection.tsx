import { Link } from "react-router";
import { Icon } from "./Icon";

interface DownloadButton {
  label: string;
  href: string;
  icon: string;
  variant: "excel" | "pdf" | "template";
}

interface DownloadSectionProps {
  title: string;
  buttons: DownloadButton[];
}

export function DownloadSection({ title, buttons }: DownloadSectionProps) {
  const getButtonClasses = (variant: string) => {
    const baseClasses =
      "group relative text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 flex items-center justify-center";

    if (variant === "excel") {
      return `${baseClasses} bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 hover:shadow-cyan-500/50 focus:ring-cyan-500`;
    } else if (variant === "pdf") {
      return `${baseClasses} bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 hover:shadow-rose-500/50 focus:ring-rose-500`;
    } else {
      return `${baseClasses} bg-slate-700 hover:bg-slate-600 focus:ring-slate-500`;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        {title}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {buttons.map((button, index) => (
          <Link
            key={index}
            to={button.href}
            reloadDocument
            download
            className={getButtonClasses(button.variant)}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon name={button.icon} className="w-5 h-5" />
              <span>{button.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
