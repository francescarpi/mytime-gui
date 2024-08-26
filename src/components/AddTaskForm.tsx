import { useState, useRef, useEffect } from "react";

import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, Grid } from "@mui/material";
import { invoke } from "@tauri-apps/api/core";
import { useConfirm } from "material-ui-confirm";
import dayjs from "dayjs";

import { Task } from "../hooks/useTasks";
import SearchExternalId from "./SearchExternalId";
import MyInputField from "./atoms/MyInputField";

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
    extId: string;
  };
  dispatchDefaultAddTaskValues: CallableFunction;
}) => {
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [externalId, setExternalId] = useState("");
  const [showSearchExtId, setShowSearchExtId] = useState<boolean>(false);
  const submitRef = useRef<HTMLButtonElement>(null);
  const confirm = useConfirm();

  const reset = () => {
    setProject("");
    setDescription("");
    setExternalId("");
    dispatchDefaultAddTaskValues({ type: "reset" });
  };

  const submit = (e: any) => {
    e.preventDefault();
    onSubmit(project, description, externalId);
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
    if (defaultAddTaskValues.extId !== "") {
      setExternalId(defaultAddTaskValues.extId);
    }
  }, [defaultAddTaskValues]);

  useEffect(() => {
    invoke("last_task").then((resp) => {
      let task = resp as Task | null;
      if (
        task &&
        dayjs(task.start).isBefore(dayjs(), "date") &&
        dayjs().diff(dayjs(task.start), "day") < 4
      ) {
        confirm({
          description: `Do you want to continue with the previous task: "${task.desc}"?`,
        }).then(() => onSubmit(task.project, task.desc, task.external_id));
      }
    });
  }, []);

  return (
    <>
      <SearchExternalId
        open={showSearchExtId}
        onClose={() => setShowSearchExtId(false)}
        setExternalId={setExternalId}
      />
      <Box sx={{ ...sx, flexgrow: 1 }}>
        <form onSubmit={submit} data-testid="add-task-form">
          <Grid container spacing={2}>
            <Grid item md={2}>
              <MyInputField
                label="Project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </Grid>
            <Grid item md={5}>
              <MyInputField
                label="Description"
                value={description}
                maxLength={200}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item md={3}>
              <MyInputField
                label="External Id"
                value={externalId}
                maxLength={50}
                onChange={(e) => setExternalId(e.target.value)}
                showSearch={true}
                searchHandler={() => setShowSearchExtId(true)}
                required={false}
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
