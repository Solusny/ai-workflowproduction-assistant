import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/wf/auth/AuthProvider";

export const Route = createFileRoute("/_authenticated/app/account")({
  component: AccountPage,
});

function AccountPage() {
  const { user, profile } = useAuth();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => setName(profile?.display_name ?? ""), [profile?.display_name]);

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const clean = name.trim().replace(/\s+/g, " ").slice(0, 80);
    if (!clean || !user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ display_name: clean }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error("Couldn\u2019t save your name. Please try again.");
    else {
      toast.success("Profile updated");
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Account</h1>
      <form onSubmit={save} className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-warm-sm">
        <div>
          <p className="text-sm font-bold text-ink">Email</p>
          <p className="mt-1 text-sm text-muted">{user?.email}</p>
        </div>
        <div>
          <label htmlFor="dn" className="text-sm font-bold text-ink">Display name</label>
          <input
            id="dn"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink focus:border-accent focus:outline-none"
          />
        </div>
        <button disabled={saving || !name.trim()} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
