import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import Badge from "@mui/material/Badge";
import useCalendar from "../hooks/useCalendar";

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
    props: PickersDayProps<Dayjs> & { dates?: string[] },
  ) => {
    return (
      <Badge
        key={props.day.toString()}
        overlap="circular"
        variant="dot"
        color="secondary"
        invisible={!props.dates?.includes(props.day.format("YYYY-MM-DD"))}
      >
        <PickersDay {...props} />
      </Badge>
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
          onOpen={() => setMonth(date.month() + 1)}
          onMonthChange={(month) => setMonth(month.month() + 1)}
        />
      </LocalizationProvider>
      <IconButton onClick={() => setNext()} sx={{ mx: 1 }}>
        <ArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default DateSelector;
