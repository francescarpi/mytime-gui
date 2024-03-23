import { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { StyledBox } from "../styles/modal";
import { Task } from "../hooks/useTasks";
import Typography from "@mui/material/Typography";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";

const TaskEdition = ({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: CallableFunction;
}) => {
  const [project, setProject] = useState<String>("");
  const [description, setDescription] = useState<String>("");
  const [externalId, setExternalId] = useState<String>("");
  const [start, setStart] = useState<Dayjs>(dayjs());
  const [end, setEnd] = useState<Dayjs | null>(null);

  useEffect(() => {
    setProject(task?.project || "");
    setDescription(task?.desc || "");
    setExternalId(task?.external_id || "");
    if (task?.start) setStart(dayjs(task.start as string));
    if (task?.end) setEnd(dayjs(task.end as string));
  }, [task]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal open={Boolean(task)} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <form onSubmit={submit}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Task Edition
            </Typography>
            <Grid container spacing={2}>
              <Grid item md={2}>
                <TextField
                  label="Project"
                  size="small"
                  fullWidth
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              </Grid>
              <Grid item md={8}>
                <TextField
                  label="Description"
                  size="small"
                  fullWidth
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item md={2}>
                <TextField
                  label="External Id"
                  size="small"
                  fullWidth
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                />
              </Grid>
              <Grid item md={2}>
                <TimePicker
                  label="Start"
                  format="HH:mm"
                  value={start}
                  ampm={false}
                  slotProps={{ textField: { required: true } }}
                />
              </Grid>
              {task?.end && (
                <Grid item md={2}>
                  <TimePicker
                    label="End"
                    format="HH:mm"
                    value={end}
                    ampm={false}
                    slotProps={{ textField: { required: true } }}
                  />
                </Grid>
              )}
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={() => onClose()}
                color="secondary"
              >
                Close
              </Button>
              <Button variant="contained" sx={{ ml: 2 }} type="submit">
                Save
              </Button>
            </Box>
          </LocalizationProvider>
        </form>
      </StyledBox>
    </Modal>
  );
};
export default TaskEdition;
