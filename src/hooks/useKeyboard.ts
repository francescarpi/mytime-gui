import { useEffect, useCallback } from "react";

const useKeyboard = (
  setPreviousDate: CallableFunction,
  setNextDate: CallableFunction,
  setToday: CallableFunction,
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.target as HTMLInputElement).tagName.toLowerCase() === "input") {
        return;
      }

      if (e.ctrlKey) {
        switch (e.code) {
          case "KeyF":
            console.log("Search");
            break;
        }
      } else {
        switch (e.code) {
          case "ArrowLeft":
            setPreviousDate();
            break;
          case "ArrowRight":
            setNextDate();
            break;
          case "ArrowDown":
            setToday();
            break;
        }
      }
    },
    [setNextDate, setPreviousDate, setToday],
  );

  useEffect(() => {
    console.log("Register keydown event");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return {};
};

export default useKeyboard;
