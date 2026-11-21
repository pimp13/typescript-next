import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Pretty profile URLs: /@username or /@uuid
 * Rewrites to /profile/:handle while keeping the address bar as /@...
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/@")) {
    return NextResponse.next();
  }

  const raw = pathname.slice(2).replace(/\/+$/, "");
  const handle = decodeURIComponent(raw).trim();
  if (!handle || handle.includes("/")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/profile/${encodeURIComponent(handle)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
