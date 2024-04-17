import { useState, useEffect, useReducer } from "react";
import { invoke } from "@tauri-apps/api";

export interface RedmineActivity {
  id: number;
  name: string;
}

const projectActivitiesReducer = (
  state: { [key: string]: RedmineActivity[] },
  action: any,
) => {
  switch (action.type) {
    case "set":
      return { ...state, [action.id]: action.activities };
  }
  return state;
};

const useRedmine = () => {
  const [activities, setActivities] = useState<RedmineActivity[]>([]);
  const [projectActivities, dispatchProjectActivities] = useReducer(
    projectActivitiesReducer,
    {},
  );

  useEffect(() => {
    invoke("redmine_activities").then((res) => {
      const actv = (res as any).map((a: any) => ({
        id: a.id,
        name: a.name,
      })) as RedmineActivity[];
      actv.sort((a, b) => a.name.localeCompare(b.name));
      setActivities(actv);
    });
  }, []);

  const loadProjectActivities = (externalId: string) =>
    invoke("redmine_project_activities", { externalId }).then((res: any) => {
      dispatchProjectActivities({
        type: "set",
        id: externalId,
        activities: res as RedmineActivity[],
      });
    });

  return { activities, projectActivities, loadProjectActivities };
};

export default useRedmine;
