import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/app/onboarding");
  }

  const userId = (session.user as { id?: string })?.id;
  const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
  if (user?.onboarded) {
    redirect("/app");
  }

  return <OnboardingClient />;
}
