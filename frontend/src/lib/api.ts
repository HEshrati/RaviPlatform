const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ─── Admin phone numbers ───────────────────────────────────────────────────
export const ADMIN_PHONES = [
  "09356815523",
  "09929564895",
  "09933830958",
];

export function isAdminPhone(phone?: string | null): boolean {
  let role = "";
  if (typeof window !== "undefined") {
    try {
      role = JSON.parse(localStorage.getItem("user") || "{}").role || "";
    } catch {}
  }
  if (role === "admin" || role === "super_admin") return true;
  if (!phone) return false;
  const normalized = phone.replace(/[\s\-+]/g, "").replace(/^98/, "0");
  return ADMIN_PHONES.includes(normalized);
}

// ─── Token helper ──────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
}

// ─── Core fetch ───────────────────────────────────────────────────────────
async function fetchAPI(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
) {
  const { token, ...rest } = options as any;
  const t = token || getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers || {}),
  };
  if (t) headers["Authorization"] = `Bearer ${t}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...rest, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Server error" }));
    throw new Error(err.message || "Connection error");
  }
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────
export const authAPI = {
  requestOtp: (phone: string) =>
    fetchAPI("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, code: string, name?: string) =>
    fetchAPI("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code, name }),
    }),
  login: (identifier: string, password: string) =>
    fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    }),
  getProfile: () => fetchAPI("/api/auth/profile"),
};

// ─── Events ───────────────────────────────────────────────────────────────
export interface ApiEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  start_date?: string;
  endDate?: string;
  end_date?: string;
  capacity: number;
  reservedCount: number;
  current_bookings?: number;
  price: number;
  city?: string;
  event_type?: string;
  category?: string;
  location?: string;
  image_url?: string;
  tags?: string[];
  is_active?: boolean;
  is_featured?: boolean;
  created_by?: string;
}

export const fetchEvents = (params?: {
  page?: number;
  limit?: number;
  city?: string;
  event_type?: string;
}): Promise<{ events: ApiEvent[]; total: number }> => {
  const q = params ? new URLSearchParams(params as any).toString() : "";
  return fetchAPI(`/api/events${q ? "?" + q : ""}`);
};

export const fetchEventById = (id: string): Promise<ApiEvent> =>
  fetchAPI(`/api/events/${id}`);

export const reserveEvent = (eventId: string, quantity = 1, plusOneUserId?: string) =>
  fetchAPI("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ eventId, quantity, plusOneUserId }),
  });

export const createAdminEvent = (data: Partial<ApiEvent>) =>
  fetchAPI("/api/events", { method: "POST", body: JSON.stringify(data) });

export const updateAdminEvent = (id: string, data: Partial<ApiEvent>) =>
  fetchAPI(`/api/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteAdminEvent = (id: string) =>
  fetchAPI(`/api/events/${id}`, { method: "DELETE" });

/** Get events created by the current admin */
export const fetchMyAdminEvents = (): Promise<{
  events: ApiEvent[];
  total: number;
}> => fetchAPI("/api/events/my-events");

/** Get event location - only returned if user is booked AND within 10h of start */
export const fetchEventLocation = (
  eventId: string,
): Promise<{
  location: string | null;
  revealed: boolean;
  minutesRemaining: number;
}> => fetchAPI(`/api/events/${eventId}/location`);

/** Get attendees of an event (admin only) */
export const fetchEventAttendees = (
  eventId: string,
): Promise<{ users: UserPublicProfile[] }> =>
  fetchAPI(`/api/events/${eventId}/attendees`);

// ─── Bookings ─────────────────────────────────────────────────────────────
export interface Booking {
  id: string;
  eventId: string;
  event_id?: string;
  status: string;
  payment_status?: string;
  createdAt: string;
  created_at?: string;
  event?: ApiEvent;
  // فیلدهای غنی‌سازی شده برای ادمین
  eventTitle?: string;
  userName?: string;
  userPhone?: string;
}

export const fetchMyBookings = (status?: string): Promise<Booking[]> =>
  fetchAPI(`/api/bookings${status ? "?status=" + status : ""}`);

