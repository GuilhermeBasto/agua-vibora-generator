import type { Route } from "./+types/home";
import { WaterManagement } from "../components/WaterManagement";
import { generateScheduleData } from "~/lib/schedule.server";

/**
 * Loader for the home route
 * Generates schedule data server-side using the .server.ts utility
 * This data is safe to pass to the client component via useLoaderData
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const year = parseInt(
    url.searchParams.get("year") || String(new Date().getFullYear()),
    10
  );

  // Validate year
  if (isNaN(year) || year < 2020 || year > 2050) {
    throw new Response("Invalid year", { status: 400 });
  }

  // Generate schedule data on the server
  // This data structure is safe to pass to the client
  const scheduleData = generateScheduleData(year, false);

  return {
    year,
    scheduleCount: scheduleData.length,
    firstScheduleDate: scheduleData[0]?.dateFormatted,
    lastScheduleDate: scheduleData[scheduleData.length - 1]?.dateFormatted,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestão de Água de Víbora" },
    {
      name: "description",
      content: "Sistema de Gestão de Rega - Aviança dos Calendários",
    },
  ];
}

export default function Home() {
  return <WaterManagement />;
}
