"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Database,
  Map,
  Code,
  Search,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  FileJson,
  MapPin,
  Wind,
  Trees,
  Bus,
  GraduationCap,
  Volume2,
  Thermometer,
  Building,
} from "lucide-react";
import type { Dataset } from "@/lib/sofiaplan-api";

export default function DocsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const response = await fetch("/api/sofiaplan/datasets");
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setDatasets(data);
        setFilteredDatasets(data);
      } catch (error) {
        console.error("Failed to fetch datasets:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDatasets();
  }, []);

  useEffect(() => {
    let filtered = datasets;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((d) => d.category === selectedCategory);
    }

    setFilteredDatasets(filtered);
  }, [searchQuery, selectedCategory, datasets]);

  const categories = [...new Set(datasets.map((d) => d.category))].sort();

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    if (category.includes("въздух")) return <Wind className="h-4 w-4" />;
    if (category.includes("Зелен") || category.includes("зелен")) return <Trees className="h-4 w-4" />;
    if (category.includes("Транспорт") || category.includes("транспорт")) return <Bus className="h-4 w-4" />;
    if (category.includes("Образование") || category.includes("учил")) return <GraduationCap className="h-4 w-4" />;
    if (category.includes("Шум") || category.includes("шум")) return <Volume2 className="h-4 w-4" />;
    if (category.includes("Топл") || category.includes("темп")) return <Thermometer className="h-4 w-4" />;
    if (category.includes("застро") || category.includes("Устройств")) return <Building className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Към картата
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-xl font-semibold text-foreground">Документация</h1>
          </div>
          <a
            href="https://sofiaplan.bg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            Софияплан
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="overview" className="gap-2">
              <Map className="h-4 w-4" />
              Преглед
            </TabsTrigger>
            <TabsTrigger value="api" className="gap-2">
              <Code className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="datasets" className="gap-2">
              <Database className="h-4 w-4" />
              Данни
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Какво е SofiaVital?
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-4">
                SofiaVital е интерактивна уеб карта, която помага на гражданите да
                сравняват всички <strong className="text-foreground">24 официални района</strong> на София по качество на живот.
                Използваме отворени данни от Софияплан API за визуализиране на различни
                индикатори като замърсяване на въздуха, зелени площи, обществен транспорт и други.
              </p>
              <p className="text-sm text-muted-foreground">
                Проект на{" "}
                <a
                  href="https://stanchev.bg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  Stanchev Digital
                </a>
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Слоеве данни
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: <Wind className="h-5 w-5" />,
                    title: "Замърсяване на въздуха",
                    description: "PM10, NO₂ концентрации и превишения",
                    color: "bg-red-500",
                  },
                  {
                    icon: <Thermometer className="h-5 w-5" />,
                    title: "Топлинни острови",
                    description: "Температурни зони в града",
                    color: "bg-orange-500",
                  },
                  {
                    icon: <Trees className="h-5 w-5" />,
                    title: "Зелени площи",
                    description: "Паркове, градини, дървесна покривка",
                    color: "bg-green-500",
                  },
                  {
                    icon: <Bus className="h-5 w-5" />,
                    title: "Обществен транспорт",
                    description: "Метро, трамваи, автобуси",
                    color: "bg-blue-500",
                  },
                  {
                    icon: <GraduationCap className="h-5 w-5" />,
                    title: "Образование",
                    description: "Училища и детски градини",
                    color: "bg-purple-500",
                  },
                  {
                    icon: <Volume2 className="h-5 w-5" />,
                    title: "Шумови зони",
                    description: "Карти на шума от различни източници",
                    color: "bg-gray-500",
                  },
                  {
                    icon: <Building className="h-5 w-5" />,
                    title: "Бъдещо застрояване",
                    description: "Устройствени планове и разрешения",
                    color: "bg-yellow-500",
                  },
                ].map((layer, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${layer.color} text-white`}
                        >
                          {layer.icon}
                        </div>
                        <CardTitle className="text-base">{layer.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{layer.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Vital Score
              </h3>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    Vital Score е агрегиран показател от 0 до 100, който обобщава
                    качеството на живот в даден квартал. Изчислява се като претеглена
                    средна стойност на следните индикатори:
                  </p>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#ef4444]" />
                      <span className="text-sm text-muted-foreground">
                        {"<"}50 - Нисък
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#eab308]" />
                      <span className="text-sm text-muted-foreground">
                        50-70 - Среден
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
                      <span className="text-sm text-muted-foreground">
                        {">"}70 - Висок
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                SofiaPlan API
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mb-6">
                API на Софияплан предоставя отворен достъп до географски данни за
                град София. Данните са в GeoJSON формат и могат да се използват за
                различни анализи и визуализации.
              </p>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Base URL</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="bg-muted px-3 py-2 rounded text-sm block">
                    https://api.sofiaplan.bg
                  </code>
                </CardContent>
              </Card>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Endpoints
              </h3>
              <div className="space-y-4">
                {/* Version Endpoint */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">GET</Badge>
                      <CardTitle className="text-base font-mono">/version</CardTitle>
                    </div>
                    <CardDescription>
                      Връща текущата версия на API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            'fetch("https://api.sofiaplan.bg/version")\n  .then(res => res.json())\n  .then(data => console.log(data))',
                            "version"
                          )
                        }
                      >
                        {copiedCode === "version" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        <code>{`fetch("https://api.sofiaplan.bg/version")
  .then(res => res.json())
  .then(data => console.log(data))

// Response: { "version": "1.0.0" }`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Datasets List Endpoint */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">GET</Badge>
                      <CardTitle className="text-base font-mono">/datasets</CardTitle>
                    </div>
                    <CardDescription>
                      Връща списък с всички налични набори от данни
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 relative mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            'fetch("https://api.sofiaplan.bg/datasets")\n  .then(res => res.json())\n  .then(datasets => console.log(datasets))',
                            "datasets"
                          )
                        }
                      >
                        {copiedCode === "datasets" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        <code>{`fetch("https://api.sofiaplan.bg/datasets")
  .then(res => res.json())
  .then(datasets => console.log(datasets))`}</code>
                      </pre>
                    </div>
                    <h4 className="font-medium text-foreground mb-2">
                      Структура на отговора:
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 font-medium">Поле</th>
                            <th className="text-left py-2 px-3 font-medium">Тип</th>
                            <th className="text-left py-2 px-3 font-medium">Описание</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">id</td>
                            <td className="py-2 px-3 text-muted-foreground">number</td>
                            <td className="py-2 px-3 text-muted-foreground">Уникален идентификатор</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">name</td>
                            <td className="py-2 px-3 text-muted-foreground">string</td>
                            <td className="py-2 px-3 text-muted-foreground">Име на ресурса</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">description</td>
                            <td className="py-2 px-3 text-muted-foreground">string</td>
                            <td className="py-2 px-3 text-muted-foreground">Описание на ресурса</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">category</td>
                            <td className="py-2 px-3 text-muted-foreground">string</td>
                            <td className="py-2 px-3 text-muted-foreground">Категория на ресурса</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">provider</td>
                            <td className="py-2 px-3 text-muted-foreground">string</td>
                            <td className="py-2 px-3 text-muted-foreground">Източник на данните</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">relevant_at</td>
                            <td className="py-2 px-3 text-muted-foreground">string (ISO)</td>
                            <td className="py-2 px-3 text-muted-foreground">Дата на валидност</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 font-mono text-primary">row_count</td>
                            <td className="py-2 px-3 text-muted-foreground">number</td>
                            <td className="py-2 px-3 text-muted-foreground">Брой обекти</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-mono text-primary">size</td>
                            <td className="py-2 px-3 text-muted-foreground">string</td>
                            <td className="py-2 px-3 text-muted-foreground">Размер на файла</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Dataset by ID Endpoint */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">GET</Badge>
                      <CardTitle className="text-base font-mono">/datasets/:id</CardTitle>
                    </div>
                    <CardDescription>
                      Изтегля ресурс по ID (GeoJSON формат за географски данни)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4 relative mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            '// Пример: Зареждане на PM10 данни (ID: 579)\nfetch("https://api.sofiaplan.bg/datasets/579")\n  .then(res => res.json())\n  .then(geojson => {\n    // Използвайте GeoJSON данните\n    console.log(geojson.features.length + " обекта")\n  })',
                            "dataset-id"
                          )
                        }
                      >
                        {copiedCode === "dataset-id" ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Пример: Зареждане на PM10 данни (ID: 579)
fetch("https://api.sofiaplan.bg/datasets/579")
  .then(res => res.json())
  .then(geojson => {
    // Използвайте GeoJSON данните
    console.log(geojson.features.length + " обекта")
  })`}</code>
                      </pre>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Параметърът <code className="bg-muted px-1 rounded">:id</code>{" "}
                      трябва да бъде целочислен идентификатор от списъка с datasets.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Налични данни
              </h2>
              <p className="text-muted-foreground mb-6">
                Разгледайте всички {datasets.length} набора от данни, налични в
                SofiaPlan API.
              </p>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Търсене по име или описание..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Всички
                  </Button>
                  {categories.slice(0, 6).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="gap-1"
                    >
                      {getCategoryIcon(category)}
                      <span className="hidden sm:inline">{category.split(" ")[0]}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Datasets List */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Показани: {filteredDatasets.length} от {datasets.length} набора
                  </p>
                  <div className="grid gap-3">
                    {filteredDatasets.slice(0, 50).map((dataset) => (
                      <Card
                        key={dataset.id}
                        className="hover:border-primary/50 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  ID: {dataset.id}
                                </Badge>
                                <Badge variant="secondary" className="text-xs gap-1">
                                  {getCategoryIcon(dataset.category)}
                                  {dataset.category}
                                </Badge>
                              </div>
                              <h4 className="font-medium text-foreground text-sm truncate">
                                {dataset.name}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {dataset.description}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{dataset.row_count.toLocaleString()} обекта</span>
                                <span>{dataset.size}</span>
                                <span>{dataset.provider}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={`https://api.sofiaplan.bg/datasets/${dataset.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="ghost" size="sm" className="gap-1">
                                  <FileJson className="h-4 w-4" />
                                  <span className="hidden sm:inline">GeoJSON</span>
                                </Button>
                              </a>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {filteredDatasets.length > 50 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Показани са първите 50 резултата. Използвайте търсенето за
                      по-конкретни резултати.
                    </p>
                  )}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8 bg-card/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Данните са предоставени от{" "}
            <a
              href="https://sofiaplan.bg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Софияплан
            </a>
            {" "}под отворен лиценз.
          </p>
        </div>
      </footer>
    </main>
  );
}
