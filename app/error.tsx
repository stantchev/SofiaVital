"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-destructive" />
          </div>
        </div>

        {/* Error */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Нещо се обърка
          </h1>
          <p className="text-muted-foreground">
            Възникна грешка при зареждане на страницата. Моля, опитайте отново.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button onClick={reset} className="w-full sm:w-auto gap-2">
            <RefreshCw className="w-4 h-4" />
            Опитай отново
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              Към началото
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground pt-8">
          Ако проблемът продължава, моля свържете се с{" "}
          <a
            href="mailto:contact@stanchev.bg"
            className="text-primary hover:underline"
          >
            contact@stanchev.bg
          </a>
        </p>
      </div>
    </main>
  );
}