export const cancelBooking = (id: string, reason?: string) =>
  fetchAPI(`/api/bookings/${id}/cancel`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

// ─── Admin Bookings ────────────────────────────────────────────────────────

/**
 * دریافت همه رزروها برای پنل ادمین
 * بک‌اند: GET /api/admin/bookings?status=...
 * پاسخ: { bookings: [...], total: number }
 * هر booking شامل relations: user و event است
 */
export const fetchAllBookings = (params?: {
  status?: string;
  eventId?: string;
  page?: number;
  limit?: number;
}): Promise<{ bookings: Booking[]; total: number }> => {
  const q = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return fetchAPI(`/api/admin/bookings${q ? "?" + q : ""}`).then((res) => {
    const bookings: Booking[] = (res.bookings || []).map((b: any) => ({
      ...b,
      // یکسان‌سازی camelCase و snake_case
      createdAt: b.createdAt || b.created_at || "",
      eventId: b.eventId || b.event_id || "",
      // غنی‌سازی از relations
      eventTitle: b.event?.title || b.eventTitle || "",
      userName: b.user?.name || b.userName || "",
      userPhone: b.user?.mobileNumber || b.userPhone || "",
    }));
    return { bookings, total: res.total || bookings.length };
  });
};

/**
 * تغییر وضعیت رزرو توسط ادمین
 * بک‌اند: PATCH /api/admin/bookings/:id  body: { status }
 */
export const updateBookingStatus = (
  id: string,
  status: "confirmed" | "cancelled" | string,
): Promise<Booking> =>
  fetchAPI(`/api/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

// ─── Profile ──────────────────────────────────────────────────────────────
export interface UserProfile {
  avatarUrl?: string;
  bio?: string;
  interests: string[];
  city?: string;
  neighborhood?: string;
  age?: number | null;
  gender?: string;
  /** education یا education_level - هر دو پشتیبانی می‌شوند */
  education?: string;
  completionPercentage?: number;
  firstName?: string;
  lastName?: string;
}

export interface UserPublicProfile {
  id: string;
  name?: string;
  mobileNumber?: string;
  avatar?: string;
  city?: string;
  bio?: string;
}

/**
 * نرمال‌سازی پاسخ بک‌اند به UserProfile
 * بک‌اند ممکن است snake_case یا camelCase بفرستد
 */
function normalizeProfile(raw: any): UserProfile {
  return {
    avatarUrl: raw?.avatarUrl ?? raw?.avatar_url ?? "",
    bio: raw?.bio ?? "",
    interests: Array.isArray(raw?.interests) ? raw.interests : [],
    city: raw?.city ?? "",
    neighborhood: raw?.neighborhood ?? "",
    age: raw?.age ?? null,
    gender: raw?.gender ?? "",
    education: raw?.education ?? raw?.education_level ?? "",
    completionPercentage:
      raw?.completionPercentage ?? raw?.profile_completion_percentage ?? 0,
    firstName: raw?.firstName ?? raw?.first_name ?? "",
    lastName: raw?.lastName ?? raw?.last_name ?? "",
  };
}

export const fetchUserProfile = (): Promise<UserProfile> =>
  fetchAPI("/api/profiles/me").then(normalizeProfile);

export const updateUserProfile = (
  data: Partial<UserProfile>,
): Promise<UserProfile> =>
  fetchAPI("/api/profiles/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then(normalizeProfile);

// ─── User Stats (for profile dashboard) ──────────────────────────────────
export interface UserStats {
  successfulMatches: number;
  completedEvents: number;
  upcomingEvents: number;
  totalBookings: number;
}

// ─── Update user name ───────────────────────────────────────────────────────
export const updateUserName = (name: string): Promise<any> =>
  fetchAPI("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });

export const fetchUserStats = (): Promise<UserStats> =>
  fetchAPI("/api/users/stats").catch(() => ({
    successfulMatches: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    totalBookings: 0,
  }));

// ─── Wallet ───────────────────────────────────────────────────────────────
export interface WalletInfo {
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  type: "charge" | "debit" | "refund";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
  referenceId?: string;
}

export const fetchWallet = (): Promise<WalletInfo> =>
  fetchAPI("/api/wallet").catch(() => ({ balance: 0, currency: "IRR" }));

export const fetchWalletTransactions = (): Promise<WalletTransaction[]> =>
  fetchAPI("/api/wallet/transactions").catch(() => []);

export const chargeWallet = (amount: number, callbackUrl?: string) =>
  fetchAPI("/api/wallet/charge", {
    method: "POST",
    body: JSON.stringify({
      amount,
      callbackUrl:
        callbackUrl ||
        `${typeof window !== "undefined" ? window.location.origin : ""}/payment-success`,
    }),
  });

export const withdrawFromWallet = (amount: number, reason: string) =>
  fetchAPI("/api/wallet/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount, reason }),
  });

// ─── Notifications ────────────────────────────────────────────────────────
export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export const fetchNotifications = (): Promise<{
  unread: number;
  items: NotificationItem[];
}> => fetchAPI("/api/notifications");

// ─── Admin stats ──────────────────────────────────────────────────────────
export interface AdminEventStat {
  eventId: string;
  title: string;
  capacity: number;
  reserved: number;
  attended: number;
  successRate: number; // percentage
  date: string;
}

export const fetchAdminStats = (): Promise<{
  events: AdminEventStat[];
  totalEvents: number;
  avgSuccessRate: number;
}> =>
  fetchAPI("/api/admin/stats").catch(() => ({
    events: [],
    totalEvents: 0,
    avgSuccessRate: 0,
  }));

// ─── Admin Analytics ──────────────────────────────────────────────────────
export interface AdminAnalytics {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalEvents: number;
  bookingsPerMonth: { month: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
  revenuePerMonth: { month: string; revenue: number }[];
  topEvents: { title: string; bookings: number; revenue: number }[];
  userGrowth: { month: string; count: number }[];
}

export const fetchAdminAnalytics = (): Promise<AdminAnalytics> =>
  fetchAPI("/api/admin/analytics").catch(() => ({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalEvents: 0,
    bookingsPerMonth: [],
    categoryBreakdown: [],
    revenuePerMonth: [],
    topEvents: [],
    userGrowth: [],
  }));


// ─── Admin Users ──────────────────────────────────────────────────────────
export interface AdminUser {
  id: string;
  name?: string;
  mobileNumber?: string;
  city?: string;
  role?: string;
  isTestTaken?: boolean;
  createdAt?: string;
  bookingCount?: number;
  latestTestResult?: {
    id: string;
    test_name: string;
    main_result: string;
    scores?: any;
    completed_at?: string;
  } | null;
}

export const fetchAllUsers = (params?: {
  city?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: AdminUser[]; total: number }> => {
  const q = params
    ? Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&")
    : "";
  return fetchAPI(`/api/admin/users${q ? "?" + q : ""}`);
};

export const updateAdminUserRole = (
  userId: string,
  role: "user" | "admin",
): Promise<AdminUser> =>
  fetchAPI(`/api/admin/users/${userId}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });

