import { useEffect } from "react";

const useKeyboard = () => {
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if ((e.target as HTMLInputElement).tagName.toLowerCase() === "input") {
        return;
      }
      if (e.altKey) {
        console.log("Alt key");
      } else {
        switch (e.code) {
          case "ArrowLeft":
            console.log("Left");
            break;
          case "ArrowRight":
            console.log("Right");
            break;
          case "ArrowDown":
            console.log("Down");
            break;
        }
      }
    });
  }, []);

  return {};
};

export default useKeyboard;
