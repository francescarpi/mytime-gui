import Integration from "../components/Settings/Integration";
import RedmineIntegrationSettings from "./redmine/IntegrationSettings";

export enum IntegrationType {
  Redmine = "Redmine",
}

export const getIntegrationComponent = (integration: string) => {
  switch (integration) {
    case IntegrationType.Redmine:
      return RedmineIntegrationSettings;
    default:
      return Integration;
  }
};
