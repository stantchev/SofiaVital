import { NextResponse } from "next/server";

const SOFIAPLAN_API = "https://api.sofiaplan.bg";

export async function GET() {
  try {
    const response = await fetch(`${SOFIAPLAN_API}/datasets`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch datasets from SofiaPlan API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("SofiaPlan API error:", error);
    return NextResponse.json(
      { error: "Failed to connect to SofiaPlan API" },
      { status: 500 }
    );
  }
}
