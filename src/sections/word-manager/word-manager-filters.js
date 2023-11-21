import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomSelectFav from 'src/components/custom-select/custom-select-fav';

// ----------------------------------------------------------------------

export default function WordManagerFilters({
  //
  filters,
  onFilters,
  //
  TypeOptions,
}) {
  const TypePopover = usePopover();


  const handleFilterContent = useCallback(
    (event) => {
      onFilters('title', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (newValue) => {
      const value = filters.Type === newValue ? '' : newValue;
      onFilters('Type', value);
      TypePopover.onClose();
    },
    [filters.Type, onFilters, TypePopover]
  );

  const handleResetType = useCallback(() => {
    TypePopover.onClose();
    onFilters('Type', '');
  }, [onFilters, TypePopover]);

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={TypePopover.onOpen}
        endIcon={
          <Iconify
            icon={
              TypePopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
            }
            sx={{ ml: -0.5 }}
          />
        }
      >
        {filters.Type ? (
          <>
            <Box
              component="img"
              src={`/assets/icons/word-Types/word_${filters.Type}.svg`}
              sx={{
                width: 18,
                height: 18,
                flexShrink: 0,
                mr: 0.5,
              }}
            />
            {filters.Type}
          </>
        ) : (
          'All Type'
        )}
      </Button>

      <CustomPopover open={TypePopover.open} onClose={TypePopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {TypeOptions.map((Type) => {
              const selected = filters.Type === Type;

              return (
                <CardActionArea
                  key={Type}
                  onClick={() => handleFilterType(Type)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    {/* <TypeThumbnail Type={Type} /> */}
                    <Box
                      component="img"
                      src={`/assets/icons/word-Types/word_${Type}.svg`}
                      sx={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{Type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetType}>
              Clear
            </Button>

            <Button variant="contained" onClick={TypePopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterContent = (
    <TextField
      value={filters.title}
      onChange={handleFilterContent}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: { xs: 1, md: 260 },
      }}
    />
  );

  return (
    <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
      {renderFilterContent}
      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterType}
        <CustomSelectFav
          title=""
          select={filters.isFavorited}
          onSelect={(value) => onFilters('isFavorited', value)}
        />
      </Stack>
    </Stack>
  );
}

WordManagerFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  TypeOptions: PropTypes.array,
};
