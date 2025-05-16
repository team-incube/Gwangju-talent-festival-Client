import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/images|favicon.ico|api).*)", "/signin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  if (pathname === "/signin" && accessToken && refreshToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/test") &&
    pathname !== "/signin" &&
    pathname !== "/signup" &&
    pathname !== "/home" &&
    pathname !== "/slogan" &&
    !accessToken &&
    !refreshToken
  ) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}
