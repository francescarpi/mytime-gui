import { SuccessType, TaskData } from "./types";

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

export const taskDataReducer = (state: TaskData, action: any) => {
  switch (action.type) {
    case "reset":
      return {};
    case "setExternalId":
      const newState = { ...state };
      if (!newState[action.id]) {
        newState[action.id] = {};
      }
      newState[action.id][action.integrationId] = {
        externalId: action.externalId,
      };
      return newState;
  }
  return state;
};
