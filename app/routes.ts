import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("my-schedule", "routes/my-schedule.tsx"),
  route("create-custom-schedule", "routes/create-custom-schedule.tsx"),
  route("template", "routes/template.tsx"),
  route("api/create-schedule", "routes/api.create-schedule.ts"),
  route("api/:format", "routes/api.$format.ts"),
] satisfies RouteConfig;
