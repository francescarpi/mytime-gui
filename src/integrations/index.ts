import Integration from "../components/Settings/Integration";
import RedmineIntegrationSettings from "./redmine/IntegrationSettings";
import Sync from "../components/Sync/Sync";
import SyncModal from "./redmine/SyncModal";

export enum IntegrationType {
  Redmine = "Redmine",
}

export const getIntegrationSettingsComponent = (integration: string) => {
  switch (integration) {
    case IntegrationType.Redmine:
      return RedmineIntegrationSettings;
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
