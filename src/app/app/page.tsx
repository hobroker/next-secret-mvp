import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ItemForm from "./ItemForm";

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold">
          Secret MVP
        </Link>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span>{session.user.email}</span>
          <form action="/api/auth/signout" method="post">
            <button className="rounded-md border border-slate-700 px-3 py-1 hover:border-red-500/70 hover:text-red-300">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-4xl grid gap-6">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/40">
            <h1 className="text-2xl font-semibold tracking-tight">Revenue Opportunities</h1>
            <p className="mt-1 text-sm text-slate-300">
              Capture and score monetizable ideas. Think "clients, offers, pain points".
            </p>
            <div className="mt-5">
              <ItemForm />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-semibold">Your entries</h2>
            {items.length === 0 ? (
              <p className="mt-2 text-sm text-slate-400">
                No entries yet. Add one above.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                    <p className="text-sm font-medium text-slate-100">{item.title}</p>
                    {item.data && typeof item.data === "object" && "details" in item.data ? (
                      <p className="mt-1 text-xs text-slate-400">
                        {(item.data as { details?: string }).details}
                      </p>
                    ) : null}
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
