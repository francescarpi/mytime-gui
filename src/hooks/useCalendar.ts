import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const useCalendar = () => {
  const [datesWidthTasks, setDatesWidthTasks] = useState<string[]>([]);
  const [month, setMonth] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (month) {
      const [m, y] = month;
      invoke("dates_with_tasks", { month: m, year: y }).then((res: unknown) => {
        const dates = (res as { date: string }[]).map((d) => d.date);
        setDatesWidthTasks(dates);
      });
    }
  }, [month]);

  return { datesWidthTasks, setMonth };
};

export default useCalendar;
