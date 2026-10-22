import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ClipboardEvent } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { LogoMark } from "@/wf/components/ui/Logo";
import { Modal } from "@/wf/components/ui/Modal";
import { PrivacyContent, TermsContent } from "@/wf/components/ui/LegalContent";
import { safeRedirect, useAuth } from "@/wf/auth/AuthProvider";
import { EMAIL_RE, friendlyAuthError, passwordStrength } from "@/wf/auth/errors";

type Search = { redirect?: string | undefined };
const REDIRECT_KEY = "wf-post-login";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s["redirect"] === "string" ? s["redirect"] : undefined,
  }),
  beforeLoad: async ({ search }) => {
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ href: safeRedirect(search.redirect) });
  },
  head: () => ({
    meta: [
      { title: "Sign in — WorkFlow AI" },
      { name: "description", content: "Sign in or create your WorkFlow AI account to continue." },
      { property: "og:title", content: "Sign in — WorkFlow AI" },
      { property: "og:description", content: "Sign in or create your WorkFlow AI account to continue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

type Step = "email" | "code" | "password";

const btnPrimary =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white shadow-warm transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50";
const input =
  "w-full rounded-xl border border-line bg-surface px-3.5 py-3 text-[15px] text-ink placeholder:text-muted transition focus:border-accent focus:outline-none disabled:opacity-60";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function LoginPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { session } = useAuth();
  const dest = safeRedirect(search.redirect);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState<null | "google" | "email" | "verify" | "password" | "reset" | "resend">(null);
  const [error, setError] = useState("");
  const [legal, setLegal] = useState<null | "terms" | "privacy">(null);

  const emailOk = EMAIL_RE.test(email.trim());

  // When a session appears (code verified, Google returned, magic link clicked), go to destination.
  useEffect(() => {
    if (!session) return;
    const stored = sessionStorage.getItem(REDIRECT_KEY);
    sessionStorage.removeItem(REDIRECT_KEY);
    navigate({ href: safeRedirect(stored ?? dest), replace: true });
  }, [session, dest, navigate]);

  const go = (s: Step) => {
    setError("");
    setStep(s);
  };

  const google = async () => {
    setError("");
    setBusy("google");
    sessionStorage.setItem(REDIRECT_KEY, dest);
    try {
      const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/login` });
      if (res.error) setError(friendlyAuthError(res.error));
      if (res.redirected) return;
    } catch (e) {
      setError(friendlyAuthError(e));
    }
    setBusy(null);
  };

  const sendCode = async (e?: FormEvent) => {
    e?.preventDefault();
    setTouched(true);
    if (!emailOk) return;
    setError("");
    setBusy(step === "code" ? "resend" : "email");
    sessionStorage.setItem(REDIRECT_KEY, dest);
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/login` },
    });
    setBusy(null);
    if (err) return setError(friendlyAuthError(err));
    toast.success("Code sent — check your inbox");
    setStep("code");
  };

  return (
    <div className="min-h-screen bg-login-glow lg:grid lg:grid-cols-2">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] animate-fade-up rounded-2xl border border-line bg-surface p-6 shadow-warm-lg sm:p-8">
          <div className="flex items-center gap-2.5 font-extrabold tracking-tight text-ink">
            <LogoMark size={30} />
            <span className="text-lg">WorkFlow <span className="text-accent">AI</span></span>
          </div>

          <div key={step} className="animate-slide-in">
            {step === "email" && (
              <>
                <h1 className="mt-6 text-2xl font-extrabold text-ink">Your AI workplace co-pilot</h1>
                <p className="mt-1 text-sm text-muted">Sign in or create an account to continue.</p>
                <button
                  onClick={google}
                  disabled={!!busy}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-bold text-ink transition hover:bg-tint-1 disabled:opacity-50"
                >
                  {busy === "google" ? <Loader2 size={18} className="animate-spin" /> : <GoogleIcon />} Continue with Google
                </button>
                <div className="my-5 flex items-center gap-3 text-xs font-bold text-muted">
                  <span className="h-px flex-1 bg-line" /> OR <span className="h-px flex-1 bg-line" />
                </div>
                <form onSubmit={sendCode} noValidate>
                  <label htmlFor="email" className="text-sm font-bold text-ink">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    maxLength={254}
                    value={email}
                    disabled={!!busy}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="name@company.com"
                    aria-invalid={touched && !emailOk}
                    aria-describedby="email-err"
                    className={`${input} mt-1.5`}
                  />
                  <p id="email-err" className="mt-1.5 min-h-5 text-xs font-semibold text-accent" aria-live="polite">
                    {touched && email && !emailOk ? "Enter a valid email address." : ""}
                  </p>
                  <button type="submit" disabled={!emailOk || !!busy} className={`${btnPrimary} mt-2`}>
                    {busy === "email" && <Loader2 size={16} className="animate-spin" />} Continue with email
                  </button>
                </form>
                <button onClick={() => go("password")} className="mt-3 w-full text-center text-sm font-bold text-accent hover:underline">
                  Use a password instead
                </button>
              </>
            )}

            {step === "code" && (
              <CodeStep
                email={email.trim().toLowerCase()}
                onEdit={() => go("email")}
                onResend={() => sendCode()}
                resending={busy === "resend"}
                setError={setError}
              />
            )}

            {step === "password" && (
              <PasswordStep email={email} setEmail={setEmail} onBack={() => go("email")} setError={setError} />
            )}
          </div>

          <p className="mt-3 min-h-5 text-sm font-semibold text-accent" role="alert" aria-live="assertive">{error}</p>

          <div className="mt-4 space-y-1.5 border-t border-line pt-4 text-xs text-muted">
            <p>
              By continuing, you agree to our{" "}
              <button onClick={() => setLegal("terms")} className="font-bold text-ink underline">Terms of Use</button> and{" "}
              <button onClick={() => setLegal("privacy")} className="font-bold text-ink underline">Privacy Policy</button>.
            </p>
            <p>We only use your email to sign you in.</p>
            <p>AI-generated content may contain errors.</p>
          </div>
        </div>
        <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink">
          <ArrowLeft size={16} /> Back to home
        </Link>
      </div>

      <div className="relative hidden overflow-hidden bg-signature lg:flex lg:items-center lg:justify-center" aria-hidden="true">
        <div className="animate-float">
          <LogoMark size={180} />
        </div>
        <p className="absolute bottom-12 left-12 right-12 text-3xl font-extrabold leading-tight text-ink">
          Emails, meetings, tasks and research — <span className="text-surface">done in minutes.</span>
        </p>
      </div>

      <Modal open={legal === "terms"} onClose={() => setLegal(null)} title="Terms of Use"><TermsContent /></Modal>
      <Modal open={legal === "privacy"} onClose={() => setLegal(null)} title="Privacy Policy"><PrivacyContent /></Modal>
    </div>
  );
}

