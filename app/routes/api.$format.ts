import type { Route } from "./+types/api.$format";
import {
  generateSchedulePDF,
  generateScheduleWorkbook,
  generateScheduleCalendar,
} from "~/lib/schedule.server";

const getFileName = (year: number, isTemplate: boolean, format: string) => {
  return isTemplate
    ? `agua-vibora-${year}-template.${format}`
    : `agua-vibora-${year}.${format}`;
};

export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const year = parseInt(
    url.searchParams.get("year") || String(new Date().getFullYear()),
    10
  );
  const isTemplate = url.searchParams.get("template") === "true";
  const format = params.format?.toLowerCase();

  // Validação básica
  if (isNaN(year)) {
    return new Response("Ano inválido", { status: 400 });
  }

  try {
    switch (format) {
      case "pdf": {
        const pdfDoc = generateSchedulePDF(year, isTemplate);
        const chunks: Buffer[] = [];

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
          pdfDoc.on("data", (chunk) => chunks.push(chunk));
          pdfDoc.on("error", (err) => reject(err));
          pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
          pdfDoc.end();
        });

        const fileName = getFileName(year, isTemplate, format);

        return new Response(new Uint8Array(pdfBuffer), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      case "xlsx": {
        const workbook = generateScheduleWorkbook(year, isTemplate);
        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = getFileName(year, isTemplate, format);

        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${fileName}"`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      case "ics": {
        const result = generateScheduleCalendar(year);
        if ("error" in result) throw result.error;

        return new Response(result.value, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="agua-vibora-${year}.ics"`,
            "Cache-Control": "public, max-age=86400",
          },
        });
      }

      default:
        return new Response("Formato não suportado", { status: 400 });
    }
  } catch (error) {
    console.error(`Erro ao gerar ${format}:`, error);
    return new Response("Erro interno ao gerar ficheiro", { status: 500 });
  }
}
