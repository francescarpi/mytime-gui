import { useState, useEffect } from "react";
import { Task } from "./useTasks";
import { invoke } from "@tauri-apps/api";

const useSearch = ({ limit = null }: { limit?: number | null }) => {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<Task[]>([]);
  const [totalWorked, setTotalWorked] = useState<number>(0);

  useEffect(() => {
    console.log("search query 1", query);
    if (query !== "") {
      console.log("search query 2", query);
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
