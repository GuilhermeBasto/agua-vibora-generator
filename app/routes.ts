import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("my-schedule", "routes/my-schedule.tsx"),
  route("create-custom-schedule", "routes/create-custom-schedule.tsx"),
  route(
    "create-custom-schedule/view",
    "routes/create-custom-schedule.view.tsx"
  ),
  route("template", "routes/template.tsx"),
  route("irrigation-pool-schedule", "routes/irrigation-pool-schedule.tsx"),
  route("api/create-schedule", "routes/api.create-schedule.ts"),
  route("api/:format", "routes/api.$format.ts"),
  route("api/custom/:format", "routes/api.custom.$format.ts"),
] satisfies RouteConfig;
