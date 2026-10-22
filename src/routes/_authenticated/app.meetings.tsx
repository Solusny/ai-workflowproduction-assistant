import { createFileRoute } from "@tanstack/react-router";
import { FeatureView } from "@/wf/pages/app/FeatureView";

export const Route = createFileRoute("/_authenticated/app/meetings")({
  component: () => <FeatureView id="meetings" />,
});
