import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

export interface RedmineActivity {
  id: number;
  name: string;
}

const useRedmine = () => {
  const [activities, setActivities] = useState<RedmineActivity[]>([]);

  useEffect(() => {
    invoke("redmine_activities").then((res) => {
      const actv = (res as any).map((a: any) => ({
        id: a.id,
        name: a.name,
      })) as RedmineActivity[];
      setActivities(actv);
    });
  }, []);

  return { activities };
};

export default useRedmine;
