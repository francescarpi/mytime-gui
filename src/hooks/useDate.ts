import { useState, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";

const useDate = () => {
  const [date, setDate] = useState<Dayjs>(dayjs());

  const setPreviousDate = useCallback(() => {
    setDate(date.clone().subtract(1, "day"));
  }, [date]);

  const setNextDate = useCallback(() => {
    const newDate = date.clone().add(1, "day");
    if (newDate.isBefore(dayjs())) {
      setDate(newDate);
    }
  }, [date]);

  return { date, setDate, setPreviousDate, setNextDate };
};

export default useDate;
