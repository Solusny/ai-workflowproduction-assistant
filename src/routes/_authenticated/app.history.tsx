import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { History, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { featureById } from "@/wf/data/features";
import { BrandLoader } from "@/wf/components/ui/BrandLoader";

const historyQuery = queryOptions({
  queryKey: ["history"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("history")
      .select("id, feature, title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data;
  },
});

export const Route = createFileRoute("/_authenticated/app/history")({
  loader: ({ context }) => context.queryClient.ensureQueryData(historyQuery),
  pendingComponent: () => <BrandLoader label="Loading your history…" />,
  component: HistoryPage,
});

function HistoryPage() {
  const { data } = useSuspenseQuery(historyQuery);
  const qc = useQueryClient();
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("history").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted from history");
      qc.invalidateQueries({ queryKey: ["history"] });
    },
    onError: () => toast.error("Couldn\u2019t delete that item. Please try again."),
  });

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">History</h1>
      <p className="mt-1 text-sm text-muted">Outputs you save from the AI tools. Only you can see them.</p>
      {data.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-tint-2 bg-surface p-10 text-center">
          <History className="mx-auto text-coral" size={28} />
          <p className="mt-3 font-bold text-ink">Nothing saved yet</p>
          <p className="mt-1 text-sm text-muted">Results you save from Email, Meetings, Tasks or Research will appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {data.map((h) => (
            <li key={h.id} className="rounded-2xl border border-line bg-surface p-5 shadow-warm-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    {featureById(h.feature)?.title ?? h.feature} · {new Date(h.created_at).toLocaleString()}
                  </p>
                  <p className="mt-1 truncate font-bold text-ink">{h.title}</p>
                </div>
                <button
                  onClick={() => del.mutate(h.id)}
                  disabled={del.isPending}
                  className="rounded-lg p-2 text-muted hover:bg-tint-1 hover:text-accent disabled:opacity-50"
                  aria-label={`Delete ${h.title}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm text-muted">{h.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
