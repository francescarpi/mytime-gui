import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

const DateSelector = ({
  setPrevious,
  setNext,
  sx,
}: {
  setPrevious: CallableFunction;
  setNext: CallableFunction;
  sx?: SxProps<Theme>;
}) => {
  return (
    <Box sx={sx}>
      <IconButton onClick={() => setPrevious()}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton>
        <CalendarMonthIcon />
      </IconButton>
      <IconButton onClick={() => setNext()}>
        <ArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default DateSelector;
