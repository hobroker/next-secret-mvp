"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: searchParams.get("callbackUrl") ?? "/app",
    });

    setLoading(false);

    if (!res || res.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(res.url ?? "/app");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground">
          Email
        </label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="login-password" className="text-xs font-medium text-muted-foreground">
          Password
        </label>
        <Input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-500"
      >
        {loading ? "Logging in..." : "Log in"}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">Log in</CardTitle>
          <p className="text-sm text-red-200/70">Access your account to use the lab.</p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={null}>
            <LoginFormInner />
          </Suspense>
          <p className="mt-4 text-xs text-red-200/70">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-red-200 hover:text-red-100">
              Create one
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
