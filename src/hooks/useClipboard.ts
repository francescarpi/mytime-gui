import { Task } from "./useTasks";

const MODE_LIST = "list";
const MODE_CSV = "csv";

const useClipboard = () => {
  const copyTask = (task: Task) => {
    const content = `[${task.project}] ${task.desc}`;
    navigator.clipboard.writeText(content);
  };

  const copyTasks = ({
    tasks,
    mode = MODE_LIST,
  }: {
    tasks: Task[];
    mode?: string;
  }) => {
    const text = tasks
      .map((task) => {
        switch (mode) {
          case MODE_CSV:
            return `${task.project},${task.desc},${task.external_id}`;
          case MODE_LIST:
          default:
            return `- [${task.project}] ${task.desc}`;
        }
      })
      .join("\n");

    navigator.clipboard.writeText(text);
  };

  const copyString = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return { copyTask, copyTasks, copyString };
};

export default useClipboard;
