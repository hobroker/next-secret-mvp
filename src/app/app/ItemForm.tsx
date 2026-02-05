"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "./DatePicker";

export default function ItemForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [value, setValue] = useState("");
  const [probability, setProbability] = useState("50");
  const [status, setStatus] = useState("idea");
  const [nextAction, setNextAction] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent, overrideStatus?: string) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        details,
        value: value ? Number(value) : null,
        probability: probability ? Number(probability) : null,
        status: overrideStatus ?? status,
        nextAction: nextAction ? nextAction.toISOString() : null,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    setTitle("");
    setDetails("");
    setValue("");
    setProbability("50");
    setStatus("idea");
    setNextAction(undefined);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="item-title" className="text-xs font-medium text-muted-foreground">
            Title
          </label>
          <Input
            id="item-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to track?"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="item-value" className="text-xs font-medium text-muted-foreground">
            Value ($)
          </label>
          <Input
            id="item-value"
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="5000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="item-details" className="text-xs font-medium text-muted-foreground">
          Details
        </label>
        <Textarea
          id="item-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Notes, pain points, targets, etc."
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="item-prob" className="text-xs font-medium text-muted-foreground">
            Probability (%)
          </label>
          <Input
            id="item-prob"
            type="number"
            min={0}
            max={100}
            value={probability}
            onChange={(e) => setProbability(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {"draft,idea,qualified,proposal,won,lost".split(",").map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Next action date
          </label>
          <DatePicker value={nextAction} onChange={setNextAction} />
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-500">
          {loading ? "Saving..." : "Add"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          className="border-red-800 text-red-200 hover:text-red-100"
          onClick={(e) => handleSubmit(e, "draft")}
        >
          Save draft
        </Button>
      </div>
    </form>
  );
}
