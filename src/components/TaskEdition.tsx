import { useState, useEffect, useMemo } from "react";

import { Modal, Typography, Button, Box } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Grid from "@mui/material/Grid2";
import dayjs, { Dayjs } from "dayjs";
import { useSnackbar } from "notistack";

import { StyledBox } from "../styles/modal";
import { Task } from "../hooks/useTasks";
import MyInputField from "./atoms/MyInputField";

const TaskEdition = ({
  task,
  onClose,
  onEdit,
}: {
  task: Task | null;
  onClose: CallableFunction;
  onEdit: CallableFunction;
}) => {
  const [project, setProject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [externalId, setExternalId] = useState<string>("");
  const [start, setStart] = useState<Dayjs>(dayjs());
  const [end, setEnd] = useState<Dayjs | null>(null);
  const [errorsEnabled, setErrorsEnabled] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setProject(task?.project || "");
    setDescription(task?.desc || "");
    setExternalId(task?.external_id || "");

    if (task?.start) setStart(dayjs(task.start));
    if (task?.end) {
      setEnd(dayjs(task.end));
    } else {
      setEnd(null);
    }

    // Hack to avoid show the fields with error while the popup is openning.
    if (task) {
      setTimeout(() => {
        setErrorsEnabled(true);
      }, 500);
    } else {
      setErrorsEnabled(false);
    }
  }, [task]);

  const submit = (e: any) => {
    e.preventDefault();
    if (
      !e.target.checkValidity() ||
      !startIsValid ||
      (task?.end && !endIsValid)
    ) {
      return;
    }

    const payload: any = {
      ...(task as Task),
      project,
      desc: description,
      externalId,
      start: start.format("HH:mm"),
      end: end ? end.format("HH:mm") : null,
    };

    onEdit(payload);
    enqueueSnackbar("Task edited", { variant: "success" });
    onClose();
  };

  const startIsValid = useMemo(
    () => !end || (start && end && start.isBefore(end)),
    [start, end],
  );

  const endIsValid = useMemo(
    () => end && start && end.isAfter(start),
    [start, end],
  );

  return (
    <Modal open={Boolean(task)} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <Box component="form" onSubmit={submit} noValidate>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Task Edition
            </Typography>
            <Grid container spacing={2}>
              <Grid size={2}>
                <MyInputField
                  label="Project"
                  size="medium"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  maxLength={100}
                  helperText={!project && "Project is required"}
                  error={errorsEnabled && !project}
                />
              </Grid>
              <Grid size={8}>
                <MyInputField
                  label="Description"
                  size="medium"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  helperText={!description && "Description is required"}
                  error={errorsEnabled && !description}
                />
              </Grid>
              <Grid size={2}>
                <MyInputField
                  label="External Id"
                  size="medium"
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  maxLength={50}
                />
              </Grid>
              <Grid size={2}>
                <TimePicker
                  label="Start"
                  format="HH:mm"
                  value={start}
                  onChange={(date) => setStart(date as Dayjs)}
                  ampm={false}
                  slotProps={{
                    textField: {
                      required: true,
                      error: errorsEnabled && !startIsValid,
                      helperText:
                        !startIsValid && "Start time must be before end time",
                    },
                  }}
                />
              </Grid>
              {task?.end && (
                <Grid size={2}>
                  <TimePicker
                    label="End"
                    format="HH:mm"
                    value={end}
                    onChange={(date) => setEnd(date as Dayjs)}
                    ampm={false}
                    slotProps={{
                      textField: {
                        required: true,
                        error: errorsEnabled && !endIsValid,
                        helperText:
                          !endIsValid && "End time must be after start time",
                      },
                    }}
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
        </Box>
      </StyledBox>
    </Modal>
  );
};
export default TaskEdition;
