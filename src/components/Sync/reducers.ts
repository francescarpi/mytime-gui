import { SuccessType } from "./types";

export const successReducer = (state: SuccessType, action: any) => {
  switch (action.type) {
    case "reset":
      return {};
    case "sending":
      return { ...state, [action.id]: { sending: true } };
    case "success":
      return { ...state, [action.id]: { success: true, sending: false } };
    case "error":
      return {
        ...state,
        [action.id]: { success: false, error: action.error, sending: false },
      };
  }
  return state;
};

export type TaskData = {
  [key: string]: {
    [key: string]: {
      externalId: string;
      status: string;
      loadingExternalId: boolean;
    };
  };
};

export const taskDataReducer = (state: TaskData, action: any) => {
  const newState = { ...state };
  switch (action.type) {
    case "reset":
      return {};
    case "init":
      newState[action.id] = {};
      newState[action.id][action.integrationId] = {
        externalId: "",
        status: "Pending",
        loadingExternalId: true,
      };
      return newState;
    case "setExternalId":
      newState[action.id][action.integrationId] = {
        ...newState[action.id][action.integrationId],
        externalId: action.externalId,
        loadingExternalId: false,
      };
      return newState;
    case "stopLoading":
      newState[action.id][action.integrationId] = {
        ...newState[action.id][action.integrationId],
        loadingExternalId: false,
      };
      return newState;
  }
  return state;
};
