import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

const StyledBox = styled(Box)(({ theme, width }: any) => ({
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: width || 700,
  backgroundColor: theme.palette.background.paper,
  borderSize: 2,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  boxShadow: theme.shadows[24],
  padding: 20,
}));

export { StyledBox };
