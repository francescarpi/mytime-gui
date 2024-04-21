import { render, screen } from "@testing-library/react";
import GoalProgress from "./GoalProgress";

describe("GoalProgress", () => {
  test("Render the GoalProgress component", () => {
    render(<GoalProgress goal={3600} value={1800} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("0h30m of 1h")).toBeInTheDocument();
  });
});
