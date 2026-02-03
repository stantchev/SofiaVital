import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Home, FileText } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center space-y-6 max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>

        {/* Error */}
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Страницата не е намерена
          </h2>
          <p className="text-muted-foreground">
            Страницата, която търсите, не съществува или е била преместена.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link href="/">
            <Button className="w-full sm:w-auto gap-2">
              <Home className="w-4 h-4" />
              Към картата
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
              <FileText className="w-4 h-4" />
              Документация
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground pt-8">
          SofiaVital - Проект на{" "}
          <a
            href="https://stanchev.bg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Stanchev Digital
          </a>
        </p>
      </div>
    </main>
  );
}
