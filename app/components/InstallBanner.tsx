import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { buttonVariants } from "./ui/button";
import { cn } from "~/lib/utils";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const STORAGE_KEY = "av-install-banner-dismissed";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<"prompt" | "ios" | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const wasDismissed = window.localStorage.getItem(STORAGE_KEY) === "true";
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone;

    if (wasDismissed || isStandalone) {
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);

    if (isiOS) {
      setMode("ios");
      setIsVisible(true);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      if (isiOS) return;
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setMode("prompt");
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      window.localStorage.setItem(STORAGE_KEY, "true");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    try {
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        window.localStorage.setItem(STORAGE_KEY, "true");
      }
    } catch (error) {
      console.error("Install prompt error", error);
    } finally {
      setIsVisible(false);
      setDeferredPrompt(null);
      setMode(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    window.localStorage.setItem(STORAGE_KEY, "true");
    setDeferredPrompt(null);
    setMode(null);
  };

  if (!isVisible || !mode) {
    return null;
  }

  const subtitle =
    mode === "ios"
      ? "No iOS, usa Partilhar > Adicionar ao Ecra Principal para guardar esta aplicacao."
      : "Guarda este site no ecra inicial para acesso rapido e offline.";

  return (
    <div className="fixed inset-x-4 bottom-6 z-50 sm:inset-x-auto sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="flex flex-col gap-4 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-4 shadow-xl shadow-cyan-500/20 backdrop-blur-2xl sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-400">
            <Icon name="download" className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              Instalar aplicacao
            </p>
            <p className="text-xs leading-relaxed text-slate-400">{subtitle}</p>
          </div>
        </div>

        {mode === "prompt" ? (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleInstallClick}
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30 hover:bg-cyan-400"
              )}
            >
              Instalar agora
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-slate-400 hover:text-slate-200"
              )}
            >
              Agora nao
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-slate-400 hover:text-slate-200"
              )}
            >
              Entendi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
