import { useState, useRef, useEffect } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import { invoke } from "@tauri-apps/api/core";
import { Task } from "../hooks/useTasks";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";

const AddTaskForm = ({
  sx,
  onSubmit,
  defaultAddTaskValues,
  dispatchDefaultAddTaskValues,
}: {
  sx?: SxProps<Theme>;
  onSubmit: CallableFunction;
  defaultAddTaskValues: {
    proj: string;
    desc: string;
  };
  dispatchDefaultAddTaskValues: CallableFunction;
}) => {
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const submitRef = useRef<HTMLButtonElement>(null);
  const confirm = useConfirm();

  const reset = () => {
    setProject("");
    setDescription("");
    dispatchDefaultAddTaskValues({ type: "reset" });
  };

  const submit = (e: any) => {
    e.preventDefault();
    onSubmit(project, description);
    reset();
    submitRef.current?.focus();
  };

  useEffect(() => {
    if (defaultAddTaskValues.proj !== "") {
      setProject(defaultAddTaskValues.proj);
    }
    if (defaultAddTaskValues.desc !== "") {
      setDescription(defaultAddTaskValues.desc);
    }
  }, [defaultAddTaskValues]);

  useEffect(() => {
    invoke("last_task").then((resp) => {
      let task = resp as Task | null;
      if (task && dayjs(task.start).isBefore(dayjs(), "date")) {
        confirm({
          description: `Do you want to continue with the previous task: "${task.desc}"?`,
        }).then(() => onSubmit(task.project, task.desc, task.external_id));
      }
    });
  }, []);

  return (
    <>
      <Box sx={{ ...sx, flexgrow: 1 }}>
        <form onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item md={2}>
              <TextField
                label="Project"
                size="small"
                fullWidth
                required
                value={project}
                onChange={(e) => setProject(e.target.value)}
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
                inputProps={{
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: "false",
                  maxLength: 200,
                }}
              />
            </Grid>
            <Grid item md={1}>
              <Button onClick={reset}>Reset</Button>
            </Grid>
            <Grid item md={1}>
              <Button variant="contained" type="submit" ref={submitRef}>
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
};

export default AddTaskForm;
