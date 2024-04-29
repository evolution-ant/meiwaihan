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
import CustomSelectStatus from 'src/components/custom-select/custom-select-status';

// ----------------------------------------------------------------------

export default function WordManagerFilters({
  //
  filters,
  onFilters,
  //
  typeOptions,
  topicOptions,
}) {
  const typePopover = usePopover();
  const topicPopover = usePopover();

  const handleFilterContent = useCallback(
    (event) => {
      onFilters('text', event.target.value);
    },
    [onFilters]
  );

  const handleFilterType = useCallback(
    (newValue) => {
      const value = filters.type === newValue ? '' : newValue;
      onFilters('type', value);
      typePopover.onClose();
    },
    [filters.type, onFilters, typePopover]
  );


  const handleFilterTopic = useCallback(
    (newValue) => {
      const value = filters.topic === newValue ? '' : newValue;
      onFilters('topic', value);
      topicPopover.onClose();
    },
    [filters.topic, onFilters, topicPopover]
  );

  const handleResetType = useCallback(() => {
    typePopover.onClose();
    onFilters('type', '');
  }, [onFilters, typePopover]);


  const handleResetTopic = useCallback(() => {
    topicPopover.onClose();
    onFilters('topic', '');
  }, [onFilters, topicPopover]);

  const renderFilterType = (
    <>
      <Button
        color="inherit"
        onClick={topicPopover.onOpen}
        endIcon={
          <Iconify
            icon={topicPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {filters.topic ? (
          <>
            {/* <Box
              component="img"
            //   src={`/assets/icons/word-types/word_${filters.topic}.svg`}
              src='http://localhost:1400/uploads/img_qx_Xahr_Qrcrz5_Wycy_Aaxe7zw_X_58bd4ad1d5.png'
              sx={{
                width: 18,
                height: 18,
                flexShrink: 0,
                mr: 0.5,
              }}
            /> */}
            {filters.topic}
          </>
        ) : (
          '分类'
        )}
      </Button>

      <Button
        color="inherit"
        onClick={typePopover.onOpen}
        endIcon={
          <Iconify
            icon={typePopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {filters.type ? (
          <>
            <Box
              component="img"
              src={`/assets/icons/word-types/word_${filters.type}.svg`}
              sx={{
                width: 18,
                height: 18,
                flexShrink: 0,
                mr: 0.5,
              }}
            />
            {filters.type}
          </>
        ) : (
          'All Type'
        )}
      </Button>

      <CustomPopover open={typePopover.open} onClose={typePopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {typeOptions.map((type) => {
              const selected = filters.type === type;
              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterType(type)}
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
                    {/* <TypeThumbnail type={type} /> */}
                    <Box
                      component="img"
                      src={`/assets/icons/word-types/word_${type}.svg`}
                      sx={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetType}>
              Clear
            </Button>
            <Button variant="contained" onClick={typePopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>

      <CustomPopover open={topicPopover.open} onClose={topicPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {topicOptions.map((topic) => {
              const selected = filters.topic === topic;
              return (
                <CardActionArea
                  key={topic}
                  onClick={() => handleFilterTopic(topic)}
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
                    {/* <TypeThumbnail type={type} /> */}
                    {/* <Box
                      component="img"
                      src={`/assets/icons/word-types/word_${topic}.svg`}
                      sx={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                      }}
                    /> */}
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{topic}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetTopic}>
              Clear
            </Button>
            <Button variant="contained" onClick={topicPopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterContent = (
    <TextField
      value={filters.text}
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
        <CustomSelectStatus
          select={filters.status}
          onSelect={(value) => onFilters('status', value)}
        />
      </Stack>
    </Stack>
  );
}

WordManagerFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  typeOptions: PropTypes.array,
  topicOptions: PropTypes.array,
};
