import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const DateSelector = ({
  setPrevious,
  setNext,
}: {
  setPrevious: CallableFunction;
  setNext: CallableFunction;
}) => {
  return (
    <div>
      <IconButton onClick={() => setPrevious()}>
        <ArrowLeftIcon />
      </IconButton>
      <IconButton>
        <CalendarMonthIcon />
      </IconButton>
      <IconButton onClick={() => setNext()}>
        <ArrowRightIcon />
      </IconButton>
    </div>
  );
};

export default DateSelector;
