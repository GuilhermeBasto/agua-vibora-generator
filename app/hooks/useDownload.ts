import { useState, useCallback, useRef, useEffect } from "react";
import type { GeneratedSchedule } from "~/lib/types";

interface UseDownloadOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
  fileNamePrefix?: string;
}

export function useDownload(
  generatedSchedule: GeneratedSchedule | null,
  options?: UseDownloadOptions,
  apiUrl = "/api/custom"
) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeFormat, setActiveFormat] = useState<"pdf" | "xlsx" | null>(null);

  // AbortController para cancelar o fetch se o componente for desmontado
  const abortControllerRef = useRef<AbortController | null>(null);

  // Limpeza ao desmontar
  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const download = useCallback(
    async (format: "pdf" | "xlsx") => {
      if (!generatedSchedule) return;

      // Cancelar downloads pendentes antes de iniciar um novo
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setActiveFormat(format);
      setIsDownloading(true);

      try {
        const fd = new FormData();
        fd.append("data", JSON.stringify(generatedSchedule));

        const res = await fetch(`${apiUrl}/${format}`, {
          method: "POST",
          body: fd,
          signal: abortControllerRef.current.signal,
        });

        if (!res.ok) throw new Error(`Erro no servidor: ${res.status}`);

        const blob = await res.blob();

        // Criar o download de forma segura
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");

        const fileName = `${options?.fileNamePrefix || generatedSchedule.name || "agenda"}-${generatedSchedule.year}.${format}`;

        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();

        // Cleanup imediato
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        options?.onSuccess?.();
      } catch (error: any) {
        if (error.name === "AbortError") return; // Ignorar cancelamento propositado

        const err =
          error instanceof Error ? error : new Error("Erro desconhecido");
        options?.onError?.(err);
      } finally {
        setIsDownloading(false);
        setActiveFormat(null);
      }
    },
    [generatedSchedule, apiUrl, options]
  );

  return {
    download,
    isDownloading,
    activeFormat,
  };
}
