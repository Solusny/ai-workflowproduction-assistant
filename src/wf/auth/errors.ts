/** Map raw auth errors to friendly, code-free messages. */
export function friendlyAuthError(err: unknown): string {
  const raw = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : String(err ?? '')
  const status = err && typeof err === 'object' && 'status' in err ? Number((err as { status: unknown }).status) : 0
  const m = raw.toLowerCase()
  if (status === 429 || m.includes('rate limit') || m.includes('too many') || m.includes('security purposes'))
    return 'Too many attempts. Please wait a minute and try again.'
  if (m.includes('expired') || m.includes('otp') || m.includes('token has') || m.includes('invalid token'))
    return 'That code is wrong or has expired. Check your email or request a new code.'
  if (m.includes('invalid login credentials')) return 'That email and password don\u2019t match. Try again or reset your password.'
  if (m.includes('already registered') || m.includes('already been registered') || m.includes('user already exists'))
    return 'This email already has an account. Log in instead.'
  if (m.includes('email not confirmed')) return 'Please confirm your email first \u2014 check your inbox for the link.'
  if (m.includes('password') && (m.includes('weak') || m.includes('at least') || m.includes('pwned') || m.includes('leaked')))
    return 'Please choose a stronger password (at least 8 characters, mixing letters, numbers and symbols).'
  if (m.includes('popup') || m.includes('blocked')) return 'Your browser blocked the sign-in window. Allow pop-ups and try again.'
  if (m.includes('cancel') || m.includes('closed')) return 'Google sign-in was cancelled.'
  if (m.includes('fetch') || m.includes('network') || m.includes('failed to')) return 'We couldn\u2019t reach the server. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function passwordStrength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++
  const score = Math.min(4, s) as 0 | 1 | 2 | 3 | 4
  return { score, label: ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][score]! }
}
