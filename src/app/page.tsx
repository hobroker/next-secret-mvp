import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">Blacklist Revenue Lab</CardTitle>
          <p className="text-sm text-red-200/70">
            Track, score, and export your highest‑value revenue plays.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button asChild className="bg-red-600 hover:bg-red-500">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild variant="outline" className="border-red-800 text-red-200 hover:text-red-100">
            <Link href="/auth/register">Create account</Link>
          </Button>
          <Button asChild variant="ghost" className="text-red-200/70 hover:text-red-100">
            <Link href="/app">Go to app</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
