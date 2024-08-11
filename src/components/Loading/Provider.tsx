import { ReactNode, useState } from "react";
import { Typography, CircularProgress, Backdrop } from "@mui/material";

import LoadingContext from "./Context";

const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [text, setText] = useState<string>("Loading...");
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<string>("0%");

  return (
    <LoadingContext.Provider
      value={{
        text,
        setText,
        visible,
        setVisible,
        progress,
        setProgress,
      }}
    >
      <Backdrop
        open={visible}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h4">{text}</Typography>
        <Typography variant="h6">{progress}</Typography>
      </Backdrop>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;
