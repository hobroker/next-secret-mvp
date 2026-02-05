"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Welcome to Blacklist Revenue Lab",
    body: "This is your 60‑second setup. Track money‑making ideas, score them, and stay ruthless.",
  },
  {
    title: "What you can do",
    body: "Capture opportunities, use templates, and keep your pipeline visible.",
  },
  {
    title: "First action",
    body: "Create your first opportunity or clone a template in seconds.",
  },
];

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;

  async function finish() {
    await fetch("/api/auth/onboard", { method: "POST" });
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">{steps[step].title}</CardTitle>
          <p className="text-sm text-red-200/70">{steps[step].body}</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="text-xs text-red-200/70">Step {step + 1} of {steps.length}</div>
          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="outline" className="border-red-800 text-red-200" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {!isLast ? (
              <Button className="bg-red-600 hover:bg-red-500" onClick={() => setStep(step + 1)}>
                Next
              </Button>
            ) : (
              <Button className="bg-red-600 hover:bg-red-500" onClick={finish}>
                Finish setup
              </Button>
            )}
          </div>
          <div className="flex gap-3 text-xs text-red-200/70">
            <Button variant="ghost" className="text-red-200/70 hover:text-red-100" onClick={() => router.push("/app/opportunities")}>Go to opportunities</Button>
            <Button variant="ghost" className="text-red-200/70 hover:text-red-100" onClick={() => router.push("/app/templates")}>Browse templates</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
