"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface TeacherAlert {
  id: number;
  examId: number;
  type: "approved" | "rejected";
  message: string;
  isRead: boolean;
  createdAt: string;
  exam: { name: string; class: string; section: string };
}

export function useTeacherAlerts() {
  const [alerts, setAlerts] = useState<TeacherAlert[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch("/api/teacher/alerts");
      if (res.ok) setAlerts(await res.json());
    } catch {
      // silently ignore network errors — next poll will retry
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    intervalRef.current = setInterval(fetchAlerts, 30_000);

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        fetchAlerts();
        intervalRef.current = setInterval(fetchAlerts, 30_000);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchAlerts]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const markRead = useCallback(async (alertId: number) => {
    await fetch(`/api/teacher/alerts/${alertId}/read`, { method: "PATCH" });
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)));
  }, []);

  const markAllRead = useCallback(async () => {
    await fetch("/api/teacher/alerts/read-all", { method: "PATCH" });
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }, []);

  return { alerts, unreadCount, markRead, markAllRead, refetch: fetchAlerts };
}