export const fetchMyTestResults = (): Promise<{ data: any[] }> =>
  fetchAPI("/api/test-results/my").catch(() => ({ data: [] }));

export const saveTestResult = (data: {
  test_name: string;
  main_result: string;
  scores: any;
}) =>
  fetchAPI("/api/test-results", {
    method: "POST",
    body: JSON.stringify(data),
  });

export interface PlusOneCandidate {
  id: string;
  name?: string;
  mobileNumber?: string;
  city?: string;
  completionPercentage?: number;
}

export const fetchPlusOneCandidates = (eventId?: string): Promise<{ users: PlusOneCandidate[] }> =>
  fetchAPI(`/api/bookings/plus-one-candidates${eventId ? `?eventId=${encodeURIComponent(eventId)}` : ""}`);

// ─── User public profile (admin only) ─────────────────────────────────────
export const fetchUserPublicProfile = (
  userId: string,
): Promise<UserPublicProfile> => fetchAPI(`/api/admin/users/${userId}/profile`);

// ─── Subscriptions ────────────────────────────────────────────────────────
export const fetchSubscription = () => fetchAPI("/api/subscriptions/me");
export const subscribe = (plan: string) =>
  fetchAPI("/api/subscriptions", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });

// ─── Matching ─────────────────────────────────────────────────────────────
export const matchingAPI = {
  run: (userId: string, criteria?: object) =>
    fetchAPI("/api/matching/run", {
      method: "POST",
      body: JSON.stringify({ userId, criteria }),
    }),
  getDetails: (matchId: string) => fetchAPI(`/api/matching/${matchId}`),
};

// ─── Generic CRUD ────────────────────────────────────────────────────────
export const api = {
  get: (e: string) => fetchAPI(e),
  post: (e: string, d: any) =>
    fetchAPI(e, { method: "POST", body: JSON.stringify(d) }),
  put: (e: string, d: any) =>
    fetchAPI(e, { method: "PUT", body: JSON.stringify(d) }),
  patch: (e: string, d: any) =>
    fetchAPI(e, { method: "PATCH", body: JSON.stringify(d) }),
  delete: (e: string) => fetchAPI(e, { method: "DELETE" }),
};

export default api;

// eventsAPI - wrapper for event operations
export const eventsAPI = {
  get: (id: string) => fetchEventById(id),
  update: (id: string, data: any) => updateAdminEvent(id, data),
  updateLocationAndNotify: async (eventId: string, location: string, city: string) => {
    const updated = await updateAdminEvent(eventId, { location, city } as any);
    // notify logic if needed
    return updated;
  },
};
