import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/wf/pages/LandingPage";

export const Route = createFileRoute("/")({
  // The 3D hub uses WebGL and scroll animations that only exist in the browser.
  ssr: false,
  head: () => ({
    meta: [
      { title: "WorkFlow AI — Your AI Workplace Assistant" },
      { name: "description", content: "Draft emails, summarise meetings, plan tasks, research and chat — one AI co-pilot for your whole workday." },
      { property: "og:title", content: "WorkFlow AI — Your AI Workplace Assistant" },
      { property: "og:description", content: "Draft emails, summarise meetings, plan tasks, research and chat — one AI co-pilot for your whole workday." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
