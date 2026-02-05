"use client";

import { Button } from "@/components/ui/button";

export default function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild variant="outline" className="border-red-800 text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100">
        <a href="/api/export/csv">Export CSV</a>
      </Button>
      <Button asChild variant="outline" className="border-red-800 text-red-800 dark:text-red-200 hover:text-red-900 dark:hover:text-red-100">
        <a href="/api/export/pdf">Export PDF</a>
      </Button>
    </div>
  );
}
