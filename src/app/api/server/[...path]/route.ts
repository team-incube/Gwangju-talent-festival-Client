import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

async function handleRequest(request: NextRequest, params: { path: string[] }, method: HttpMethod) {
  const path = params.path.join("/");
  const isBodyRequired = method === "POST" || method === "PUT";
  const searchParams = !isBodyRequired ? request.nextUrl.searchParams.toString() : "";
  const url = `${BASE_URL}/${path}${searchParams ? `?${searchParams}` : ""}`;

  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
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

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, "GET");
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, "POST");
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, "PUT");
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, "DELETE");
}

export async function PATCH(request: NextRequest, { params }: { params: { path: string[] } }) {
  return handleRequest(request, params, "PATCH");
}
