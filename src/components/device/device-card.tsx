import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface DeviceCardProps {
  id: string;
  name: string;
  score: number;
  price: string;
  imageUrl?: string;
  highlights?: string[];
}

export function DeviceCard({
  id,
  name,
  score,
  price,
  imageUrl,
  highlights = [],
}: DeviceCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden p-0">
      {/* Visual Header */}
      <div className="relative w-full h-[200px] bg-bg-secondary flex items-center justify-center overflow-hidden p-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-500 rounded-lg"
          />
        ) : (
          <div className="text-xs text-text-secondary uppercase tracking-wider font-semibold opacity-60">
            Image
          </div>
        )}
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-surface/20 to-transparent pointer-events-none" />
      </div>

      {/* Content */}
      <CardContent className="flex-1 p-6 pt-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-semibold tracking-tight text-text-primary group-hover:text-accent transition-colors">
              {name}
            </h3>
            <span className="text-lg font-medium tracking-tight bg-text-primary text-surface px-2 py-0.5 rounded shadow-sm leading-none flex items-center selection:bg-transparent">
              {score}
            </span>
          </div>

          <p className="text-xl font-medium mb-6">{price}</p>

          <div className="space-y-2 mb-6 text-sm text-text-secondary">
            {highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start">
                <Check className="w-4 h-4 mr-2 mt-0.5 text-accent opacity-80" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 mt-auto border-t border-border-subtle/50 flex gap-3">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/device/${id}`}>View</Link>
        </Button>
        <Button variant="primary" className="flex-1" asChild>
          <Link href={`/compare?add=${id}`}>Compare</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
