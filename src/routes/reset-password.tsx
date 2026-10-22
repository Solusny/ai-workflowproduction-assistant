import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LogoMark } from "@/wf/components/ui/Logo";
import { friendlyAuthError, passwordStrength } from "@/wf/auth/errors";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset password — WorkFlow AI" },
      { name: "description", content: "Choose a new password for your WorkFlow AI account." },
      { property: "og:title", content: "Reset password — WorkFlow AI" },
      { property: "og:description", content: "Choose a new password for your WorkFlow AI account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const s = passwordStrength(pw);
  const ok = pw.length >= 8 && s.score >= 2;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    setBusy(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (err) return setError(friendlyAuthError(err));
    toast.success("Password updated");
    navigate({ to: "/app", replace: true });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-login-glow px-4">
      <form onSubmit={submit} className="w-full max-w-[420px] animate-fade-up rounded-2xl border border-line bg-surface p-6 shadow-warm-lg sm:p-8">
        <LogoMark size={30} />
        <h1 className="mt-5 text-2xl font-extrabold text-ink">Set a new password</h1>
        <p className="mt-1 text-sm text-muted">Use at least 8 characters with a mix of letters, numbers and symbols.</p>
        <label htmlFor="np" className="mt-5 block text-sm font-bold text-ink">New password</label>
        <input id="np" type="password" autoFocus autoComplete="new-password" maxLength={128} value={pw} onChange={(e) => setPw(e.target.value)} disabled={busy}
          className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-ink focus:border-accent focus:outline-none" />
        {pw && <p className="mt-1.5 text-xs text-muted">Strength: <span className="font-bold text-ink">{s.label}</span></p>}
        <p className="mt-2 min-h-5 text-sm font-semibold text-accent" role="alert">{error}</p>
        <button disabled={!ok || busy} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white disabled:opacity-50">
          {busy && <Loader2 size={16} className="animate-spin" />} Update password
        </button>
      </form>
    </div>
  );
}
