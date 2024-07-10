export interface IntegrationField {
  id: string;
  label: string;
  componentType: string;
  maxLength?: number;
  type: string;
  gridWidth?: number;
  apiAction?: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  fields: IntegrationField[];
}

export const integrationsConfig: IntegrationConfig[] = [
  {
    id: "Redmine",
    name: "Redmine",
    fields: [
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
        type: "password",
        gridWidth: 4,
        componentType: "select",
        apiAction: "activities",
      },
    ],
  },
  {
    id: "Jira",
    name: "Jira",
    fields: [
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
        componentType: "select",
      },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        type: "password",
        gridWidth: 4,
        componentType: "select",
      },
    ],
  },
];
