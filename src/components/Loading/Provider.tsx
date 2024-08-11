import { ReactNode } from "react";
import { Typography, CircularProgress, Backdrop } from "@mui/material";

import LoadingContext from "./Context";

const LoadingProvider = ({
  children,
  hook,
}: {
  children: ReactNode;
  hook: any;
}) => {
  const { visible, text, progress } = hook;

  return (
    <LoadingContext.Provider
      value={{
        text,
        visible,
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
