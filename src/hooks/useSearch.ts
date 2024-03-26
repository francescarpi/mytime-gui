import { useState, useEffect } from "react";
import { Task } from "./useTasks";
import { invoke } from "@tauri-apps/api";

const useSearch = ({ limit = null }: { limit?: number | null }) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Task[]>([]);
  const [totalWorked, setTotalWorked] = useState<number>(0);

  useEffect(() => {
    if (query !== "") {
      console.log("Search tasks with query: ", query);
      invoke("search", { query, limit }).then((res) => {
        const totalWorked = (res as Task[]).reduce(
          (acc, task) => acc + task.duration,
          0,
        );
        setResult(res as Task[]);
        setTotalWorked(totalWorked);
      });
    }
  }, [query, limit]);

  return { query, result, setQuery, totalWorked, setResult };
};

export default useSearch;
