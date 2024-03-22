import Typography from "@mui/material/Typography";
import { dateToStrDate, dayOfTheWeek } from "../utils/dates";
import { SxProps, Theme } from "@mui/material/styles";

const TitleDate = ({ date, sx }: { date: Date; sx?: SxProps<Theme> }) => {
  return (
    <Typography variant="h6" sx={sx}>
      {dateToStrDate(date)} ({dayOfTheWeek(date)})
    </Typography>
  );
};

export default TitleDate;
