import { useState, useRef } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

const AddTaskForm = ({
  sx,
  onSubmit,
}: {
  sx?: SxProps<Theme>;
  onSubmit: CallableFunction;
}) => {
  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  const [externalId, setExternalId] = useState("");
  const submitRef = useRef<HTMLButtonElement>(null);

  const reset = () => {
    setProject("");
    setDescription("");
    setExternalId("");
  };

  const submit = (e: any) => {
    e.preventDefault();
    onSubmit(project, description, externalId);
    reset();
    submitRef.current?.focus();
  };

  return (
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
            />
          </Grid>
          <Grid item md={6}>
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
  );
};

export default AddTaskForm;
