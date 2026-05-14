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

// این مسیرها حتی بدون تست هم مجازن
const TEST_EXEMPT_PATHS = [
  "/dashboard/personality-test",
  "/test",
  "/login",
  "/cafe",
  "/admin",
];

const ADMIN_PHONES = [
  "09356815523",
  "09929564895",
  "09933830958",
];

function noCache(res: NextResponse): NextResponse {
  res.headers.set("Cache-Control", "private, no-store, no-cache");
  res.headers.set("CDN-Cache-Control", "no-store");
  return res;
}

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

  // توکن منقضی → پاک کن و برو login
  if (!isLoggedIn && token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("token", "", { path: "/", expires: new Date(0), maxAge: 0 });
    return noCache(res);
  }

  // نه لاگین، صفحه محافظت‌شده
  if (!isLoggedIn && isProtected) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return noCache(NextResponse.redirect(url));
  }

  // لاگین کرده و روی /login
  if (isLoggedIn && pathname === "/login") {
    const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard/personality-test";
    const safe = redirectTo.startsWith("/") ? redirectTo : "/dashboard/personality-test";
    return noCache(NextResponse.redirect(new URL(safe, request.url)));
  }

  // /admin فقط برای ادمین
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !isAdminPayload(payload)) {
      return noCache(NextResponse.redirect(new URL("/dashboard", request.url)));
    }
  }

  // کاربر لاگین کرده ولی تست نداده → فقط می‌تونه بره صفحه تست
  // غیرفعال: redirect اجباری به تست شخصیت
  // if (isLoggedIn && !payload?.isTestTaken && ...) { ... }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
