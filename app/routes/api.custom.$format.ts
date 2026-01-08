import type { Route } from "./+types/api.custom.$format";
import type { GeneratedSchedule } from "~/lib/types";
import {
  generatePDF,
  generateWorkbookFromData,
  getContentDispositionHeader,
  getResponseHeaders,
} from "~/lib/utils.server";

export async function action({ params, request }: Route.ActionArgs) {
  const format = params.format?.toLowerCase();

  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.formData();
    const raw = formData.get("data");

    if (!raw || typeof raw !== "string") {
      return new Response("Dados em falta", { status: 400 });
    }

    const payload = JSON.parse(raw) as GeneratedSchedule;
    if (!payload || !payload.data || !payload.year) {
      return new Response("Payload inválido", { status: 400 });
    }

    const yearNum = parseInt(payload.year, 10);
    const safeName =
      payload.name?.replace(/[/\\?%*:|"<>]/g, "-") || "agenda-personalizada";
    const fileBase = `${safeName}-${yearNum}`;

    switch (format) {
      case "pdf": {
        const doc = generatePDF(
          `${payload.name} - Ano ${yearNum}`,
          payload.data
        );

        const chunks: any[] = [];
        const buffer = await new Promise<Buffer>((resolve, reject) => {
          doc.on("data", (chunk) => chunks.push(chunk));
          doc.on("error", (err) => reject(err));
          doc.on("end", () => resolve(Buffer.concat(chunks)));
          doc.end();
        });

        return new Response(new Uint8Array(buffer), {
          headers: getResponseHeaders(fileBase, "pdf", buffer.length),
        });
      }

      case "xlsx": {
        const workbook = generateWorkbookFromData(
          payload.name || "Agenda",
          yearNum,
          payload.data
        );

        const xlsxBuffer = await workbook.xlsx.writeBuffer();

        const uint8 = new Uint8Array(xlsxBuffer);

        return new Response(uint8, {
          headers: getResponseHeaders(fileBase, "xlsx", uint8.length),
        });
      }

      default:
        return new Response("Formato não suportado", { status: 400 });
    }
  } catch (err) {
    console.error("Erro na geração do ficheiro:", err);
    return new Response("Erro interno ao gerar o ficheiro", { status: 500 });
  }
}
