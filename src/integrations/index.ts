import Integration from "../components/Settings/Integration";
import RedmineIntegrationSettings from "./redmine/IntegrationSettings";
import JiraIntegrationSettings from "./jira/IntegrationSettings";
import GenericSyncModal from "../components/Sync/GenericSyncModal";
import RedmineSyncModal from "./redmine/RedmineSyncModal";

export enum IntegrationType {
  Redmine = "Redmine",
  Jira = "Jira",
}

export const getIntegrationSettingsComponent = (integration: string) => {
  switch (integration) {
    case IntegrationType.Redmine:
      return RedmineIntegrationSettings;
    case IntegrationType.Jira:
      return JiraIntegrationSettings;
    default:
      return Integration;
  }
};

export const getSyncComponent = (integration: string) => {
  switch (integration) {
    case IntegrationType.Redmine:
      return RedmineSyncModal;
    default:
      return GenericSyncModal;
  }
};
