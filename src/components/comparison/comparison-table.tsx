import * as React from "react";
import { cn } from "@/lib/utils";

export interface CompareDevice {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface CompareRow {
  key: string;
  label: string;
  values: Record<string, string | React.ReactNode>; // key is device.id
}

export interface ComparisonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  devices: CompareDevice[];
  rows: CompareRow[];
}

export function ComparisonTable({
  devices,
  rows,
  className,
  ...props
}: ComparisonTableProps) {
  if (devices.length === 0) return null;

  // Ensure responsive grid. 1 label col + N device cols
  const cols = devices.length + 1;

  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-border-subtle bg-surface hide-scrollbar",
        className,
      )}
      {...props}
    >
      {/* Header Row */}
      <div
        className="flex min-w-[600px] border-b border-border-subtle bg-bg-secondary sticky top-0"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(180px, 1fr))` }}
      >
        <div className="w-1/4 p-6 flex items-end">
          <span className="text-xs font-semibold tracking-wider text-text-secondary uppercase">
            Specifications
          </span>
        </div>
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex-1 p-6 flex flex-col items-center justify-end text-center border-l border-border-subtle/50"
          >
            {device.imageUrl && (
              <img
                src={device.imageUrl}
                alt={device.name}
                className="h-16 w-auto mb-3 object-contain"
              />
            )}
            <h4 className="font-semibold text-text-primary tracking-tight">
              {device.name}
            </h4>
          </div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="min-w-[600px] divide-y divide-border-subtle/50">
        {rows.map((row) => (
          <div
            key={row.key}
            className="flex hover:bg-bg-secondary/30 transition-colors"
          >
            <div className="w-1/4 p-6 py-4 flex items-center">
              <span className="text-sm font-medium text-text-secondary">
                {row.label}
              </span>
            </div>
            {devices.map((device) => (
              <div
                key={`${row.key}-${device.id}`}
                className="flex-1 p-6 py-4 flex items-center justify-center text-center border-l border-border-subtle/50"
              >
                <span className="text-sm text-text-primary">
                  {row.values[device.id] || "—"}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
