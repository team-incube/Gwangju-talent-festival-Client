import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value ?? "";

  try {
    const response = await fetch(`${BASE_URL}/excel/summary`, {
      headers: { Authorization: "Bearer " + token },
      cache: "no-store",
    });

    if (!response.ok) {
      const message = await response.text().catch(() => "");
      return NextResponse.json(
        { message: message || "심사 집계표를 다운로드하지 못했습니다." },
        { status: response.status },
      );
    }

    const buffer = await response.arrayBuffer();
    const headers = new Headers();
    headers.set(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    headers.set(
      "Content-Disposition",
      response.headers.get("content-disposition") ??
        'attachment; filename="judging-summary.xlsx"',
    );

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error("GET /excel/summary:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
