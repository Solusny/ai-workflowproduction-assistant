import { createFileRoute } from "@tanstack/react-router";
import OverviewPage from "@/wf/pages/app/OverviewPage";

export const Route = createFileRoute("/_authenticated/app/")({
  component: OverviewPage,
});
