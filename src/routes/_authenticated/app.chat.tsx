import { createFileRoute } from "@tanstack/react-router";
import { FeatureView } from "@/wf/pages/app/FeatureView";

export const Route = createFileRoute("/_authenticated/app/chat")({
  component: () => <FeatureView id="chat" />,
});
