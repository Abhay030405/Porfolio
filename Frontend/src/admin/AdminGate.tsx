import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { ApiError } from "@/lib/api";
import { ADMIN_SESSION_KEY, adminApi } from "./adminApi";

/*
 * Shows its children only to a logged-in admin, and a password box otherwise.
 * This is the UX layer; the backend independently rejects every admin call
 * that lacks a valid session.
 */
const AdminGate = ({ children }: { children: ReactNode }) => {
  const session = useQuery({
    queryKey: ADMIN_SESSION_KEY,
    queryFn: () =>
      adminApi
        .me()
        .then(() => true)
        .catch((err) => {
          if (err instanceof ApiError && err.status === 401) return false;
          throw err;
        }),
    retry: false,
    staleTime: Infinity,
  });

  if (session.isPending) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </Centered>
    );
  }
  if (session.isError) {
    return (
      <Centered>
        <p className="text-sm text-muted-foreground">Can't reach the server. Is the backend running?</p>
      </Centered>
    );
  }
  return session.data ? <>{children}</> : <LoginBox />;
};

const LoginBox = () => {
  const queryClient = useQueryClient();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setBusy(true);
    setError(null);
    try {
      await adminApi.login(password);
      queryClient.setQueryData(ADMIN_SESSION_KEY, true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't log in");
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Centered>
      <form onSubmit={submit} className="w-full max-w-xs space-y-3">
        <div className="mb-5 flex justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06]">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          aria-label="Password"
          className="w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-white/30 transition-colors"
        />
        <button
          type="submit"
          disabled={busy || !password}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-medium text-background disabled:opacity-40 transition-opacity"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Continue
        </button>
        {error && <p className="text-center text-sm text-destructive">{error}</p>}
      </form>
    </Centered>
  );
};

const Centered = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">{children}</div>
);

export default AdminGate;
