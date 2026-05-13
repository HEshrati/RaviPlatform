import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/admin",
  "/chat",
  "/wallet",
  "/notifications",
  "/invite-friends",
  "/support",
  "/articles",
  "/courses",
  "/games",
  "/explore",
];

// این مسیرها حتی اگر onboarding ناقص بود، باز باشن
const ONBOARDING_EXEMPT = ["/test", "/login", "/cafe"];

const ADMIN_PHONES = [
  "09356815523",
  "09929564895",
  "09933830958",
];

function decodeToken(token?: string) {
  if (!token) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString(),
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function isAdminPayload(payload: any): boolean {
  if (!payload) return false;
  if (payload.role === "admin") return true;
  const phone = (payload.mobileNumber || payload.phone || "")
    .replace(/[\s\-+]/g, "")
    .replace(/^98/, "0");
  return ADMIN_PHONES.includes(phone);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  )
    return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  const payload = decodeToken(token);
  const isLoggedIn = !!payload;

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  // کاربر لاگین نکرده → برو به login
  if (!isLoggedIn && isProtected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // کاربر لاگین کرده و روی /login هست → برو به dashboard
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // صفحه /admin فقط برای ادمین
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !isAdminPayload(payload)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
