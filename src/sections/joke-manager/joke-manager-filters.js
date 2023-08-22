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

export default function JokeManagerFilters({
  //
  filters,
  onFilters,
  //
  tagOptions,
  topicOptions,
  typeOptions,
}) {
  const tagPopover = usePopover();

  const topicPopover = usePopover();

  const typePopover = usePopover();

  const renderTag = filters.tags.length ? filters.tags.slice(0, 2).join(',') : 'All tag';

  const renderTopic = filters.topics.length ? filters.topics.slice(0, 2).join(',') : 'All topic';

  const renderType = filters.type !== '' ? filters.type : 'All type';

  const handleFilterTag = useCallback(
    (newValue) => {
      const checked = filters.tags.includes(newValue)
        ? filters.tags.filter((value) => value !== newValue)
        : [...filters.tags, newValue];
      onFilters('tags', checked);
    },
    [filters.tags, onFilters]
  );

  const handleFilterTopic = useCallback(
    (newValue) => {
      const checked = filters.topics.includes(newValue)
        ? filters.topics.filter((value) => value !== newValue)
        : [...filters.topics, newValue];
      onFilters('topics', checked);
    },
    [filters.topics, onFilters]
  );

  const handleResetTag = useCallback(() => {
    tagPopover.onClose();
    onFilters('tags', []);
  }, [onFilters, tagPopover]);

  const handleResetTopic = useCallback(() => {
    topicPopover.onClose();
    onFilters('topics', []);
  }, [onFilters, topicPopover]);

  const handleFilterContent = useCallback(
    (event) => {
      onFilters('content', event.target.value);
    },
    [onFilters]
  );

  const renderFilterContent = (
    <TextField
      value={filters.content}
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

  const renderFilterTag = (
    <>
      <Button
        color="inherit"
        onClick={tagPopover.onOpen}
        endIcon={
          <Iconify
            icon={tagPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            sx={{ ml: -0.5 }}
          />
        }
      >
        {renderTag}
        {filters.tags.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.tags.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={tagPopover.open} onClose={tagPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {tagOptions.map((tag) => {
              const selected = filters.tags.includes(tag);

              return (
                <CardActionArea
                  key={tag}
                  onClick={() => handleFilterTag(tag)}
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
                    {/* <FileThumbnail file={tag} /> */}
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{tag}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetTag}>
              Clear
            </Button>

            <Button variant="contained" onClick={tagPopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterTopic = (
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
        {renderTopic}
        {filters.topics.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.topics.length - 2}
          </Label>
        )}
      </Button>

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
              const selected = filters.topics.includes(topic);
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
                    {/* <FileThumbnail file={tag} /> */}
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

  const renderFilterType = (
    <>
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
        {filters.type !== '' && (
          <Box
            component="img"
            src={`/assets/icons/joke-types/joke_${filters.type}.svg`}
            sx={{
              width: 18,
              height: 18,
              mr: 0.5,
            }}
          />
        )}
        {renderType}
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
                  onClick={() => {
                    onFilters('type', type);
                    typePopover.onClose();
                  }}
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
                    {type ? (
                      <Box
                        component="img"
                        src={`/assets/icons/joke-types/joke_${type}.svg`}
                        sx={{
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <Box
                        component="img"
                        src="/assets/icons/joke-types/joke_默认.svg"
                        sx={{
                          width: 24,
                          height: 24,
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => {
                typePopover.onClose();
                onFilters('type', '');
              }}
            >
              Clear
            </Button>

            <Button variant="contained" onClick={typePopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterIsFavorited = (
    <CustomSelectFav
      title=""
      select={filters.isFavorited}
      onSelect={(value) => onFilters('isFavorited', value)}
    />
  );

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterContent}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterTag}
        {renderFilterTopic}
        {renderFilterType}
        {renderFilterIsFavorited}
      </Stack>
    </Stack>
  );
}

JokeManagerFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  tagOptions: PropTypes.array,
  topicOptions: PropTypes.array,
  typeOptions: PropTypes.array,
};