function CodeStep({ email, onEdit, onResend, resending, setError }: {
  email: string; onEdit: () => void; onResend: () => void; resending: boolean; setError: (s: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [wait, setWait] = useState(30);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const verify = async (code: string) => {
    setVerifying(true);
    setError("");
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setVerifying(false);
    if (error) {
      setError(friendlyAuthError(error));
      setDigits(Array(6).fill(""));
      refs.current[0]?.focus();
    } else toast.success("You\u2019re signed in");
  };

  const set = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(""));
  };
  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };
  const onPaste = (e: ClipboardEvent) => {
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!p) return;
    e.preventDefault();
    const next = Array(6).fill("").map((_, i) => p[i] ?? "");
    setDigits(next);
    refs.current[Math.min(p.length, 5)]?.focus();
    if (p.length === 6) verify(p);
  };

  return (
    <>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">Check your email</h1>
      <p className="mt-1 text-sm text-muted">
        We sent a 6-digit code to <span className="font-bold text-ink">{email}</span>{" "}
        <button onClick={onEdit} className="font-bold text-accent hover:underline">Edit</button>
      </p>
      <p className="mt-1 text-sm text-muted">Enter it below, or click the link in the email.</p>
      <form
        onSubmit={(e) => { e.preventDefault(); if (digits.every(Boolean)) verify(digits.join("")); }}
        className="mt-5"
      >
        <fieldset className="flex justify-between gap-1.5 sm:gap-2" disabled={verifying}>
          <legend className="sr-only">6-digit code</legend>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el; }}
              value={d}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => onKey(i, e)}
              onPaste={onPaste}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className="h-12 w-full min-w-0 rounded-xl border border-line bg-surface text-center text-lg font-extrabold text-ink focus:border-accent focus:outline-none disabled:opacity-60"
            />
          ))}
        </fieldset>
        <button type="submit" disabled={verifying || !digits.every(Boolean)} className={`${btnPrimary} mt-5`}>
          {verifying && <Loader2 size={16} className="animate-spin" />} Verify code
        </button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm">
        <button
          onClick={() => { onResend(); setWait(30); }}
          disabled={wait > 0 || resending}
          className="inline-flex items-center gap-1.5 font-bold text-accent hover:underline disabled:text-muted disabled:no-underline"
        >
          {resending && <Loader2 size={14} className="animate-spin" />}
          {wait > 0 ? `Resend code in ${wait}s` : "Resend code"}
        </button>
        <button onClick={onEdit} className="font-bold text-muted hover:text-ink">Use a different email</button>
      </div>
    </>
  );
}

