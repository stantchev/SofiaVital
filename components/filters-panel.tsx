"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { useAppState } from "@/lib/store";
import { SlidersHorizontal, Baby, Briefcase, Heart } from "lucide-react";

export function FiltersPanel() {
  const { state, setState } = useAppState();

  const updateWeight = (key: keyof typeof state.filterWeights, value: number) => {
    setState((prev) => ({
      ...prev,
      filterWeights: {
        ...prev.filterWeights,
        [key]: value,
      },
    }));
  };

  const setProfile = (profile: typeof state.userProfile) => {
    setState((prev) => {
      let weights = { ...prev.filterWeights };
      
      switch (profile) {
        case "family":
          weights = { airPollution: 80, greenSpaces: 70, publicTransport: 60, quietness: 70 };
          break;
        case "young":
          weights = { airPollution: 40, greenSpaces: 50, publicTransport: 90, quietness: 30 };
          break;
        case "senior":
          weights = { airPollution: 70, greenSpaces: 80, publicTransport: 70, quietness: 90 };
          break;
        default:
          weights = { airPollution: 50, greenSpaces: 50, publicTransport: 50, quietness: 50 };
      }
      
      return {
        ...prev,
        userProfile: profile,
        filterWeights: weights,
      };
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="shadow-md gap-2 bg-transparent">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Персонализирай</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Персонализирай оценката</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Задай важност на различните фактори
          </p>
        </div>

        {/* User Profile Selection */}
        <div className="p-3 border-b border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">Бърз избор по профил</div>
          <div className="grid grid-cols-3 gap-2">
            <ProfileButton
              icon={<Baby className="w-4 h-4" />}
              label="Семейство"
              active={state.userProfile === "family"}
              onClick={() => setProfile("family")}
            />
            <ProfileButton
              icon={<Briefcase className="w-4 h-4" />}
              label="Млад професионалист"
              active={state.userProfile === "young"}
              onClick={() => setProfile("young")}
            />
            <ProfileButton
              icon={<Heart className="w-4 h-4" />}
              label="Пенсионер"
              active={state.userProfile === "senior"}
              onClick={() => setProfile("senior")}
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="p-3 space-y-4">
          <SliderControl
            label="Чист въздух"
            value={state.filterWeights.airPollution}
            onChange={(v) => updateWeight("airPollution", v)}
          />
          <SliderControl
            label="Зелени площи"
            value={state.filterWeights.greenSpaces}
            onChange={(v) => updateWeight("greenSpaces", v)}
          />
          <SliderControl
            label="Обществен транспорт"
            value={state.filterWeights.publicTransport}
            onChange={(v) => updateWeight("publicTransport", v)}
          />
          <SliderControl
            label="Тишина"
            value={state.filterWeights.quietness}
            onChange={(v) => updateWeight("quietness", v)}
          />
        </div>

        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => setProfile(null)}
          >
            Нулирай настройките
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ProfileButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
        active
          ? "bg-primary/10 border border-primary/30 text-primary"
          : "hover:bg-muted border border-transparent text-muted-foreground"
      }`}
    >
      {icon}
      <span className="text-[10px] text-center leading-tight">{label}</span>
    </button>
  );
}

function SliderControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{value}%</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        max={100}
        step={5}
        className="w-full"
      />
    </div>
  );
}
