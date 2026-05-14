import EventsClient from "@/components/EventsClient";
import type { ApiEvent } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function getEvents(): Promise<ApiEvent[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  return <EventsClient initialEvents={events} />;
}
