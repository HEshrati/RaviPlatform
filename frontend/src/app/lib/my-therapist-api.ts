// src/app/lib/my-therapist-api.ts
// API client for "دوست روانشناس من"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getToken(): string | null {
  if (typeof window !== "undefined") return localStorage.getItem("token");
  return null;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "خطای ارتباط با سرور" }));
    throw new Error(err.message || "خطای ارتباط");
  }
  return res.json();
}

export type ConcernTopic =
  | "anxiety"
  | "depression"
  | "relationships"
  | "self_growth"
  | "trauma"
  | "loneliness"
  | "family"
  | "career"
  | "addiction"
  | "other";

export type SessionMode = "online" | "in_person";

export interface IntakeResponse {
  concernTopics: ConcernTopic[];
  customConcern?: string;
  preferredMode: SessionMode;
  preferredTimes: string[];
  city?: string;
  scaleAnswers: Record<string, number>;
  budget?: number;
  genderPreference?: "male" | "female" | "any";
  notes?: string;
}

export interface TherapistProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  credentials: string[];
  specialties: string[];
  bio: string;
  yearsOfExperience: number;
  pricePerSession: number;
  modes: SessionMode[];
  rating: number;
  reviewsCount: number;
  city?: string;
  verified: boolean;
  matchScore?: number;
  availableSlots?: { date: string; time: string }[];
}

export interface SupportGroup {
  id: string;
  name: string;
  topic: string;
  description: string;
  facilitatorName: string;
  facilitatorId: string;
  schedule: string;
  mode: SessionMode;
  city?: string;
  capacity: number;
  membersCount: number;
  pricePerMonth: number;
  confidentialityLevel: "high" | "medium" | "standard";
  rules: string[];
  matchScore?: number;
  imageUrl?: string;
}

export interface BookingPayload {
  therapistId?: string;
  groupId?: string;
  slotDate?: string;
  slotTime?: string;
  mode: SessionMode;
}

export const myTherapistAPI = {
  submitIntake: (data: IntakeResponse) =>
    fetchAPI("/api/my-therapist/intake", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyIntake: (): Promise<IntakeResponse | null> =>
    fetchAPI("/api/my-therapist/intake/me").catch(() => null),

  getTherapists: (): Promise<TherapistProfile[]> =>
    fetchAPI("/api/my-therapist/therapists").catch(() => []),

  getTherapist: (id: string): Promise<TherapistProfile | null> =>
    fetchAPI(`/api/my-therapist/therapists/${id}`).catch(() => null),

  getGroups: (): Promise<SupportGroup[]> =>
    fetchAPI("/api/my-therapist/groups").catch(() => []),

  getGroup: (id: string): Promise<SupportGroup | null> =>
    fetchAPI(`/api/my-therapist/groups/${id}`).catch(() => null),

  bookSession: (data: BookingPayload) =>
    fetchAPI("/api/my-therapist/book", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  joinGroup: (groupId: string) =>
    fetchAPI(`/api/my-therapist/groups/${groupId}/join`, { method: "POST" }),
};

export default myTherapistAPI;
