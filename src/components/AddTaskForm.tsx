import { useState, useRef, useEffect } from "react";
import { SxProps, Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import SearchExternalId from "./SearchExternalId";

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

  return (
    <>
      <SearchExternalId
        open={showSearchExtId}
        onClose={() => setShowSearchExtId(false)}
        setExternalId={setExternalId}
      />
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
                }}
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
                inputProps={{
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: "false",
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowSearchExtId(true)}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: "false",
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
