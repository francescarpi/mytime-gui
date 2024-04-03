import { useState, useEffect } from "react";

const useCalendar = () => {
  const [datesWidthTasks, setDatesWidthTasks] = useState<string[]>([]);
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    if (month) {
      console.log("load dates with tasks for month: ", month);
    }
  }, [month]);

  return { datesWidthTasks, setMonth };
};

export default useCalendar;
