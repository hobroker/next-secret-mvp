"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SavedViewsClient() {
  const router = useRouter();
  const params = useSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveView() {
    if (!name.trim()) return;
    setLoading(true);
    const query = Object.fromEntries(params.entries());
    await fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), query }),
    });
    setLoading(false);
    setName("");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Save view name"
        className="max-w-xs"
      />
      <Button
        type="button"
        onClick={saveView}
        disabled={loading}
        className="bg-red-600 hover:bg-red-500"
      >
        {loading ? "Saving..." : "Save view"}
      </Button>
    </div>
  );
}
