"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { LAYERS, type LayerType, useAppState } from "@/lib/store";
import { Layers, Wind, Thermometer, Trees, Bus, GraduationCap, Volume2, Construction } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  wind: <Wind className="w-4 h-4" />,
  thermometer: <Thermometer className="w-4 h-4" />,
  trees: <Trees className="w-4 h-4" />,
  bus: <Bus className="w-4 h-4" />,
  "graduation-cap": <GraduationCap className="w-4 h-4" />,
  "volume-2": <Volume2 className="w-4 h-4" />,
  construction: <Construction className="w-4 h-4" />,
};

export function LayerSelector() {
  const { state, setState } = useAppState();

  const toggleLayer = (layerId: LayerType) => {
    setState((prev) => ({
      ...prev,
      activeLayers: prev.activeLayers.includes(layerId)
        ? prev.activeLayers.filter((id) => id !== layerId)
        : [...prev.activeLayers, layerId],
    }));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className="shadow-lg gap-2">
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Слоеве</span>
          {state.activeLayers.length > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {state.activeLayers.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Избери слоеве</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Избери кои данни да се показват на картата
          </p>
        </div>
        <div className="p-2 space-y-1 max-h-[350px] overflow-y-auto">
          {LAYERS.map((layer) => {
            const isActive = state.activeLayers.includes(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${
                  isActive
                    ? "bg-primary/10 border border-primary/30"
                    : "hover:bg-muted border border-transparent"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: isActive ? layer.color : "transparent",
                    color: isActive ? "white" : layer.color,
                    border: isActive ? "none" : `2px solid ${layer.color}`,
                  }}
                >
                  {iconMap[layer.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {layer.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {layer.description}
                  </div>
                </div>
                <Checkbox checked={isActive} className="pointer-events-none" />
              </button>
            );
          })}
        </div>
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setState((prev) => ({ ...prev, activeLayers: [] }))}
          >
            Изчисти всички
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
