"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapPin, Info, Leaf, Wind, Bus, School } from "lucide-react";

interface HeroProps {
  onOpenMap: () => void;
}

export function Hero({ onOpenMap }: HeroProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-16 md:py-24 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/30" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-primary">SofiaVital</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance" style={{ fontFamily: 'var(--font-heading)' }}>
          Къде е по-добре да живея в София?
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Сравни квартали по чист въздух, жега, зеленина, транспорт, училища и бъдещо застрояване
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 py-4">
          <FeaturePill icon={<Wind className="w-4 h-4" />} text="Качество на въздуха" />
          <FeaturePill icon={<Leaf className="w-4 h-4" />} text="Зелени площи" />
          <FeaturePill icon={<Bus className="w-4 h-4" />} text="Транспорт" />
          <FeaturePill icon={<School className="w-4 h-4" />} text="Училища" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={onOpenMap}
            className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Отвори картата
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-6 rounded-xl bg-transparent"
              >
                <Info className="w-5 h-5 mr-2" />
                Как работи?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                  Как работи SofiaVital?
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  SofiaVital събира и визуализира данни за качеството на живот в различни
                  квартали на София. Ето как да използвате картата:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Изберете слоевете, които ви интересуват (въздух, зеленина, транспорт)</li>
                  <li>Кликнете върху квартал, за да видите детайли</li>
                  <li>Използвайте филтрите, за да персонализирате оценката</li>
                  <li>Сравнете различни райони и намерете идеалното място за вас</li>
                </ol>
                <p className="text-sm">
                  Данните са базирани на публична информация от api.sofiaplan.bg и
                  потребителски отзиви.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-8 max-w-md mx-auto">
          <StatItem value="24" label="Района" />
          <StatItem value="7" label="Индикатора" />
          <StatItem value="100%" label="Безплатно" />
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-primary">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
