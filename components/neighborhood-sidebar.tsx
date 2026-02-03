"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LAYERS, type Neighborhood, calculateVitalScore, useAppState } from "@/lib/store";
import { X, Wind, Thermometer, Trees, Bus, GraduationCap, Volume2, Construction, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface NeighborhoodSidebarProps {
  neighborhood: Neighborhood;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  wind: Wind,
  thermometer: Thermometer,
  trees: Trees,
  bus: Bus,
  "graduation-cap": GraduationCap,
  "volume-2": Volume2,
  construction: Construction,
};

export function NeighborhoodSidebar({ neighborhood, onClose }: NeighborhoodSidebarProps) {
  const { state } = useAppState();
  const adjustedScore = calculateVitalScore(neighborhood, state.filterWeights);

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrend = (value: number) => {
    if (value >= 70) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value >= 50) return <Minus className="w-4 h-4 text-yellow-600" />;
    return <TrendingDown className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
            {neighborhood.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">Район на София</span>
            {neighborhood.population && (
              <>
                <span className="text-muted-foreground/50">|</span>
                <span className="text-sm text-muted-foreground">
                  {neighborhood.population.toLocaleString("bg-BG")} жители
                </span>
              </>
            )}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Vital Score */}
      <div className="p-4 border-b border-border">
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 text-center">
          <div className="text-sm text-muted-foreground mb-2">Vital Score</div>
          <div className={`text-5xl font-bold ${getScoreColor(adjustedScore)}`} style={{ fontFamily: 'var(--font-heading)' }}>
            {adjustedScore}
          </div>
          <div className="text-sm text-muted-foreground mt-2">от 100</div>
          <div className="mt-4">
            <Progress value={adjustedScore} className="h-2" />
          </div>
          {adjustedScore !== neighborhood.vitalScore && (
            <p className="text-xs text-muted-foreground mt-3">
              Базова оценка: {neighborhood.vitalScore} (персонализирана: {adjustedScore})
            </p>
          )}
        </div>
      </div>

      {/* Indicators */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-foreground mb-4">Индикатори</h3>
        <div className="space-y-3">
          {LAYERS.map((layer) => {
            const value = neighborhood.indicators[layer.id];
            const Icon = iconMap[layer.icon];
            
            return (
              <div
                key={layer.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${layer.color}15`, color: layer.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground truncate">
                      {layer.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                        {value}
                      </span>
                      {getTrend(value)}
                    </div>
                  </div>
                  <div className="mt-1.5">
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getScoreBg(value)}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Summary */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Обобщение</h3>
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard
            label="Най-силна страна"
            value={getBestIndicator(neighborhood)}
            variant="positive"
          />
          <SummaryCard
            label="За подобрение"
            value={getWorstIndicator(neighborhood)}
            variant="negative"
          />
        </div>
      </div>

      {/* Fake Sparkline Chart */}
      <div className="p-4 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Тенденция (последни 12 мес.)</h3>
        <div className="h-16 flex items-end gap-1">
          {generateFakeSparkline(neighborhood.vitalScore).map((value, i) => (
            <div
              key={i}
              className="flex-1 rounded-t transition-all hover:opacity-80"
              style={{
                height: `${value}%`,
                backgroundColor: value >= 60 ? "#22c55e" : value >= 40 ? "#eab308" : "#ef4444",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Яну</span>
          <span>Юни</span>
          <span>Дек</span>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "positive" | "negative";
}) {
  return (
    <div
      className={`p-3 rounded-lg ${
        variant === "positive" ? "bg-green-500/10" : "bg-red-500/10"
      }`}
    >
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={`text-sm font-medium mt-1 ${
          variant === "positive" ? "text-green-700" : "text-red-700"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function getBestIndicator(neighborhood: Neighborhood): string {
  const entries = Object.entries(neighborhood.indicators);
  const best = entries.reduce((a, b) => (a[1] > b[1] ? a : b));
  const layer = LAYERS.find((l) => l.id === best[0]);
  return layer?.name || best[0];
}

function getWorstIndicator(neighborhood: Neighborhood): string {
  const entries = Object.entries(neighborhood.indicators);
  const worst = entries.reduce((a, b) => (a[1] < b[1] ? a : b));
  const layer = LAYERS.find((l) => l.id === worst[0]);
  return layer?.name || worst[0];
}

function generateFakeSparkline(baseScore: number): number[] {
  const data: number[] = [];
  let current = baseScore - 10 + Math.random() * 5;
  
  for (let i = 0; i < 12; i++) {
    current += (Math.random() - 0.4) * 8;
    current = Math.max(20, Math.min(100, current));
    data.push(current);
  }
  
  return data;
}
