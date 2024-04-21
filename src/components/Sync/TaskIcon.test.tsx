import { render, screen } from "@testing-library/react";
import { SyncTask } from "../../hooks/useSync";
import TaskIcon from "./TaskIcon";

const task: SyncTask = {
  id: "1",
  date: "2021-10-10",
  desc: "Task Description",
  duration: 10,
  external_id: "1",
  ids: [1],
  extra_param: null,
};

describe("TaskIcon", () => {
  test("Task should have the CloudOffIcon", () => {
    render(<TaskIcon task={task} success={{}} />);
    expect(screen.getByTestId("CloudOffIcon")).toBeInTheDocument();
  });

  test("Task should have the CircularProgress", () => {
    render(
      <TaskIcon
        task={task}
        success={{ "1": { sending: true, success: false, error: "" } }}
      />,
    );
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("Task should have the CloudDoneIcon", () => {
    render(
      <TaskIcon
        task={task}
        success={{ "1": { sending: false, success: true, error: "" } }}
      />,
    );
    expect(screen.getByTestId("CloudDoneIcon")).toBeInTheDocument();
  });

  test("Task should have the ThunderstormIcon", () => {
    render(
      <TaskIcon
        task={task}
        success={{ "1": { sending: false, success: false, error: "Error" } }}
      />,
    );
    expect(screen.getByTestId("ThunderstormIcon")).toBeInTheDocument();
  });
});
