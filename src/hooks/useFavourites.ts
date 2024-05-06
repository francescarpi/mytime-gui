import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { Task } from "./useTasks";

const useFavorites = (refresh: CallableFunction) => {
  const [favourites, setFavourites] = useState<Task[]>([]);

  const loadFavorites = () =>
    invoke("favourites").then((res) => setFavourites(res as Task[]));

  const toggleFavourite = (taskId: number) =>
    invoke("toggle_favourite", { taskId })
      .then(() => refresh())
      .then(() => {
        loadFavorites();
      });

  return { toggleFavourite, favourites, loadFavorites };
};

export default useFavorites;
