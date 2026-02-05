import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-lg font-semibold text-red-800 dark:text-red-200">Blacklist Revenue Lab</div>
        <div className="flex gap-3">
          <Button asChild variant="ghost" className="text-red-700/70 dark:text-red-200/70 hover:text-red-900 dark:hover:text-red-100">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild className="bg-red-600 hover:bg-red-500">
            <Link href="/auth/register">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 pb-20">
        <section className="grid gap-6 md:grid-cols-[1.2fr,0.8fr] items-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-red-950 dark:text-red-50">
              Turn raw ideas into revenue pipelines.
            </h1>
            <p className="text-lg text-red-700/70 dark:text-red-200/70">
              Blacklist Revenue Lab gives you a ruthless system to capture, score, and ship money‑making opportunities.
              No clutter. Just clarity, action, and exportable results.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-red-600 hover:bg-red-500">
                <Link href="/auth/register">Start free</Link>
              </Button>
              <Button asChild variant="outline" className="border-red-800 text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100">
                <Link href="/app">See the dashboard</Link>
              </Button>
            </div>
          </div>
          <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-100">What you get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-red-700/70 dark:text-red-200/70">
              <div>✅ Opportunity tracking with scores, value, and next action</div>
              <div>✅ Templates that cut setup time to 60 seconds</div>
              <div>✅ Search, filters, and saved views for instant focus</div>
              <div>✅ Exports (CSV/PDF) and pipeline analytics</div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Capture",
              body: "Get every idea into a structured pipeline before it leaks revenue.",
            },
            {
              title: "Prioritize",
              body: "Score value and probability so you always know what to do next.",
            },
            {
              title: "Execute",
              body: "Ship fast with templates, saved views, and daily focus.",
            },
          ].map((feature) => (
            <Card key={feature.title} className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
              <CardHeader>
                <CardTitle className="text-red-900 dark:text-red-100">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-red-700/70 dark:text-red-200/70">{feature.body}</CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr,1fr]">
          <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-100">Who it&apos;s for</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-red-700/70 dark:text-red-200/70">
              <p>• Founders who need a revenue command center.</p>
              <p>• Sales operators tracking pipeline without CRM bloat.</p>
              <p>• Agencies managing upsells and new offers.</p>
            </CardContent>
          </Card>
          <Card className="bg-card text-card-foreground dark:bg-black/70 border-red-900/40">
            <CardHeader>
              <CardTitle className="text-red-900 dark:text-red-100">Why teams stick</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-red-700/70 dark:text-red-200/70">
              <p>• 60‑second onboarding.</p>
              <p>• Tactical analytics that show progress.</p>
              <p>• Exportable insights for investors and partners.</p>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-red-900/40 bg-card text-card-foreground dark:bg-black/70 p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-950 dark:text-red-50">Ready to build your revenue pipeline?</h2>
          <p className="mt-2 text-sm text-red-700/70 dark:text-red-200/70">
            Stop guessing. Start executing. It takes less than a minute to get set up.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="bg-red-600 hover:bg-red-500">
              <Link href="/auth/register">Join now</Link>
            </Button>
            <Button asChild variant="outline" className="border-red-800 text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100">
              <Link href="/auth/login">I already have access</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
