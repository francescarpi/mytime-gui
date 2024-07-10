import { useContext } from "react";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TaskIcon from "./TaskIcon";
import Alert from "@mui/material/Alert";
import { formatDuration } from "../../utils/dates";
import { StyledBox } from "../../styles/modal";
import { SyncProps } from "./types";
import { SettingsContext } from "../../providers/SettingsProvider";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

const Sync = (props: SyncProps) => {
  const {
    opened,
    onClose,
    tasks,
    integrationName,
    success,
    isSending,
    sendHandler,
    tasksSent,
    slotHeader,
  } = props;

  if (!opened) {
    return null;
  }

  const settingContext = useContext(SettingsContext);
  const { activeIntegrations } = settingContext;

  return (
    <Modal open={opened} onClose={() => onClose()}>
      <StyledBox width={1000}>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Send tasks to {integrationName}
        </Typography>
        <Box>
          {slotHeader}
          {tasks.length === 0 && (
            <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
              No tasks to send. Only finished tasks with an external ID can be
              reported.
            </Alert>
          )}
          <TableContainer sx={{ maxHeight: 350 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left">Date</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right" sx={{ textWrap: "nowrap" }}>
                    Task Ids
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                      <TableCell align="left">{task.desc}</TableCell>
                      <TableCell align="left">{task.date}</TableCell>
                      <TableCell align="right">
                        {formatDuration(task.duration)}
                      </TableCell>
                      <TableCell align="right">{task.ids.join(", ")}</TableCell>
                    </TableRow>
                    <TableRow sx={{ paddingY: 0 }}>
                      <TableCell colSpan={4}>
                        <Grid container spacing={2}>
                          {activeIntegrations.map((int) => (
                            <Grid item md={6} key={`int_${int.id}`}>
                              <Card>
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography>
                                      {int.name || int.itype}
                                    </Typography>
                                    <TaskIcon task={task} success={success} />
                                  </Box>
                                  <Box sx={{ mt: "1rem" }}>
                                    <TextField
                                      label="External Id"
                                      size="small"
                                      fullWidth
                                      value={""}
                                      onChange={(_e) => {}}
                                      InputProps={{
                                        endAdornment: (
                                          <InputAdornment position="end">
                                            <IconButton
                                              size="small"
                                              onClick={() => {}}
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
                                        maxLength: 50,
                                      }}
                                    />
                                  </Box>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              onClick={() => onClose()}
              color="secondary"
              disabled={isSending}
            >
              Close
            </Button>
            {tasks.length > 0 && (
              <Button
                variant="contained"
                sx={{ ml: 2 }}
                onClick={() => sendHandler()}
                disabled={isSending || tasksSent}
              >
                Send
              </Button>
            )}
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default Sync;
