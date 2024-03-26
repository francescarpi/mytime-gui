import Grid from "@mui/material/Grid";

interface Shortcut {
  key: string;
  action: string;
}

const Shortcuts = () => {
  const shortcuts: Shortcut[] = [
    { key: "Ctrl+f", action: "Search tasks" },
    { key: "Left", action: "Go to previous day" },
    { key: "Right", action: "Go to next day" },
    { key: "Down", action: "Go to today" },
  ];

  return (
    <Grid container spacing={2}>
      {shortcuts.map((shortcut, index) => (
        <Grid item key={index} md={6}>
          <div>
            <strong>{shortcut.key}</strong>: {shortcut.action}
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default Shortcuts;
