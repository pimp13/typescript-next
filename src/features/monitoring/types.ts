export type MonitoringSnapshot = {
  timestamp: string;
  status: "healthy" | "degraded";
  process: {
    pid: number;
    nodeVersion: string;
    platform: string;
    arch: string;
    uptimeSeconds: number;
    cpuPercent: number;
    memory: {
      rssMb: number;
      heapUsedMb: number;
      heapTotalMb: number;
      externalMb: number;
    };
  };
  host: {
    hostname: string;
    uptimeSeconds: number;
    loadAverage: number[];
    cpuCount: number;
    memory: {
      totalMb: number;
      usedMb: number;
      freeMb: number;
      usedPercent: number;
    };
  };
  database: {
    status: "up" | "down";
    latencyMs: number;
  };
  traffic: {
    windowSeconds: number;
    requestsInWindow: number;
    requestsPerSecond: number;
    avgLatencyMs: number;
    errorRate: number;
    statusBuckets: {
      "2xx": number;
      "3xx": number;
      "4xx": number;
      "5xx": number;
    };
    topRoutes: Array<{ route: string; count: number }>;
    processStartedAt: string;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: Array<{ role: string; count: number }>;
    recentLogins: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      lastLogin: string | null;
    }>;
  };
};

export type MonitoringHistoryPoint = {
  time: string;
  cpu: number;
  heap: number;
  rss: number;
  rps: number;
  dbLatency: number;
};
