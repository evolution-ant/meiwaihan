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

export default function CodeManagerFilters({
  //
  filters,
  onFilters,
  //
  tagOptions,
  languageOptions,
}) {
  const tagPopover = usePopover();
  const languagePopover = usePopover();

  const renderLabel = filters.tags.length ? filters.tags.slice(0, 2).join(',') : 'All tag';

  const handleFilterTag = useCallback(
    (newValue) => {
      const checked = filters.tags.includes(newValue)
        ? filters.tags.filter((value) => value !== newValue)
        : [...filters.tags, newValue];
      onFilters('tags', checked);
    },
    [filters.tags, onFilters]
  );

  const handleResetTag = useCallback(() => {
    tagPopover.onClose();
    onFilters('tags', []);
  }, [onFilters, tagPopover]);

  const handleFilterContent = useCallback(
    (event) => {
      onFilters('title', event.target.value);
    },
    [onFilters]
  );

  const handleFilterLanguage = useCallback(
    (newValue) => {
      const value = filters.language === newValue ? '' : newValue;
      onFilters('language', value);
      languagePopover.onClose();
    },
    [filters.language, onFilters, languagePopover]
  );

  const handleResetLanguage = useCallback(() => {
    languagePopover.onClose();
    onFilters('language', '');
  }, [onFilters, languagePopover]);

  const renderFilterLanguage = (
    <>
      <Button
        color="inherit"
        onClick={languagePopover.onOpen}
        endIcon={
          <Iconify
            icon={
              languagePopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
            }
            sx={{ ml: -0.5 }}
          />
        }
      >
        {filters.language ? (
          <>
            <Box
              component="img"
              src={`/assets/icons/code-languages/code_${filters.language}.svg`}
              sx={{
                width: 18,
                height: 18,
                flexShrink: 0,
                mr: 0.5,
              }}
            />
            {filters.language}
          </>
        ) : (
          'All language'
        )}
      </Button>

      <CustomPopover open={languagePopover.open} onClose={languagePopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {languageOptions.map((language) => {
              const selected = filters.language === language;

              return (
                <CardActionArea
                  key={language}
                  onClick={() => handleFilterLanguage(language)}
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
                    {/* <LanguageThumbnail language={language} /> */}
                    <Box
                      component="img"
                      src={`/assets/icons/code-languages/code_${language}.svg`}
                      sx={{
                        width: 24,
                        height: 24,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{language}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={handleResetLanguage}>
              Clear
            </Button>

            <Button variant="contained" onClick={languagePopover.onClose}>
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
        {renderLabel}
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

  return (
    <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
      {renderFilterContent}
      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterTag}
        {renderFilterLanguage}
        <CustomSelectFav
          title=""
          select={filters.isFavorited}
          onSelect={(value) => onFilters('isFavorited', value)}
        />
      </Stack>
    </Stack>
  );
}

CodeManagerFilters.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  tagOptions: PropTypes.array,
  languageOptions: PropTypes.array,
};
