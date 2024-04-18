import Integration from "../components/Settings/Integration";
import RedmineIntegration from "./redmine/Integration";

export enum IntegrationType {
  Redmine = "Redmine",
}

export const getIntegrationComponent = (integration: string) => {
  switch (integration) {
    case IntegrationType.Redmine:
      return RedmineIntegration;
    default:
      return Integration;
  }
};
