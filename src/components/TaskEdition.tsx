import { useState, useEffect, useMemo } from "react";
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
import { useSnackbar } from "notistack";

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
    if (task?.end) setEnd(dayjs(task.end));

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
    console.log("Form valid: ", e.target.checkValidity());
    console.log("Start is valid: ", startIsValid);
    console.log("End is valid: ", endIsValid);

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
              <Grid item md={2}>
                <TextField
                  label="Project"
                  size="small"
                  fullWidth
                  required
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  helperText={!project && "Project is required"}
                  error={errorsEnabled && !project}
                  inputProps={{
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoCapitalize: "off",
                    spellCheck: "false",
                    maxLength: 100,
                  }}
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
                  helperText={!description && "Description is required"}
                  error={errorsEnabled && !description}
                  inputProps={{
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoCapitalize: "off",
                    spellCheck: "false",
                    maxLength: 200,
                  }}
                />
              </Grid>
              <Grid item md={2}>
                <TextField
                  label="External Id"
                  size="small"
                  fullWidth
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  inputProps={{
                    autoComplete: "off",
                    autoCorrect: "off",
                    autoCapitalize: "off",
                    spellCheck: "false",
                    maxLength: 50,
                  }}
                />
              </Grid>
              <Grid item md={2}>
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
                <Grid item md={2}>
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
