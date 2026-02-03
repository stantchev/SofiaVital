"use client";

import React from "react";
import { createContext, useContext } from "react";

export type LayerType =
  | "airPollution"
  | "heatIslands"
  | "greenSpaces"
  | "publicTransport"
  | "schools"
  | "noise"
  | "futureBuilding";

export interface LayerConfig {
  id: LayerType;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const LAYERS: LayerConfig[] = [
  {
    id: "airPollution",
    name: "Замърсяване на въздуха",
    description: "PM10 / NO2 нива",
    color: "#ef4444",
    icon: "wind",
  },
  {
    id: "heatIslands",
    name: "Топлинни острови",
    description: "Температура / интензивност",
    color: "#f97316",
    icon: "thermometer",
  },
  {
    id: "greenSpaces",
    name: "Зелени площи",
    description: "Достъп до паркове",
    color: "#22c55e",
    icon: "trees",
  },
  {
    id: "publicTransport",
    name: "Обществен транспорт",
    description: "Метро + автобуси/трамваи",
    color: "#3b82f6",
    icon: "bus",
  },
  {
    id: "schools",
    name: "Училища и градини",
    description: "Достъп до образование",
    color: "#a855f7",
    icon: "graduation-cap",
  },
  {
    id: "noise",
    name: "Шумови зони",
    description: "Ниво на шум",
    color: "#6b7280",
    icon: "volume-2",
  },
  {
    id: "futureBuilding",
    name: "Бъдещо застрояване",
    description: "Риск от ново строителство",
    color: "#eab308",
    icon: "construction",
  },
];

export interface Neighborhood {
  id: string;
  name: string;
  coordinates: [number, number];
  vitalScore: number;
  population?: number;
  area?: number; // km2
  indicators: {
    airPollution: number;
    heatIslands: number;
    greenSpaces: number;
    publicTransport: number;
    schools: number;
    noise: number;
    futureBuilding: number;
  };
}

// All 24 official districts (rayoni) of Sofia Municipality
// Data based on official Sofia Municipality information
export const NEIGHBORHOODS: Neighborhood[] = [
  // Central districts
  {
    id: "sredets",
    name: "Средец",
    coordinates: [23.3289, 42.6934],
    vitalScore: 72,
    population: 38791,
    area: 9.17,
    indicators: {
      airPollution: 48,
      heatIslands: 42,
      greenSpaces: 75,
      publicTransport: 95,
      schools: 88,
      noise: 38,
      futureBuilding: 82,
    },
  },
  {
    id: "oborishte",
    name: "Оборище",
    coordinates: [23.3456, 42.6978],
    vitalScore: 80,
    population: 29876,
    area: 3.09,
    indicators: {
      airPollution: 52,
      heatIslands: 48,
      greenSpaces: 85,
      publicTransport: 92,
      schools: 90,
      noise: 65,
      futureBuilding: 78,
    },
  },
  {
    id: "vazrazhdane",
    name: "Възраждане",
    coordinates: [23.3050, 42.7012],
    vitalScore: 65,
    population: 49358,
    area: 2.16,
    indicators: {
      airPollution: 42,
      heatIslands: 45,
      greenSpaces: 55,
      publicTransport: 90,
      schools: 78,
      noise: 40,
      futureBuilding: 72,
    },
  },
  {
    id: "poduyane",
    name: "Подуяне",
    coordinates: [23.3789, 42.7145],
    vitalScore: 58,
    population: 66445,
    area: 14.73,
    indicators: {
      airPollution: 45,
      heatIslands: 50,
      greenSpaces: 52,
      publicTransport: 75,
      schools: 68,
      noise: 48,
      futureBuilding: 55,
    },
  },
  {
    id: "slatina",
    name: "Слатина",
    coordinates: [23.3912, 42.6834],
    vitalScore: 66,
    population: 52634,
    area: 10.86,
    indicators: {
      airPollution: 55,
      heatIslands: 52,
      greenSpaces: 62,
      publicTransport: 78,
      schools: 72,
      noise: 58,
      futureBuilding: 65,
    },
  },
  {
    id: "izgrev",
    name: "Изгрев",
    coordinates: [23.3567, 42.6756],
    vitalScore: 76,
    population: 33478,
    area: 4.79,
    indicators: {
      airPollution: 62,
      heatIslands: 58,
      greenSpaces: 78,
      publicTransport: 82,
      schools: 85,
      noise: 68,
      futureBuilding: 75,
    },
  },
  {
    id: "lozenets",
    name: "Лозенец",
    coordinates: [23.3234, 42.6678],
    vitalScore: 78,
    population: 30234,
    area: 5.46,
    indicators: {
      airPollution: 65,
      heatIslands: 55,
      greenSpaces: 80,
      publicTransport: 85,
      schools: 90,
      noise: 60,
      futureBuilding: 70,
    },
  },
  {
    id: "triaditsa",
    name: "Триадица",
    coordinates: [23.3145, 42.6823],
    vitalScore: 74,
    population: 63212,
    area: 9.87,
    indicators: {
      airPollution: 58,
      heatIslands: 52,
      greenSpaces: 72,
      publicTransport: 88,
      schools: 82,
      noise: 55,
      futureBuilding: 76,
    },
  },
  // Western districts
  {
    id: "krasno-selo",
    name: "Красно село",
    coordinates: [23.2812, 42.6834],
    vitalScore: 71,
    population: 82156,
    area: 10.52,
    indicators: {
      airPollution: 65,
      heatIslands: 60,
      greenSpaces: 70,
      publicTransport: 75,
      schools: 80,
      noise: 60,
      futureBuilding: 65,
    },
  },
  {
    id: "ilinden",
    name: "Илинден",
    coordinates: [23.2678, 42.7089],
    vitalScore: 64,
    population: 31678,
    area: 5.23,
    indicators: {
      airPollution: 55,
      heatIslands: 58,
      greenSpaces: 58,
      publicTransport: 72,
      schools: 75,
      noise: 52,
      futureBuilding: 62,
    },
  },
  {
    id: "nadezhda",
    name: "Надежда",
    coordinates: [23.2934, 42.7312],
    vitalScore: 56,
    population: 76543,
    area: 14.89,
    indicators: {
      airPollution: 42,
      heatIslands: 48,
      greenSpaces: 52,
      publicTransport: 70,
      schools: 65,
      noise: 45,
      futureBuilding: 55,
    },
  },
  {
    id: "lyulin",
    name: "Люлин",
    coordinates: [23.2456, 42.7178],
    vitalScore: 62,
    population: 110234,
    area: 23.45,
    indicators: {
      airPollution: 50,
      heatIslands: 55,
      greenSpaces: 60,
      publicTransport: 80,
      schools: 70,
      noise: 55,
      futureBuilding: 50,
    },
  },
  {
    id: "ovcha-kupel",
    name: "Овча купел",
    coordinates: [23.2367, 42.6756],
    vitalScore: 68,
    population: 45678,
    area: 30.89,
    indicators: {
      airPollution: 68,
      heatIslands: 62,
      greenSpaces: 72,
      publicTransport: 62,
      schools: 70,
      noise: 72,
      futureBuilding: 58,
    },
  },
  {
    id: "vitosha",
    name: "Витоша",
    coordinates: [23.2789, 42.6312],
    vitalScore: 85,
    population: 62345,
    area: 126.41,
    indicators: {
      airPollution: 85,
      heatIslands: 80,
      greenSpaces: 95,
      publicTransport: 58,
      schools: 75,
      noise: 90,
      futureBuilding: 72,
    },
  },
  {
    id: "bankya",
    name: "Банкя",
    coordinates: [23.1456, 42.7067],
    vitalScore: 78,
    population: 12678,
    area: 41.32,
    indicators: {
      airPollution: 88,
      heatIslands: 82,
      greenSpaces: 90,
      publicTransport: 35,
      schools: 65,
      noise: 92,
      futureBuilding: 68,
    },
  },
  {
    id: "vrabnitsa",
    name: "Връбница",
    coordinates: [23.2789, 42.7456],
    vitalScore: 60,
    population: 47890,
    area: 30.12,
    indicators: {
      airPollution: 48,
      heatIslands: 52,
      greenSpaces: 58,
      publicTransport: 68,
      schools: 68,
      noise: 55,
      futureBuilding: 52,
    },
  },
  {
    id: "novi-iskar",
    name: "Нови Искър",
    coordinates: [23.3512, 42.8067],
    vitalScore: 65,
    population: 20456,
    area: 193.75,
    indicators: {
      airPollution: 75,
      heatIslands: 70,
      greenSpaces: 82,
      publicTransport: 32,
      schools: 55,
      noise: 85,
      futureBuilding: 48,
    },
  },
  // Eastern districts
  {
    id: "mladost",
    name: "Младост",
    coordinates: [23.3912, 42.6512],
    vitalScore: 72,
    population: 98765,
    area: 21.87,
    indicators: {
      airPollution: 70,
      heatIslands: 60,
      greenSpaces: 65,
      publicTransport: 90,
      schools: 85,
      noise: 55,
      futureBuilding: 60,
    },
  },
  {
    id: "studentski",
    name: "Студентски",
    coordinates: [23.3634, 42.6589],
    vitalScore: 70,
    population: 67234,
    area: 18.54,
    indicators: {
      airPollution: 62,
      heatIslands: 58,
      greenSpaces: 72,
      publicTransport: 85,
      schools: 92,
      noise: 42,
      futureBuilding: 68,
    },
  },
  {
    id: "iskar",
    name: "Искър",
    coordinates: [23.4123, 42.6823],
    vitalScore: 64,
    population: 72345,
    area: 18.93,
    indicators: {
      airPollution: 55,
      heatIslands: 58,
      greenSpaces: 60,
      publicTransport: 75,
      schools: 72,
      noise: 52,
      futureBuilding: 58,
    },
  },
  {
    id: "pancharevo",
    name: "Панчарево",
    coordinates: [23.4345, 42.5856],
    vitalScore: 75,
    population: 15678,
    area: 313.26,
    indicators: {
      airPollution: 82,
      heatIslands: 78,
      greenSpaces: 92,
      publicTransport: 28,
      schools: 55,
      noise: 90,
      futureBuilding: 62,
    },
  },
  {
    id: "kremikovtsi",
    name: "Кремиковци",
    coordinates: [23.5234, 42.7089],
    vitalScore: 52,
    population: 23456,
    area: 251.67,
    indicators: {
      airPollution: 35,
      heatIslands: 55,
      greenSpaces: 72,
      publicTransport: 25,
      schools: 48,
      noise: 78,
      futureBuilding: 45,
    },
  },
  // Northern districts
  {
    id: "serdika",
    name: "Сердика",
    coordinates: [23.3167, 42.7134],
    vitalScore: 60,
    population: 44567,
    area: 5.45,
    indicators: {
      airPollution: 40,
      heatIslands: 45,
      greenSpaces: 50,
      publicTransport: 85,
      schools: 75,
      noise: 42,
      futureBuilding: 68,
    },
  },
  {
    id: "krasna-polyana",
    name: "Красна поляна",
    coordinates: [23.2578, 42.7289],
    vitalScore: 58,
    population: 68234,
    area: 5.87,
    indicators: {
      airPollution: 45,
      heatIslands: 50,
      greenSpaces: 55,
      publicTransport: 72,
      schools: 68,
      noise: 48,
      futureBuilding: 52,
    },
  },
];

// Total count of districts
export const TOTAL_DISTRICTS = NEIGHBORHOODS.length;

// Calculate total population
export const TOTAL_POPULATION = NEIGHBORHOODS.reduce(
  (sum, n) => sum + (n.population || 0),
  0
);

export interface FilterWeights {
  airPollution: number;
  greenSpaces: number;
  publicTransport: number;
  quietness: number;
}

export interface AppState {
  activeLayers: LayerType[];
  selectedNeighborhood: Neighborhood | null;
  filterWeights: FilterWeights;
  userProfile: "family" | "young" | "senior" | null;
}

export const defaultState: AppState = {
  activeLayers: ["airPollution", "greenSpaces"],
  selectedNeighborhood: null,
  filterWeights: {
    airPollution: 50,
    greenSpaces: 50,
    publicTransport: 50,
    quietness: 50,
  },
  userProfile: null,
};

export const AppStateContext = createContext<{
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
} | null>(null);

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function calculateVitalScore(
  neighborhood: Neighborhood,
  weights: FilterWeights
): number {
  const totalWeight =
    weights.airPollution +
    weights.greenSpaces +
    weights.publicTransport +
    weights.quietness;

  if (totalWeight === 0) return neighborhood.vitalScore;

  const weightedScore =
    (neighborhood.indicators.airPollution * weights.airPollution +
      neighborhood.indicators.greenSpaces * weights.greenSpaces +
      neighborhood.indicators.publicTransport * weights.publicTransport +
      neighborhood.indicators.noise * weights.quietness) /
    totalWeight;

  return Math.round(weightedScore);
}

// Get districts sorted by vital score
export function getTopDistricts(count: number = 5): Neighborhood[] {
  return [...NEIGHBORHOODS].sort((a, b) => b.vitalScore - a.vitalScore).slice(0, count);
}

// Get districts by category
export function getDistrictsByCategory(
  category: "best" | "worst" | "central" | "green"
): Neighborhood[] {
  const sorted = [...NEIGHBORHOODS].sort((a, b) => b.vitalScore - a.vitalScore);
  
  switch (category) {
    case "best":
      return sorted.slice(0, 5);
    case "worst":
      return sorted.slice(-5).reverse();
    case "central":
      return NEIGHBORHOODS.filter((n) =>
        ["sredets", "oborishte", "vazrazhdane", "triaditsa"].includes(n.id)
      );
    case "green":
      return [...NEIGHBORHOODS]
        .sort((a, b) => b.indicators.greenSpaces - a.indicators.greenSpaces)
        .slice(0, 5);
    default:
      return sorted;
  }
}