function PasswordStep({ email, setEmail, onBack, setError }: {
  email: string; setEmail: (s: string) => void; onBack: () => void; setError: (s: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState<null | "submit" | "reset">(null);
  const [sent, setSent] = useState(false);
  const strength = passwordStrength(pw);
  const emailOk = EMAIL_RE.test(email.trim());
  const pwOk = mode === "login" ? pw.length > 0 : pw.length >= 8 && strength.score >= 2;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOk || !pwOk) return;
    setError("");
    setBusy("submit");
    const clean = email.trim().toLowerCase();
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: clean, password: pw });
      setBusy(null);
      if (error) return setError(friendlyAuthError(error));
      toast.success("Welcome back");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: clean,
        password: pw,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });
      setBusy(null);
      if (error) return setError(friendlyAuthError(error));
      if (data.user && data.user.identities?.length === 0) return setError("This email already has an account. Log in instead.");
      if (!data.session) setSent(true);
    }
  };

  const forgot = async () => {
    if (!emailOk) return setError("Enter your email above first, then tap \u201cForgot password?\u201d.");
    setError("");
    setBusy("reset");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(null);
    if (error) return setError(friendlyAuthError(error));
    toast.success("Password reset email sent — check your inbox");
  };

  if (sent)
    return (
      <>
        <h1 className="mt-6 text-2xl font-extrabold text-ink">Confirm your email</h1>
        <p className="mt-1 text-sm text-muted">We sent a confirmation link to <span className="font-bold text-ink">{email}</span>. Click it to finish creating your account.</p>
        <button onClick={onBack} className="mt-5 text-sm font-bold text-accent hover:underline">← Back</button>
      </>
    );

  return (
    <>
      <h1 className="mt-6 text-2xl font-extrabold text-ink">{mode === "login" ? "Log in with password" : "Create your account"}</h1>
      <p className="mt-1 text-sm text-muted">
        {mode === "login" ? "New here?" : "Already have an account?"}{" "}
        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="font-bold text-accent hover:underline">
          {mode === "login" ? "Create account" : "Log in"}
        </button>
      </p>
      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        <fieldset disabled={!!busy} className="space-y-4">
          <div>
            <label htmlFor="pw-email" className="text-sm font-bold text-ink">Email</label>
            <input id="pw-email" type="email" autoComplete="email" autoFocus maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" className={`${input} mt-1.5`} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="pw" className="text-sm font-bold text-ink">Password</label>
              {mode === "login" && (
                <button type="button" onClick={forgot} className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline">
                  {busy === "reset" && <Loader2 size={12} className="animate-spin" />} Forgot password?
                </button>
              )}
            </div>
            <div className="relative mt-1.5">
              <input id="pw" type={show ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} maxLength={128} value={pw} onChange={(e) => setPw(e.target.value)} className={`${input} pr-11`} />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === "signup" && pw && (
              <div className="mt-2" aria-live="polite">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <span key={n} className={`h-1.5 flex-1 rounded-full ${strength.score >= n ? "bg-accent" : "bg-line"}`} />
                  ))}
                </div>
                <p className="mt-1 text-xs text-muted">Strength: <span className="font-bold text-ink">{strength.label}</span> · use 8+ characters with a mix of letters, numbers and symbols</p>
              </div>
            )}
          </div>
        </fieldset>
        <button type="submit" disabled={!emailOk || !pwOk || !!busy} className={btnPrimary}>
          {busy === "submit" && <Loader2 size={16} className="animate-spin" />} {mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <button onClick={onBack} className="mt-3 w-full text-center text-sm font-bold text-muted hover:text-ink">Use an email code instead</button>
    </>
  );
}
