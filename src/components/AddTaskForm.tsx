import { useState, useRef, useEffect } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { invoke } from "@tauri-apps/api/core";
import { Task } from "../hooks/useTasks";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";
import InputCustom from "./atoms/InputCustom";
import Button from "@mui/material/Button/Button";

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
        }).then(() => onSubmit(task.project, task.desc));
      }
    });
  }, []);

  return (
    <>
      <Box sx={{ ...sx, flexgrow: 1 }}>
        <form onSubmit={submit}>
          <Grid container spacing={2}>
            <Grid item md={2}>
              <InputCustom
                label="Project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </Grid>
            <Grid item md={8}>
              <InputCustom
                label="Description"
                value={description}
                maxLength={200}
                onChange={(e) => setDescription(e.target.value)}
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
