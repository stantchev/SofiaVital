"use client";
import { useState, useRef } from "react";
import { Hero } from "@/components/hero";
import { InteractiveMap } from "@/components/interactive-map";
import { NeighborhoodSidebar } from "@/components/neighborhood-sidebar";
import { FiltersPanel } from "@/components/filters-panel";
import { AiChatBubble } from "@/components/ai-chat-bubble";
import { Footer } from "@/components/footer";
import { AppStateContext, defaultState, type AppState, type Neighborhood } from "@/lib/store";

export default function Home() {
  const [state, setState] = useState<AppState>(defaultState);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    document.getElementById("map-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <AppStateContext.Provider value={{ state, setState }}>
      <main className="relative min-h-screen flex flex-col bg-background text-foreground">
        {/* Hero Section */}
        <Hero onOpenMap={scrollToMap} />

        {/* Map + Floating Controls Section */}
        <section
          id="map-section"
          className="relative h-[70vh] min-h-[500px] w-full flex-1 isolate"
        >
          {/* Floating UI Container – glass effect */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto">
              <FiltersPanel />
            </div>

            {/* Може да сложиш тук още контроли – search bar, view toggle и др. */}
          </div>

          {/* Map */}
          <div className="absolute inset-0">
            <InteractiveMap onNeighborhoodSelect={setSelectedNeighborhood} />
          </div>
        </section>

        {/* Neighborhood Sidebar + Mobile Overlay */}
        {selectedNeighborhood && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
              onClick={() => setSelectedNeighborhood(null)}
              aria-hidden="true"
            />

            <NeighborhoodSidebar
              neighborhood={selectedNeighborhood}
              onClose={() => setSelectedNeighborhood(null)}
              className={`
                fixed md:sticky md:top-0
                inset-y-0 right-0 z-50
                w-full max-w-md md:w-96 lg:w-[420px]
                transform transition-transform duration-300 ease-out
                ${selectedNeighborhood ? "translate-x-0" : "translate-x-full"}
                md:translate-x-0
              `}
            />
          </>
        )}

        {/* Floating AI Chat Button */}
        <AiChatBubble />

        {/* Footer */}
        <Footer />
      </main>
    </AppStateContext.Provider>
  );
}