import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';

function CustomSelectType({
  label,
  placeholder = '',
  options,
  selectOption,
  icon = 'eva:arrow-ios-downward-fill',
  onChange,
}) {
  const theme = useTheme();

  const [value, setValue] = useState(selectOption || {
    id: 7,
    label: '默认',
  });

  useEffect(() => {
    setValue(selectOption || {
        id: 7,
        label: '默认',
    });
  }, [selectOption]);

  const handleChange = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

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
          disableCloseOnSelect={false}
          options={options}
          getOptionLabel={(option) => option.label||''}
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
              key={option.id}
            >
              {option.label && 
                <Box
                component="img"
                src={`/assets/icons/joke-types/joke_${option.label}.svg`}
                sx={{
                  width: 24,
                  height: 24,
                  flexShrink: 0,
                  mr: 1,
                }}
              />}
              {option.label}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    {value?.label && (
                      <Box
                        component="img"
                        src={`/assets/icons/joke-types/joke_${value.label}.svg`}
                        sx={{
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                          mr: 0,
                        }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}
    </Stack>
  );
}

CustomSelectType.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectOption: PropTypes.object, // 单个选项对象
  placeholder: PropTypes.string,
  icon: PropTypes.string,
  onChange: PropTypes.func,
};

export default CustomSelectType;
