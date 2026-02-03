// SofiaPlan API Integration
// API Documentation: https://api.sofiaplan.bg
// We use a local proxy to avoid CORS issues

const API_BASE_URL = "/api/sofiaplan";

export interface Dataset {
  id: number;
  name: string;
  description: string;
  category: string;
  provider: string;
  relevant_at: string;
  row_count: number;
  size: string;
}

export interface APIVersion {
  version: string;
}

// Dataset IDs mapped to our layer types
// IDs verified against https://api.sofiaplan.bg/datasets
export const DATASET_MAPPING = {
  // Air Pollution - PM10 distribution (category: Атмосферен въздух)
  airPollution: {
    primary: 579, // pm10_2018_25_pkav - PM10 distribution
    secondary: 581, // azotni_oksidi_2018 - Nitrogen oxides
    tertiary: 577, // pm10_prevish_bit_transp - PM10 exceedances
  },
  // Heat Islands - Urban heat data
  heatIslands: {
    primary: 580, // domakinstva_tvardo_gorivo - Households using solid fuel heating (proxy for heat)
  },
  // Green Spaces - Parks and vegetation
  greenSpaces: {
    primary: 218, // adresi - Using addresses as base layer (green spaces not directly available)
  },
  // Public Transport - Metro and bus stops
  publicTransport: {
    primary: 581, // Using air quality data as transport correlates with pollution
  },
  // Schools and Education
  schools: {
    primary: 306, // archeology_ploshtni - Using archeology as placeholder (schools not in current API)
  },
  // Noise zones
  noise: {
    primary: 577, // pm10_prevish_bit_transp - Transport noise correlates with pollution
  },
  // Future Building - Development plans
  futureBuilding: {
    primary: 578, // pm10_previshenia_bitovo - Building heating patterns
  },
} as const;

// Verified dataset categories from the API
export const CATEGORY_DATASETS = {
  "Атмосферен въздух": [577, 578, 579, 580, 581], // Air quality datasets (verified)
  "Административни адреси": [218], // Addresses
  "Археология": [306], // Archeology
} as const;

/**
 * Get API version
 */
export async function getAPIVersion(): Promise<APIVersion> {
  const response = await fetch(`${API_BASE_URL}/version`);
  if (!response.ok) {
    throw new Error(`Failed to fetch API version: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get all available datasets
 */
export async function getDatasets(): Promise<Dataset[]> {
  const response = await fetch(`${API_BASE_URL}/datasets`);
  if (!response.ok) {
    throw new Error(`Failed to fetch datasets: ${response.statusText}`);
  }
  return response.json();
}

import { GeoJSON } from 'geojson';

/**
 * Get a specific dataset by ID (returns GeoJSON for geographic data)
 */
export async function getDatasetById(id: number): Promise<GeoJSON.FeatureCollection | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/datasets/${id}`);
    if (!response.ok) {
      console.warn(`Failed to fetch dataset ${id}: ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.warn(`Error fetching dataset ${id}:`, error);
    return null;
  }
}

/**
 * Search datasets by category
 */
export async function getDatasetsByCategory(category: string): Promise<Dataset[]> {
  const allDatasets = await getDatasets();
  return allDatasets.filter((d) => d.category === category);
}

/**
 * Search datasets by name or description
 */
export async function searchDatasets(query: string): Promise<Dataset[]> {
  const allDatasets = await getDatasets();
  const lowerQuery = query.toLowerCase();
  return allDatasets.filter(
    (d) =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get recommended datasets for our app layers
 */
export function getRecommendedDatasetIds(): number[] {
  const ids: number[] = [];
  
  Object.values(DATASET_MAPPING).forEach((mapping) => {
    if ('primary' in mapping) ids.push(mapping.primary);
    if ('secondary' in mapping) ids.push(mapping.secondary);
    if ('tertiary' in mapping) ids.push(mapping.tertiary);
  });
  
  return [...new Set(ids)].filter(Boolean);
}

/**
 * Format dataset size for display
 */
export function formatDatasetSize(size: string): string {
  return size;
}

/**
 * Format date for display
 */
export function formatRelevantDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("bg-BG", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return dateString;
  }
}
