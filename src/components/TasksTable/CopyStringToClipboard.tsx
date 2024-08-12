import { ReactNode } from "react";

import { Box } from "@mui/material";
import { useSnackbar } from "notistack";

const CopyStringToClipboard = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: CallableFunction;
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const callOnClick = () => {
    enqueueSnackbar(`"${children}" copied to the clipboard`, {
      variant: "success",
      autoHideDuration: 1000,
    });
    onClick(children);
  };
  return <Box onClick={callOnClick}>{children}</Box>;
};

export default CopyStringToClipboard;
