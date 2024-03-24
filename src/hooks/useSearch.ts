import { useState, useEffect } from "react";
import { Task } from "./useTasks";
import { invoke } from "@tauri-apps/api";

const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Task[]>([]);
  const [totalWorked, setTotalWorked] = useState<number>(0);

  useEffect(() => {
    if (query === "") {
      setResult([]);
      setTotalWorked(0);
      return;
    }

    invoke("search", { query }).then((res) => {
      const totalWorked = (res as Task[]).reduce(
        (acc, task) => acc + task.duration,
        0,
      );
      setResult(res as Task[]);
      setTotalWorked(totalWorked);
    });
  }, [query]);

  return { query, result, setQuery, totalWorked };
};

export default useSearch;
