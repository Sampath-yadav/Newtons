"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface Exam {
  id: number;
  name: string;
  class: string;
  section: string;
  status: string;
  rejectNote: string | null;
  publishedAt: string | null;
  createdAt: string;
  uploadedBy: { name: string; email: string };
  _count: { marks: number };
  studentCount: number;
}

export function useAdminExamPolling() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [newSubmissions, setNewSubmissions] = useState<Exam[]>([]);
  const knownIds = useRef<Set<number>>(new Set());
  const isFirstLoad = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const fetchExams = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/exams");
      if (!res.ok) return;
      const fresh: Exam[] = await res.json();

      if (!isFirstLoad.current) {
        const brandNew = fresh.filter(
          (e) => e.status === "pending_approval" && !knownIds.current.has(e.id)
        );
        if (brandNew.length > 0) {
          setNewSubmissions((prev) => [...prev, ...brandNew]);
        }
      } else {
        isFirstLoad.current = false;
      }

      fresh.forEach((e) => knownIds.current.add(e.id));
      setExams(fresh);
    } catch {
      // silently ignore network errors
    }
  }, []);

  useEffect(() => {
    fetchExams();
    intervalRef.current = setInterval(fetchExams, 30_000);

    function handleVisibility() {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        fetchExams();
        intervalRef.current = setInterval(fetchExams, 30_000);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchExams]);

  function clearNewSubmissions() {
    setNewSubmissions([]);
  }

  return { exams, newSubmissions, clearNewSubmissions, refetch: fetchExams };
}
