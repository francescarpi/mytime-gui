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
  sendHandler: CallableFunction;
  disableSend: boolean;
  disableClose: boolean;
  setDisableSend: CallableFunction;
  updateTaskExtraParam?: CallableFunction;
  slotHeader?: ReactNode;
  slotTableHeader?: ReactNode;
  slotTableRow?: CallableFunction | null;
}
