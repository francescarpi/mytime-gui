import { ReactNode } from "react";
import { SyncTask } from "../../hooks/useSync";

export interface SyncProps {
  opened: boolean;
  onClose: CallableFunction;
  tasks: SyncTask[];
  integrationName: string;
  isSending: boolean;
  sendHandler: CallableFunction;
  tasksSent: boolean;
  updateTaskExtraParam?: CallableFunction;
  setTasksSent?: CallableFunction;
  slotHeader?: ReactNode;
  slotTableHeader?: ReactNode;
  slotTableRow?: CallableFunction | null;
}

export interface IntegrationLog {
  external_id: string;
}
