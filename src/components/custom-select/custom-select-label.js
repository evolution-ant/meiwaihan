import PropTypes from 'prop-types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { alpha, useTheme } from '@mui/material/styles';

function CustomSelectLabel({
  label,
  placeholder = '',
  options,
  selectOption,
  icon = 'eva:arrow-ios-downward-fill',
  onChange,
}) {
  const theme = useTheme();

  const selected = useMemo(() => selectOption || null, [selectOption]);

  const [value, setValue] = useState(selected || null);

  useEffect(() => {
    setValue(selected || null);
  }, [selected]);

  const handleChange = useCallback(
    (newValue) => {
      console.log('newValue', newValue);
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange]
  );

  const toggle = useBoolean(true);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        {label}
        <IconButton size="small" onClick={toggle.onToggle}>
          <Iconify icon={toggle.value ? 'eva:arrow-ios-upward-fill' : icon} />
        </IconButton>
      </Stack>
      {toggle.value && (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option}
          value={value}
          onChange={(event, newValue) => {
            handleChange(newValue);
          }}
          renderOption={(props, option, state) => (
            <li
              {...props}
              style={
                state.selected
                  ? { backgroundColor: alpha(theme.palette.primary.main, 0.2), color: '' }
                  : {}
              }
              key={option}
            >
              {option}
            </li>
          )}
          renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
        />
      )}
    </Stack>
  );
}

CustomSelectLabel.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectOption: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomSelectLabel;
