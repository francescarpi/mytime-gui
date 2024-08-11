import { useCallback, useState } from "react";

const useLoading = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useState<string>("Loading...");
  const [progress, setProgress] = useState<string>("");

  const showLoading = useCallback((text: string) => {
    setVisible(true);
    setText(text);
  }, []);

  const hideLoading = useCallback(() => {
    setVisible(false);
  }, []);

  return { showLoading, hideLoading, visible, text, setProgress, progress };
};

export default useLoading;
