import { useState, useEffect } from "react";

import { Modal, Box, Typography, Autocomplete, TextField } from "@mui/material";
import { debounce } from "@mui/material/utils";

import { StyledBox } from "../styles/modal";
import { Task } from "../hooks/useTasks";
import useSearch from "../hooks/useSearch";

const SearchExternalId = ({
  open,
  onClose,
  setExternalId,
}: {
  open: boolean;
  onClose: CallableFunction;
  setExternalId: CallableFunction;
}) => {
  const [options, setOptions] = useState<readonly Task[]>([]);

  const { result, setQuery } = useSearch({ limit: 5 });

  const onSelectHandler = (task: Task) => {
    setExternalId(task.external_id);
    onClose();
  };

  useEffect(() => {
    setOptions(result);
  }, [result]);

  return (
    <Modal open={open} onClose={() => onClose()}>
      <StyledBox>
        <Box>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Search external Id
          </Typography>
          <Autocomplete
            options={options}
            autoComplete
            value={null}
            onInputChange={debounce((_, v) => setQuery(v), 500)}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) =>
              `${option.project} - ${option.desc} - ${option.external_id}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label="Search by project or description..."
                fullWidth
              />
            )}
            onChange={(_, value) => onSelectHandler(value as Task)}
          />
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default SearchExternalId;
