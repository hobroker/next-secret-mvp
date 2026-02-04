"use client";

export default function ExportButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href="/api/export/csv"
        className="inline-flex items-center justify-center rounded-md border border-red-800 px-3 py-2 text-xs font-medium text-red-200 hover:border-red-400 hover:text-red-100"
      >
        Export CSV
      </a>
      <a
        href="/api/export/pdf"
        className="inline-flex items-center justify-center rounded-md border border-red-800 px-3 py-2 text-xs font-medium text-red-200 hover:border-red-400 hover:text-red-100"
      >
        Export PDF
      </a>
    </div>
  );
}
