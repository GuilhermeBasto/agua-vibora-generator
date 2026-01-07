import { cn } from "~/lib/utils";
import { Icon } from "./Icon";

interface InfoBlockProps {
  text: string;
  type: "info" | "warning";
}

export default function InfoBlock({ text, type = "info" }: InfoBlockProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl border",
        type === "warning" && "bg-amber-500/5 border-amber-500/10",
        type === "info" && "bg-cyan-500/5 border-cyan-500/10"
      )}
    >
      <Icon
        name="info"
        className={cn(
          "w-5 h-5 shrink-0 mt-0.5",
          type === "warning" && "text-amber-500",
          type === "info" && "text-cyan-500"
        )}
      />
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
