import { generateCustomScheduleData } from "~/lib/schedule.server";
import type { Route } from "./+types/api.create-schedule";
import type { CustomSchedule, GeneratedSchedule } from "~/lib/types";
import { data } from "react-router";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return data({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const rawData = formData.get("data");

    if (!rawData || typeof rawData !== "string") {
      return data({ error: "No valid data provided" }, { status: 400 });
    }

    const body = JSON.parse(rawData) as CustomSchedule;

    if (!body.name || !body.year || !body.schedules) {
      return data(
        { error: "Missing required fields: name, year, or schedules" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(body.year, 10);
    if (isNaN(yearNum)) {
      return data({ error: "Invalid year format" }, { status: 400 });
    }

    const schedule = generateCustomScheduleData(yearNum, body.schedules);
    const responseBody: GeneratedSchedule = {
      data: schedule,
      name: body.name,
      year: body.year,
    };

    return data(responseBody);
  } catch (error) {
    console.error("Error creating schedule:", error);

    if (error instanceof SyntaxError) {
      return data({ error: "Invalid JSON format" }, { status: 400 });
    }

    return data({ error: "Failed to create schedule" }, { status: 500 });
  }
}
