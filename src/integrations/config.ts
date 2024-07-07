export interface IntegrationField {
  id: string;
  label: string;
  maxLength: number;
  gridWidth: number;
  type: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  fields: IntegrationField[];
}

export const integrationsConfig: IntegrationConfig[] = [
  {
    id: "redmine",
    name: "Redmine",
    fields: [
      { id: "url", label: "URL", maxLength: 200, gridWidth: 3, type: "url" },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        gridWidth: 4,
        type: "password",
      },
    ],
  },
  {
    id: "jira",
    name: "Jira",
    fields: [
      { id: "url", label: "URL", maxLength: 200, gridWidth: 3, type: "url" },
      {
        id: "user",
        label: "User",
        maxLength: 100,
        gridWidth: 2,
        type: "email",
      },
      {
        id: "token",
        label: "Token",
        maxLength: 100,
        gridWidth: 2,
        type: "password",
      },
    ],
  },
];
