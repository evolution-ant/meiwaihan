import PropTypes from 'prop-types'; // @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// components
import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function JokeManagerFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}) {
  console.log('JokeManagerFiltersResult', filters);
  const shortLabel = shortDateLabel(filters.startDate, filters.endDate);

  const handleRemoveTages = (inputValue) => {
    const newValue = filters.tags.filter((item) => item !== inputValue);
    onFilters('tags', newValue);
  };

  const handleRemoveTopics = (inputValue) => {
    const newValue = filters.topics.filter((item) => item !== inputValue);
    onFilters('topics', newValue);
  };

  const handleRemoveType = (inputValue) => {
    onFilters('type', '');
  };

  const handleRemoveDate = () => {
    onFilters('startDate', null);
    onFilters('endDate', null);
  };

//   filters.isFavorited === null ? 'All' : filters.isFavorited ? 'Yes' : 'No'
  const getLabel = (isFavorited) => {
    if (isFavorited === null) return 'All';
    return isFavorited ? 'Yes' : 'No';
    };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {!!filters.tags.length && (
          <Block label="Tags:">
            {filters.tags.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveTages(item)} />
            ))}
          </Block>
        )}
        {!!filters.topics.length && (
          <Block label="Topics:">
            {filters.topics.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveTopics(item)}
              />
            ))}
          </Block>
        )}

        {!!filters.type && (
          <Block label="Type:">
            <Chip
              key={filters.type}
              label={filters.type}
              size="small"
              onDelete={() => handleRemoveType(filters.type)}
            />
          </Block>
        )}

        {filters.isFavorited !== null && (
          <Block label="Favorited:">
            <Chip
              key={filters.isFavorited}
              label={getLabel(filters.isFavorited)}
              size="small"
              onDelete={() => onFilters('isFavorited', null)}
            />
          </Block>
        )}

        {filters.startDate && filters.endDate && (
          <Block label="Date:">
            <Chip size="small" label={shortLabel} onDelete={handleRemoveDate} />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

JokeManagerFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
