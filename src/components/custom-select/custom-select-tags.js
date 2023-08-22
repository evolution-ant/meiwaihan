import PropTypes from 'prop-types';
import { useState, useCallback, useMemo, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { alpha, useTheme } from '@mui/material/styles';

function CustomSelectTags({
  label,
  placeholder = '',
  options,
  selectOptions,
  icon = 'eva:arrow-ios-downward-fill',
  onChange,
}) {
  const theme = useTheme();

  console.log('selectOptions', selectOptions);
  
  const defauldOptions = useMemo(() => options || [], [options]);

  const selectedIds = useMemo(() => selectOptions.map((opt) => opt.id), [selectOptions]);

  const filterSelected = useCallback((option) => selectedIds.includes(option.id), [selectedIds]);

  const [values, setValues] = useState(defauldOptions.filter(filterSelected));

  useEffect(() => {
    setValues(defauldOptions.filter(filterSelected));
  }, [defauldOptions, filterSelected]);

  const handleChange = useCallback(
    (newValue) => {
      console.log('newValue', newValue);
      setValues(newValue);
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
          multiple
            // freeSolo
          disableCloseOnSelect
          options={options}
          getOptionLabel={(option) => option.label}
          value={values}
          onChange={(event, newValue) => {
            handleChange(newValue);
          }}
        //   获取新增的值
          renderOption={(props, option, state) => (
            <li
              {...props}
              style={
                state.selected
                  ? { backgroundColor: alpha(theme.palette.primary.main, 0.2), color: '' }
                  : {}
              }
              key={option.id}
            >
              {option.label}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option.label}
                key={option.id}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder={placeholder} />}
        />
      )}
    </Stack>
  );
}

CustomSelectTags.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectOptions: PropTypes.array,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomSelectTags;
