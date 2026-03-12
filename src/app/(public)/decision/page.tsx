"use client";

import { useState } from "react";
import {
  ArrowRight,
  Wand2,
  Sparkles,
  Check,
  ChevronLeft,
  Hexagon,
} from "lucide-react";
import Link from "next/link";
import { DecisionCard } from "@/features/device/device-card";

import { fetchRecommendations } from "@/lib/api";

export default function DecisionAIPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("");
  const [budget, setBudget] = useState(700);
  const [results, setResults] = useState<any[]>([]);

  const handleRecommend = async (selectedEcosystem: string) => {
    setLoading(true);
    try {
      const data = await fetchRecommendations(priority, budget, selectedEcosystem);
      setResults(data || []);
      setStep(4);
    } catch {
      setResults([]);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center pt-[20vh] pb-12 px-6 w-full relative overflow-hidden">
      {/* Abstract Background Blur (Calm Layout structure) */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Breadcrumb Back */}
      <div className="absolute top-24 md:top-32 left-8 md:left-12 z-50">
        <Link
          href="/"
          className="text-text-secondary hover:text-text-primary flex items-center text-sm font-semibold tracking-widest uppercase transition bg-surface/50 border border-border-subtle rounded-full px-4 py-2 backdrop-blur-md"
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Exit Engine
        </Link>
      </div>

      {step < 4 && (
        <div className="w-full max-w-2xl bg-surface/50 backdrop-blur-3xl border border-border-subtle p-10 md:p-16 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-10 transition-all">
          {/* Header (Premium typography) */}
          <div className="flex items-center space-x-4 mb-16 text-accent animate-in fade-in duration-700">
            <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20">
              <Hexagon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-widest uppercase text-text-secondary">
                Intelligence Engine
              </h2>
              <h3 className="text-3xl font-semibold tracking-tight text-text-primary">
                Decision Matrix
              </h3>
            </div>
          </div>

          {/* Wizard Form */}
          {step === 1 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-calm">
              <h3 className="text-4xl font-semibold tracking-tight leading-tight">
                What primary capability are you prioritizing?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Photography Focus",
                  "Mobile Gaming",
                  "Utility & Battery",
                  "Everyday Basics",
                ].map((op) => (
                  <button
                    key={op}
                    onClick={() => { setPriority(op); setStep(2); }}
                    className="group border border-border-subtle bg-surface hover:border-accent shadow-sm hover:shadow-md p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-95"
                  >
                    <div className="font-medium text-text-secondary group-hover:text-amber-500 tracking-wide">
                      {op}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-calm">
              <h3 className="text-4xl font-semibold tracking-tight leading-tight">
                Define maximum acceptable hardware cost.
              </h3>
              <div>
                <div className="flex justify-between items-end mb-8 font-semibold text-5xl tracking-tight text-text-primary">
                  ${budget}
                  <span className="text-sm font-bold text-text-secondary ml-2 mb-2 uppercase tracking-widest">
                    USD Cap
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-3 bg-border-subtle rounded-full appearance-none flex cursor-pointer accent-accent hover:accent-amber-500 transition-colors"
                />
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full bg-accent text-accent-foreground font-medium rounded-full px-8 py-5 mt-10 hover:opacity-90 flex items-center justify-center transition shadow-lg text-lg transform active:scale-95"
              >
                Compute Requirement <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-calm">
              <h3 className="text-4xl font-semibold tracking-tight leading-tight">
                Restrict ecosystem compatibility?
              </h3>
              <div className="space-y-4">
                {[
                  "Strictly Apple iOS",
                  "Strictly Google Android",
                  "No Preference / Agnostic",
                ].map((op) => (
                  <button
                    key={op}
                    onClick={() => handleRecommend(op)}
                    className="w-full flex items-center group border border-border-subtle bg-surface hover:border-accent shadow-sm hover:shadow-md p-6 rounded-3xl text-left transition-all duration-300 transform active:scale-[98%]"
                  >
                    <div className="w-6 h-6 rounded-full border border-border-subtle flex items-center justify-center mr-6 group-hover:border-accent transition-colors"></div>
                    <span className="font-medium text-lg text-text-secondary group-hover:text-text-primary transition-colors">
                      {op}
                    </span>
                  </button>
                ))}
              </div>

              {loading && (
                <div className="absolute inset-0 bg-surface/90 backdrop-blur-xl rounded-[3rem] flex flex-col items-center justify-center z-50 animate-in fade-in duration-500">
                  <Sparkles className="w-12 h-12 animate-spin text-accent mb-8" />
                  <span className="text-2xl font-semibold tracking-tight animate-pulse bg-linear-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                    Running neural matrix...
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Progress Dots Component */}
          <div className="flex justify-center space-x-3 mt-16">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${step === i ? "w-8 bg-text-primary" : "w-2 bg-border"}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. RESULTS STEP (DecisionCard reuse logic & high typography layout) */}
      {step === 4 && (
        <div className="w-full pt-20 max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-1000 ease-out flex flex-col items-center">
          <h2 className="text-5xl md:text-7xl text-center font-semibold tracking-tight leading-[1.1] mb-6">
            Your Match.
          </h2>
          <p className="text-center text-xl text-text-secondary font-light mb-16 max-w-2xl">
            Generated matching your ${budget} constraint and high requisite for
            Computational Photography.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center mb-32">
            
            {results.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-text-secondary py-12">
                No matching devices found based on your criteria. Please expand your budget or relax constraints.
              </div>
            )}

            {results.map((device: any, index: number) => {
              const isTop = index === 0;
              const matchPercent = isTop ? 98 : (90 - index * 5); // Fallback cosmetic percentage
              
              if (isTop) {
                return (
                  <div key={device.id} className="col-span-1 lg:col-span-2 w-full max-w-lg shadow-[0_30px_60px_rgba(0,0,0,0.12)] rounded-[2.5rem] p-1 bg-linear-to-tr from-accent to-amber-500/50">
                    <div className="bg-surface rounded-[2.2rem] h-full p-2 relative overflow-hidden flex flex-col">
                      <div className="absolute top-4 right-6 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-lg">
                        {matchPercent}% Match
                      </div>
                      <DecisionCard
                        id={device.id}
                        name={device.name}
                        brand={device.brand}
                        score={device.score}
                        price={device.price}
                        highlights={device.highlights}
                        href={`/device/${device.id}`}
                        className="border-none shadow-none hover:shadow-none hover:translate-y-0 h-full pb-8!"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={device.id} className="col-span-1 w-full max-w-md flex flex-col opacity-80 hover:opacity-100 transition-opacity duration-500">
                  <div className="text-xs uppercase tracking-widest font-semibold text-text-secondary mb-4 ml-4">
                    Runner Up · {matchPercent}% Match
                  </div>
                  <DecisionCard
                    id={device.id}
                    name={device.name}
                    brand={device.brand}
                    score={device.score}
                    price={device.price}
                    highlights={device.highlights}
                    href={`/device/${device.id}`}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(1)}
            className="text-text-secondary hover:text-text-primary text-sm font-semibold tracking-wider uppercase transition underline underline-offset-8"
          >
            Restart Matrix
          </button>
        </div>
      )}
    </main>
  );
}
