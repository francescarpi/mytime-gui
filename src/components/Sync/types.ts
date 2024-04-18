import { ReactNode } from "react";
import { SyncTask } from "../../hooks/useSync";

export type SuccessType = {
  [key: string]: {
    success?: boolean;
    error?: string;
    sending: boolean;
  };
};

export interface SyncProps {
  opened: boolean;
  onClose: CallableFunction;
  tasks: SyncTask[];
  integrationName: string;
  success: SuccessType;
  isSending: boolean;
  sendHandler: CallableFunction;
  tasksSent: boolean;
  updateTaskExtraParam?: CallableFunction;
  setTasksSent?: CallableFunction;
  slotHeader?: ReactNode;
  slotTableHeader?: ReactNode;
  slotTableRow?: CallableFunction | null;
}
