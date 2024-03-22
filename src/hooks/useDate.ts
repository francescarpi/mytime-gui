import { useState, useEffect } from "react";

const useDate = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [humanDate, setHumanDate] = useState<String>("");

  useEffect(() => {
    setDate(new Date());
    setHumanDate(
      new Intl.DateTimeFormat("fr-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
    );
  }, []);

  return { date, setDate, humanDate };
};

export default useDate;
