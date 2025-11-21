import { IconButton, Box, Badge } from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { SxProps, Theme, styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import useCalendar from "../hooks/useCalendar";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    top: 10,
    right: 10,
    backgroundColor: theme.palette.secondary.main,
    minWidth: 5,
    height: 5,
  },
}));

const DateSelector = ({
  setPrevious,
  setNext,
  sx,
  date,
  onChange,
}: {
  setPrevious: CallableFunction;
  setNext: CallableFunction;
  sx?: SxProps<Theme>;
  date: Dayjs;
  onChange: CallableFunction;
}) => {
  const { datesWidthTasks, setMonth } = useCalendar();

  const dayComponent = (
    props: PickersDayProps & { dates?: string[] },
  ) => {
    return (
      <StyledBadge
        key={props.day.toString()}
        overlap="circular"
        variant="dot"
        invisible={!props.dates?.includes(props.day.format("YYYY-MM-DD"))}
      >
        <PickersDay {...props} />
      </StyledBadge>
    );
  };

  return (
    <Box sx={sx}>
      <IconButton onClick={() => setPrevious()} sx={{ mr: 1 }}>
        <ArrowLeftIcon />
      </IconButton>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          sx={{ width: 150 }}
          value={dayjs(date)}
          format="YYYY-MM-DD"
          disableFuture
          onChange={(value) => onChange(value)}
          label={date.format("dddd")}
          slotProps={{
            textField: { size: "small" },
            day: {
              dates: datesWidthTasks,
            } as any,
          }}
          slots={{
            day: dayComponent,
          }}
          onOpen={() => setMonth([date.month() + 1, date.year()])}
          onMonthChange={(month) => setMonth([month.month() + 1, month.year()])}
        />
      </LocalizationProvider>
      <IconButton onClick={() => setNext()} sx={{ mx: 1 }}>
        <ArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default DateSelector;
