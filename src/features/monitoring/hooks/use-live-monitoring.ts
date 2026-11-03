"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createMonitoringStream,
  getMonitoringOverview,
} from "@/features/monitoring/api";
import { queryKeys } from "@/lib/query/keys";
import type {
  MonitoringHistoryPoint,
  MonitoringSnapshot,
} from "@/features/monitoring/types";

const HISTORY_LIMIT = 30;

function toHistoryPoint(snapshot: MonitoringSnapshot): MonitoringHistoryPoint {
  return {
    time: new Date(snapshot.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    cpu: snapshot.process.cpuPercent,
    heap: snapshot.process.memory.heapUsedMb,
    rss: snapshot.process.memory.rssMb,
    rps: snapshot.traffic.requestsPerSecond,
    dbLatency: snapshot.database.latencyMs,
  };
}

export function useLiveMonitoring(enabled: boolean) {
  const [snapshot, setSnapshot] = useState<MonitoringSnapshot | null>(null);
  const [history, setHistory] = useState<MonitoringHistoryPoint[]>([]);
  const [streamState, setStreamState] = useState<
    "connecting" | "live" | "polling" | "error"
  >("connecting");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const historyRef = useRef<MonitoringHistoryPoint[]>([]);

  const bootstrapQuery = useQuery({
    queryKey: queryKeys.monitoring.overview,
    queryFn: async () => {
      const response = await getMonitoringOverview();
      return response.data ?? null;
    },
    enabled,
    refetchInterval: streamState === "polling" || streamState === "error" ? 3000 : false,
    retry: 1,
  });

  useEffect(() => {
    if (!bootstrapQuery.data) return;

    setSnapshot(bootstrapQuery.data);
    setLastUpdatedAt(bootstrapQuery.data.timestamp);

    const point = toHistoryPoint(bootstrapQuery.data);
    historyRef.current = [...historyRef.current, point].slice(-HISTORY_LIMIT);
    setHistory(historyRef.current);
  }, [bootstrapQuery.data]);

  useEffect(() => {
    if (!enabled) return;

    setStreamState("connecting");

    const disconnect = createMonitoringStream(
      (next) => {
        setSnapshot(next);
        setLastUpdatedAt(next.timestamp);
        setStreamState("live");

        const point = toHistoryPoint(next);
        historyRef.current = [...historyRef.current, point].slice(-HISTORY_LIMIT);
        setHistory([...historyRef.current]);
      },
      () => {
        setStreamState((prev) => (prev === "live" ? "polling" : "error"));
      },
    );

    const fallbackTimer = window.setTimeout(() => {
      setStreamState((prev) => (prev === "connecting" ? "polling" : prev));
    }, 4000);

    return () => {
      window.clearTimeout(fallbackTimer);
      disconnect();
    };
  }, [enabled]);

  return {
    snapshot,
    history,
    streamState,
    lastUpdatedAt,
    isLoading: !snapshot && bootstrapQuery.isLoading,
    isError: !snapshot && bootstrapQuery.isError,
    error: bootstrapQuery.error,
  };
}
