import * as React from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { formatDuration } from "../../utils/dates";
import { SyncTask } from "../../hooks/useSync";
import { Integration } from "../../hooks/useSettings";
import TaskIcon from "./TaskIcon";
import InputCustom from "../atoms/InputCustom";
import { TaskData } from "./taskDataReducer";
import { integrationsConfig } from "../../integrations/config";
import RenderFields from "../../integrations/components/RenderFields";

const TaskRow = ({
  task,
  activeIntegrations,
  taskData,
  dispatchTaskData,
}: {
  task: SyncTask;
  activeIntegrations: Integration[];
  taskData: TaskData;
  dispatchTaskData: CallableFunction;
}) => {
  const renderFields = (integration: Integration) => {
    const fields = integrationsConfig[integration.itype].syncFields;
    const apiParams = { integrationId: integration.id };
    return (
      <RenderFields
        fields={fields}
        values={{}}
        selectApiParams={apiParams}
        onChange={(
          field: string,
          e: React.ChangeEvent<HTMLInputElement> | string,
        ) => {}}
      />
    );
  };

  return (
    <React.Fragment key={task.id}>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left">
          [{task.project}] {task.desc}
        </TableCell>
        <TableCell align="left">{task.date}</TableCell>
        <TableCell align="right">{formatDuration(task.duration)}</TableCell>
        <TableCell align="right">{task.ids.join(", ")}</TableCell>
      </TableRow>
      <TableRow sx={{ paddingY: 0 }}>
        <TableCell colSpan={4}>
          <Grid container spacing={2}>
            {activeIntegrations.map((int) => (
              <Grid
                item
                md={activeIntegrations.length === 1 ? 12 : 6}
                key={`int_${int.id}`}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{int.name || int.itype}</Typography>
                      {taskData[task.id] &&
                        taskData[task.id][int.id as number] && (
                          <TaskIcon
                            status={taskData[task.id][int.id as number].status}
                            message={
                              taskData[task.id][int.id as number].errorMessage
                            }
                          />
                        )}
                    </Box>
                    <Box sx={{ mt: "1rem" }}>
                      {taskData[task.id] &&
                        taskData[task.id][int.id as number] && (
                          <Grid container spacing={1}>
                            <Grid item md={12}>
                              <InputCustom
                                label="External Id"
                                showSearch={true}
                                maxLength={50}
                                isLoading={
                                  taskData[task.id][int.id as number]
                                    .loadingExternalId
                                }
                                value={
                                  taskData[task.id][int.id as number].externalId
                                }
                                onChange={(e) =>
                                  dispatchTaskData({
                                    type: "setExternalId",
                                    id: task.id,
                                    integrationId: int.id,
                                    externalId: e.target.value,
                                  })
                                }
                                error={
                                  !taskData[task.id]?.[int.id as number]
                                    ?.externalId
                                }
                                disabled={
                                  taskData[task.id][int.id as number].status ===
                                  "Sending"
                                }
                              />
                            </Grid>
                            {renderFields(int)}
                          </Grid>
                        )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TaskRow;
