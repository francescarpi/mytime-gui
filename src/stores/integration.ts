import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api"
import type { IntegrationTask } from "@/types/integration"

export const useIntegrationStore = defineStore("integration", () => {
  const groupTasks = async (): Promise<IntegrationTask[]> => {
    return invoke("group_tasks")
  }

  const sendToIntegration = async (
    description: string,
    date: string,
    duration: string,
    externalId: string,
    ids: number[]
  ): Promise<void> => {
    return invoke("send_to_integration", {
      description,
      date,
      duration,
      externalId,
      ids: ids.join(","),
    })
  }
  return { groupTasks, sendToIntegration }
})
