import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function handleRequest(request: NextRequest): Promise<NextResponse> {
  const method = request.method as HttpMethod;
  const { pathname, searchParams } = request.nextUrl;

  const pathSegments = pathname.split("/").slice(3);
  const path = pathSegments.join("/");
  const isBodyRequired = method === "POST" || method === "PUT";
  const queryString = !isBodyRequired ? searchParams.toString() : "";
  const url = `${BASE_URL}/${path}${queryString ? `?${queryString}` : ""}`;

  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
    };

    if (isBodyRequired) {
      const body = await request.json();
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`${method} ${url}:`, error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return handleRequest(request);
}
