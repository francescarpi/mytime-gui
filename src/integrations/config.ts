export interface IntegrationField {
  id: string;
  label: string;
  componentType: string;
  maxLength?: number;
  type?: string;
  gridWidth?: number;
  apiAction?: string;
  defaultValue?: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  settingsFields: IntegrationField[];
  syncFields: IntegrationField[];
}

export const integrationsConfig: { [key: string]: IntegrationConfig } = {
  Redmine: {
    id: "Redmine",
    name: "Redmine",
    settingsFields: [
      {
        id: "url",
        label: "URL",
        maxLength: 200,
        type: "url",
        gridWidth: 4,
        componentType: "input",
      },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        type: "password",
        gridWidth: 4,
        componentType: "input",
      },
      {
        id: "activity",
        label: "Default Activity",
        gridWidth: 4,
        componentType: "select",
        apiAction: "activities",
        defaultValue: "-1",
      },
    ],
    syncFields: [
      {
        id: "activity",
        label: "Default Activity",
        gridWidth: 6,
        componentType: "select",
        apiAction: "project_activities",
        defaultValue: "-1",
      },
    ],
  },
  Jira: {
    id: "Jira",
    name: "Jira",
    settingsFields: [
      {
        id: "url",
        label: "URL",
        maxLength: 200,
        type: "url",
        gridWidth: 4,
        componentType: "input",
      },
      {
        id: "user",
        label: "User",
        maxLength: 100,
        type: "email",
        gridWidth: 4,
        componentType: "input",
      },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        type: "password",
        gridWidth: 4,
        componentType: "input",
      },
    ],
    syncFields: [],
  },
};
