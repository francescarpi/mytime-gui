import Integration from "../components/Settings/Integration.OLD";
import RedmineIntegrationSettings from "./redmine/IntegrationSettings";
import JiraIntegrationSettings from "./jira/IntegrationSettings";
import Sync from "../components/Sync/Sync";
import SyncModal from "./redmine/SyncModal";

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
      return SyncModal;
    default:
      return Sync;
  }
};
