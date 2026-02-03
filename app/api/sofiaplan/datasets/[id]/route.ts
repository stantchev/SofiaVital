import { NextResponse } from "next/server";

const SOFIAPLAN_API = "https://api.sofiaplan.bg";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id || Number.isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid dataset ID" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${SOFIAPLAN_API}/datasets/${id}`, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch dataset ${id} from SofiaPlan API` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`SofiaPlan API error for dataset ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to connect to SofiaPlan API" },
      { status: 500 }
    );
  }
}
