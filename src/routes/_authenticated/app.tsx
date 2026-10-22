import { createFileRoute } from "@tanstack/react-router";
import AppLayout from "@/wf/components/app/AppLayout";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkFlow AI" },
      { name: "description", content: "Your WorkFlow AI workspace: email, meetings, tasks, research and chat." },
      { property: "og:title", content: "Dashboard — WorkFlow AI" },
      { property: "og:description", content: "Your WorkFlow AI workspace: email, meetings, tasks, research and chat." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppLayout,
});
