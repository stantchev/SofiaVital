"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Github, MessageSquare, FileText, Heart } from "lucide-react";
import { TOTAL_DISTRICTS, TOTAL_POPULATION } from "@/lib/store";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 pb-8 border-b border-border">
          <FooterStat value={TOTAL_DISTRICTS.toString()} label="Района" />
          <FooterStat value="7" label="Индикатора" />
          <FooterStat value={formatPopulation(TOTAL_POPULATION)} label="Население" />
          <FooterStat value="100+" label="Набора данни" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground block">SofiaVital</span>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </Link>

          {/* Data Source */}
          <p className="text-sm text-muted-foreground text-center">
            Данни от{" "}
            <a
              href="https://sofiaplan.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Софияплан
            </a>{" "}
            (отворени данни)
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/docs"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Документация</span>
            </Link>
            <FooterLink
              href="mailto:contact@stanchev.bg"
              icon={<MessageSquare className="w-4 h-4" />}
              label="Контакт"
            />
            <FooterLink
              href="https://github.com/stantchev/SofiaVital"
              icon={<Github className="w-4 h-4" />}
              label="GitHub"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              Направено с <Heart className="w-4 h-4 text-red-500 fill-red-500" /> от{" "}
              <a
                href="https://stanchev.bg"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                Stanchev Digital
              </a>
            </p>
            <p className="text-xs text-muted-foreground text-center">
              &copy; 2026 Stanchev Digital. All rights reserved. Non-commercial use only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center px-4">
      <div className="text-xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function FooterLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

function formatPopulation(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return Math.round(num / 1000) + "K";
  }
  return num.toString();
}
