import Typography from "@mui/material/Typography";
import { dateToStrDate, dayOfTheWeek } from "../utils/dates";

const TitleDate = ({ date }: { date: Date }) => {
  return (
    <Typography variant="h6" sx={{ flexGrow: 1 }}>
      {dateToStrDate(date)} ({dayOfTheWeek(date)})
    </Typography>
  );
};

export default TitleDate;
