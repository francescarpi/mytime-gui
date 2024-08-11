import { createContext } from "react";

const LoadingContext = createContext<{
  text: string;
  visible: boolean;
}>({
  text: "Loading...",
  visible: false,
});

export default LoadingContext;
