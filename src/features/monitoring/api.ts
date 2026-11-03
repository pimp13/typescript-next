import { apiFetch } from "@/lib/api";
import type { MonitoringSnapshot } from "@/features/monitoring/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function getMonitoringOverview() {
  return apiFetch<MonitoringSnapshot>("/api/monitoring/overview", {
    method: "GET",
  });
}

export function createMonitoringStream(
  onMessage: (snapshot: MonitoringSnapshot) => void,
  onError?: (error: Event) => void,
) {
  const source = new EventSource(`${API_URL}/api/monitoring/stream`, {
    withCredentials: true,
  });

  const handleMonitoring = (event: MessageEvent<string>) => {
    try {
      const snapshot = JSON.parse(event.data) as MonitoringSnapshot;
      onMessage(snapshot);
    } catch {
      // ignore malformed payloads
    }
  };

  source.addEventListener("monitoring", handleMonitoring as EventListener);
  source.onerror = (event) => {
    onError?.(event);
  };

  return () => {
    source.removeEventListener(
      "monitoring",
      handleMonitoring as EventListener,
    );
    source.close();
  };
}
