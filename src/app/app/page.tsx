import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ItemForm from "./ItemForm";
import StatsCards from "./StatsCards";
import Chart from "./Chart";
import ExportButtons from "./ExportButtons";

export default async function AppPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app");
  }

  const userId = (session.user as { id?: string })?.id;
  const items = userId
    ? await prisma.item.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-black text-red-50 flex flex-col">
      <header className="border-b border-red-900/50 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-red-200">
          Blacklist Revenue Lab
        </Link>
        <div className="flex items-center gap-3 text-xs text-red-200/70">
          <span>{session.user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button className="rounded-md border border-red-800 px-3 py-1 hover:border-red-400 hover:text-red-100">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-5xl grid gap-6">
          <StatsCards items={items} />

          <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
            <section className="rounded-2xl border border-red-900/40 bg-black/70 p-6 shadow-xl shadow-black/40">
              <h1 className="text-2xl font-semibold tracking-tight text-red-50">Revenue Opportunities</h1>
              <p className="mt-1 text-sm text-red-200/70">
                Track, score, and prioritize money‑making ideas. Exportable. Sellable. Ruthless.
              </p>
              <div className="mt-5">
                <ItemForm />
              </div>
            </section>

            <Chart items={items} />
          </div>

          <section className="rounded-2xl border border-red-900/40 bg-black/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-red-100">Your entries</h2>
              <ExportButtons />
            </div>
            {items.length === 0 ? (
              <p className="mt-2 text-sm text-red-200/70">
                No entries yet. Add one above.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="rounded-lg border border-red-900/40 bg-black/60 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-red-50">{item.title}</p>
                      <span className="rounded-full border border-red-900/40 px-2 py-0.5 text-[10px] uppercase text-red-200/80">
                        {item.status}
                      </span>
                    </div>
                    {item.data && typeof item.data === "object" && "details" in item.data ? (
                      <p className="mt-1 text-xs text-red-200/70">
                        {(item.data as { details?: string }).details}
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-red-200/70">
                      {item.value ? <span>Value: ${item.value}</span> : null}
                      {item.probability ? <span>Probability: {item.probability}%</span> : null}
                      {item.nextAction ? (
                        <span>Next action: {new Date(item.nextAction).toDateString()}</span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
