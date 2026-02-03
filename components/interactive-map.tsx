"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  NEIGHBORHOODS,
  LAYERS,
  TOTAL_DISTRICTS,
  type LayerType,
  type Neighborhood,
  useAppState,
} from "@/lib/store";
import { LayerSelector } from "./layer-selector";
import { getDatasetById, DATASET_MAPPING } from "@/lib/sofiaplan-api";
import { Loader2, MapPin, Info } from "lucide-react";

interface InteractiveMapProps {
  onNeighborhoodSelect: (neighborhood: Neighborhood) => void;
}

// Enhanced map style with better visuals
const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
  },
  layers: [
    {
      id: "carto-basemap",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

// Color mapping for different layer types
const LAYER_COLORS: Record<
  LayerType,
  { fill: string; stroke: string; opacity: number }
> = {
  airPollution: { fill: "#ef4444", stroke: "#b91c1c", opacity: 0.35 },
  heatIslands: { fill: "#f97316", stroke: "#c2410c", opacity: 0.35 },
  greenSpaces: { fill: "#22c55e", stroke: "#15803d", opacity: 0.4 },
  publicTransport: { fill: "#3b82f6", stroke: "#1d4ed8", opacity: 0.5 },
  schools: { fill: "#a855f7", stroke: "#7e22ce", opacity: 0.5 },
  noise: { fill: "#6b7280", stroke: "#374151", opacity: 0.35 },
  futureBuilding: { fill: "#eab308", stroke: "#a16207", opacity: 0.35 },
};

export function InteractiveMap({ onNeighborhoodSelect }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingLayers, setLoadingLayers] = useState<Set<LayerType>>(new Set());
  const [loadedGeoJsonLayers, setLoadedGeoJsonLayers] = useState<Set<string>>(
    new Set()
  );
  const [hoveredNeighborhood, setHoveredNeighborhood] =
    useState<Neighborhood | null>(null);
  const { state } = useAppState();

  // Function to get color based on vital score
  const getMarkerColor = useCallback(
    (neighborhood: Neighborhood): string => {
      if (state.activeLayers.length === 0) {
        const score = neighborhood.vitalScore;
        if (score >= 75) return "#22c55e";
        if (score >= 65) return "#84cc16";
        if (score >= 55) return "#eab308";
        if (score >= 45) return "#f97316";
        return "#ef4444";
      }

      let totalScore = 0;
      let count = 0;

      state.activeLayers.forEach((layerId) => {
        const indicator = neighborhood.indicators[layerId];
        if (indicator !== undefined) {
          totalScore += indicator;
          count++;
        }
      });

      const avgScore = count > 0 ? totalScore / count : 50;

      if (avgScore >= 75) return "#22c55e";
      if (avgScore >= 65) return "#84cc16";
      if (avgScore >= 55) return "#eab308";
      if (avgScore >= 45) return "#f97316";
      return "#ef4444";
    },
    [state.activeLayers]
  );

  // Load GeoJSON data from SofiaPlan API
  const loadLayerData = useCallback(
    async (layerType: LayerType) => {
      if (!map.current || !mapLoaded) return;

      const mapping = DATASET_MAPPING[layerType];
      if (!mapping || !("primary" in mapping)) return;

      const sourceId = `source-${layerType}`;
      const layerId = `layer-${layerType}-fill`;
      const outlineLayerId = `layer-${layerType}-outline`;

      if (loadedGeoJsonLayers.has(layerType)) {
        if (map.current.getLayer(layerId)) {
          map.current.setLayoutProperty(layerId, "visibility", "visible");
        }
        if (map.current.getLayer(outlineLayerId)) {
          map.current.setLayoutProperty(outlineLayerId, "visibility", "visible");
        }
        return;
      }

      setLoadingLayers((prev) => new Set(prev).add(layerType));

      try {
        const geojson = await getDatasetById(mapping.primary);

        if (geojson && map.current) {
          if (!map.current.getSource(sourceId)) {
            map.current.addSource(sourceId, {
              type: "geojson",
              data: geojson,
            });
          }

          const colors = LAYER_COLORS[layerType];

          if (!map.current.getLayer(layerId)) {
            map.current.addLayer({
              id: layerId,
              type: "fill",
              source: sourceId,
              paint: {
                "fill-color": colors.fill,
                "fill-opacity": colors.opacity,
              },
            });
          }

          if (!map.current.getLayer(outlineLayerId)) {
            map.current.addLayer({
              id: outlineLayerId,
              type: "line",
              source: sourceId,
              paint: {
                "line-color": colors.stroke,
                "line-width": 1.5,
              },
            });
          }

          setLoadedGeoJsonLayers((prev) => new Set(prev).add(layerType));
        }
      } catch (error) {
        console.warn(`Failed to load layer ${layerType}:`, error);
      } finally {
        setLoadingLayers((prev) => {
          const next = new Set(prev);
          next.delete(layerType);
          return next;
        });
      }
    },
    [mapLoaded, loadedGeoJsonLayers]
  );

  // Hide a layer
  const hideLayerData = useCallback((layerType: LayerType) => {
    if (!map.current) return;

    const layerId = `layer-${layerType}-fill`;
    const outlineLayerId = `layer-${layerType}-outline`;

    if (map.current.getLayer(layerId)) {
      map.current.setLayoutProperty(layerId, "visibility", "none");
    }
    if (map.current.getLayer(outlineLayerId)) {
      map.current.setLayoutProperty(outlineLayerId, "visibility", "none");
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [23.3219, 42.6977],
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      maxBounds: [
        [22.8, 42.35],
        [23.9, 43.1],
      ],
      pitchWithRotate: false,
      dragRotate: false,
      attributionControl: false,
    });

    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }),
      "top-left"
    );

    map.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
      "bottom-right"
    );

    map.current.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-right"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
      // Force resize after load to fix container size issues
      setTimeout(() => {
        map.current?.resize();
      }, 100);
    });

    // Handle window resize
    const handleResize = () => {
      map.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      markers.current.forEach((marker) => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Handle active layers changes
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    state.activeLayers.forEach((layerType) => {
      loadLayerData(layerType);
    });

    const allLayerTypes: LayerType[] = [
      "airPollution",
      "heatIslands",
      "greenSpaces",
      "publicTransport",
      "schools",
      "noise",
      "futureBuilding",
    ];

    allLayerTypes.forEach((layerType) => {
      if (!state.activeLayers.includes(layerType)) {
        hideLayerData(layerType);
      }
    });
  }, [state.activeLayers, mapLoaded, loadLayerData, hideLayerData]);

  // Update markers
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    NEIGHBORHOODS.forEach((neighborhood) => {
      const color = getMarkerColor(neighborhood);

      const el = document.createElement("div");
      el.className = "neighborhood-marker";
      el.style.cssText = `
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        color: white;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        z-index: 1;
        text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        font-family: system-ui, -apple-system, sans-serif;
      `;
      el.textContent = neighborhood.vitalScore.toString();

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.2)";
        el.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.2)";
        el.style.zIndex = "10";
        setHoveredNeighborhood(neighborhood);
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
        el.style.boxShadow = "0 3px 10px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.15)";
        el.style.zIndex = "1";
        setHoveredNeighborhood(null);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(neighborhood.coordinates)
        .addTo(map.current!);

      el.addEventListener("click", () => {
        onNeighborhoodSelect(neighborhood);
        map.current?.flyTo({
          center: neighborhood.coordinates,
          zoom: 13.5,
          duration: 800,
          essential: true,
        });
      });

      markers.current.push(marker);
    });
  }, [mapLoaded, state.activeLayers, getMarkerColor, onNeighborhoodSelect]);

  const isLoading = loadingLayers.size > 0;

  return (
    <section 
      id="map-section" 
      className="relative w-full"
      style={{ height: "calc(100vh - 100px)", minHeight: "600px" }}
    >
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-card/95 backdrop-blur-md rounded-xl px-5 py-3.5 shadow-xl border border-border flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium text-foreground">
            Зареждане на данни...
          </span>
        </div>
      )}

      {/* Layer Selector */}
      <div className="absolute top-4 right-4 z-10">
        <LayerSelector />
      </div>

      {/* Hover Tooltip */}
      {hoveredNeighborhood && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-border pointer-events-none">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: getMarkerColor(hoveredNeighborhood) }}
            >
              {hoveredNeighborhood.vitalScore}
            </div>
            <div>
              <div className="font-semibold text-foreground text-base">
                {hoveredNeighborhood.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {hoveredNeighborhood.population?.toLocaleString("bg-BG")} жители
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-24 left-4 z-10 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-border">
        <div className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-muted-foreground" />
          Vital Score
        </div>
        <div className="flex flex-col gap-2">
          <LegendItem color="#22c55e" label="Отлично" range="75-100" />
          <LegendItem color="#84cc16" label="Добро" range="65-74" />
          <LegendItem color="#eab308" label="Средно" range="55-64" />
          <LegendItem color="#f97316" label="Под средно" range="45-54" />
          <LegendItem color="#ef4444" label="Слабо" range="0-44" />
        </div>
      </div>

      {/* District Count Badge */}
      <div className="absolute bottom-24 right-4 z-10 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-border">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {TOTAL_DISTRICTS} района
          </span>
        </div>
      </div>

      {/* Data Attribution */}
      <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border border-border/50">
        Данни:{" "}
        <a
          href="https://sofiaplan.bg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground font-medium"
        >
          Софияплан
        </a>{" "}
        | Проект на{" "}
        <a
          href="https://stanchev.bg"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground font-medium"
        >
          Stanchev Digital
        </a>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Active Layers Indicator */}
      {state.activeLayers.length > 0 && (
        <div className="absolute top-20 left-4 z-10 bg-card/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-border max-w-[220px]">
          <div className="text-xs font-medium text-muted-foreground mb-2">
            Активни слоеве:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {state.activeLayers.map((layerId) => {
              const layer = LAYERS.find((l) => l.id === layerId);
              const isLayerLoading = loadingLayers.has(layerId);
              return (
                <span
                  key={layerId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white shadow-sm"
                  style={{ backgroundColor: layer?.color }}
                >
                  {isLayerLoading && (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  )}
                  {layer?.name.split(" ")[0]}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function LegendItem({
  color,
  label,
  range,
}: {
  color: string;
  label: string;
  range: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="w-4 h-4 rounded-full shadow-sm border border-white/20"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-foreground flex-1">{label}</span>
      <span className="text-[10px] text-muted-foreground font-medium">{range}</span>
    </div>
  );
}
