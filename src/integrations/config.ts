export interface IntegrationField {
  id: string;
  label: string;
  maxLength: number;
  type: string;
  gridWidth?: number;
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
      { id: "url", label: "URL", maxLength: 200, type: "url", gridWidth: 6 },
      // Add "default activity"
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        type: "password",
        gridWidth: 6,
      },
    ],
  },
  {
    id: "Jira",
    name: "Jira",
    fields: [
      { id: "url", label: "URL", maxLength: 200, type: "url", gridWidth: 4 },
      {
        id: "user",
        label: "User",
        maxLength: 100,
        type: "email",
        gridWidth: 4,
      },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        type: "password",
        gridWidth: 4,
      },
    ],
  },
];
