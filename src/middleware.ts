import { NextRequest, NextResponse } from "next/server";
import { publicPages, publicIn27 } from "@/shared/config/authConfig";
import { festivalDate, sloganStartDate, sloganEndDate, applyStartDate, applyEndDate, preliminaryResultOpenDate } from "@/shared/config/dateConfig";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|images|video|files|fonts).*)",
    "/signin",
    "/robots.txt",
  ],
};

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const role = request.cookies.get("role")?.value;

  const isPublicAdminPath =
    pathname.match(/^\/admin\/lottery\/[^/]+$/) ||
    pathname.match(/^\/admin\/score\/[^/]+$/) ||
    pathname.match(/^\/admin\/apply\/[^/]+$/);
  if (role !== "ADMIN" && pathname.startsWith("/admin") && !isPublicAdminPath) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/robots.txt") {
    const host = request.headers.get("host");
    const targetDomain = "www.광탈페.com";
    if (host && host !== targetDomain) {
      const url = new URL("/robots.txt", `https://${targetDomain}`);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const now = new Date();
  if (pathname === "/slogan" && (now < sloganStartDate || now > sloganEndDate)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/apply" && (now < applyStartDate || now > applyEndDate)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/preliminary-result" && now < preliminaryResultOpenDate) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (pathname === "/signin" && accessToken && refreshToken) {
    const nextParam = searchParams.get("next");
    if (nextParam && nextParam.startsWith("/") && nextParam !== "/signin") {
      return NextResponse.redirect(new URL(nextParam, request.url));
    }
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (publicIn27.includes(pathname)) {
    if (role !== "ADMIN" && new Date() < festivalDate) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  const isProtectedRoute =
    pathname !== "/" &&
    pathname !== "/home" &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/test") &&
    !publicPages.includes(pathname) &&
    !pathname.startsWith("/admin/lottery/") &&
    !pathname.startsWith("/admin/score/") &&
    !pathname.startsWith("/admin/apply/");

  if (isProtectedRoute && !accessToken && !refreshToken) {
    const signinUrl = new URL("/signin", request.url);
    const intended = request.nextUrl.pathname + request.nextUrl.search;
    signinUrl.searchParams.set("next", intended);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}
