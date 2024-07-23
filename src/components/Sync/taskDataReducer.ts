export type TaskData = {
  [key: string]: {
    [key: string]: {
      externalId: string;
      status: string;
      loadingExternalId: boolean;
      errorMessage: string;
    };
  };
};

const taskDataReducer = (state: TaskData, action: any) => {
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
        errorMessage: "",
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
    case "setSending":
      newState[action.id][action.integrationId] = {
        ...newState[action.id][action.integrationId],
        status: "Sending",
      };
      return newState;
    case "setSuccess":
      newState[action.id][action.integrationId] = {
        ...newState[action.id][action.integrationId],
        status: "Success",
      };
      return newState;
    case "setError":
      newState[action.id][action.integrationId] = {
        ...newState[action.id][action.integrationId],
        status: "Error",
        errorMessage: action.errorMessage,
      };
      return newState;
  }
  return state;
};

export default taskDataReducer;
