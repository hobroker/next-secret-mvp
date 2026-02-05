"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "cold-outreach",
    title: "Cold outreach sprint",
    details: "Target list, messaging angle, CTA, and 7‑day follow‑up plan.",
    value: 2500,
    probability: 35,
  },
  {
    id: "upsell",
    title: "Upsell existing clients",
    details: "Identify top accounts, add‑on value, and next action cadence.",
    value: 5000,
    probability: 55,
  },
  {
    id: "partnership",
    title: "Partnership pipeline",
    details: "Shortlist partners, mutual value, and outreach timeline.",
    value: 10000,
    probability: 40,
  },
];

export default function TemplatesClient() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function applyTemplate(templateId: string) {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;

    setLoading(templateId);
    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: template.title,
        details: template.details,
        value: template.value,
        probability: template.probability,
        status: "idea",
        nextAction: null,
      }),
    });
    setLoading(null);
    router.push("/app/opportunities");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl grid gap-6">
      <Card className="bg-black/70 border-red-900/40">
        <CardHeader>
          <CardTitle className="text-red-50">Templates & Playbooks</CardTitle>
          <p className="text-sm text-red-200/70">
            Clone a proven playbook and customize it in seconds.
          </p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="bg-black/70 border-red-900/40">
            <CardHeader>
              <CardTitle className="text-red-100 text-base">{template.title}</CardTitle>
              <p className="text-sm text-red-200/70">{template.details}</p>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-red-200/70">
              <div>
                Value: <span className="text-red-100">${template.value}</span>
              </div>
              <div>
                Probability: <span className="text-red-100">{template.probability}%</span>
              </div>
              <Button
                onClick={() => applyTemplate(template.id)}
                className="bg-red-600 hover:bg-red-500"
                disabled={loading === template.id}
              >
                {loading === template.id ? "Creating..." : "Use template"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
