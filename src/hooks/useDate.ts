import { useState, useCallback } from "react";

const useDate = () => {
  const [date, setDate] = useState<Date>(new Date());

  const setPreviousDate = useCallback(() => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  }, [date]);

  const setNextDate = useCallback(() => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate < new Date()) {
      setDate(newDate);
    }
  }, [date]);

  return { date, setDate, setPreviousDate, setNextDate };
};

export default useDate;
