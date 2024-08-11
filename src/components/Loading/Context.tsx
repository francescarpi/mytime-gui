import { createContext } from "react";

const LoadingContext = createContext<{
  text: string;
  progress: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  setText: (text: string) => void;
  setProgress: (text: string) => void;
}>({
  text: "Loading...",
  progress: "",
  visible: false,
  setVisible: () => {},
  setText: () => {},
  setProgress: () => {},
});

export default LoadingContext;
