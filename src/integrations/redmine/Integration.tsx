import Integration from "../../components/Settings/Integration";
import { Setting } from "../../hooks/useSettings";
import Grid from "@mui/material/Grid";
import RedmineActivitySelect from "../../components/RedmineActivitySelect";
import useRedmine from "../../hooks/useRedmine";

const RedmineIntegration = ({
  setting,
  setSetting,
}: {
  setting: Setting | null;
  setSetting: CallableFunction;
}) => {
  const { activities } = useRedmine();
  const onChangeRedmineActivity = (value: string) => {
    setSetting({
      ...setting,
      integration_extra_param: value,
    });
  };

  return (
    <Integration setting={setting} setSetting={setSetting}>
      <Grid item md={12}>
        <RedmineActivitySelect
          activities={activities}
          value={setting?.integration_extra_param || null}
          onChange={onChangeRedmineActivity}
          disabled={!activities.length}
        />
      </Grid>
    </Integration>
  );
};

export default RedmineIntegration;
