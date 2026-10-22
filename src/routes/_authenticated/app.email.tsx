import { createFileRoute } from "@tanstack/react-router";
import { FeatureView } from "@/wf/pages/app/FeatureView";

export const Route = createFileRoute("/_authenticated/app/email")({
  component: () => <FeatureView id="email" />,
});
