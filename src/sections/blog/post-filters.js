import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function PostFilters({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  tagOptions,
  authorOptions,
}) {
  const handleFilterPostTags = useCallback(
    (newValue) => {
      const checked = filters.tags.includes(newValue)
        ? filters.tags.filter((value) => value !== newValue)
        : [...filters.tags, newValue];
      onFilters('tags', checked);
    },
    [filters.tags, onFilters]
  );

  const handleFilterAuthor = useCallback(
    (newValue) => {
      onFilters('authorIds', newValue);
    },
    [onFilters]
  );

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Filters
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const renderPostTags = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        PostTags
      </Typography>
      {tagOptions.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={filters.tags.includes(option)}
              onClick={() => handleFilterPostTags(option)}
            />
          }
          label={option}
        />
      ))}
    </Stack>
  );

  const renderAuthor = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Author
      </Typography>
      <Autocomplete
        multiple
        options={authorOptions}
        getOptionLabel={(option) => option.attributes.username} // 使用选项的 label 作为显示值
        value={filters.authorIds.map((id) => authorOptions.find((option) => option.id === id))} // 将 id 转换为对应的选项
        onChange={(event, newValue) => handleFilterAuthor(newValue.map((option) => option.id))} // 将选择的选项转换为 id 数组
        renderInput={(params) => <TextField placeholder="Select Author" {...params} />}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <Avatar key={option.id} sx={{ mr: 1 ,width:20, height:20}} src={`${process.env.NEXT_PUBLIC_STRAPI}${option?.attributes?.avatar?.data?.attributes?.url}`}/>
            {option.attributes.username}
          </li>
        )}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const tagProps = getTagProps({ index });
            const { key, ...restTagProps } = tagProps;
            return <Chip
              key={key}
              {...restTagProps}
              label={option.attributes.username} // 使用选项的 label
              size="small"
              variant="soft"
            />
        })
        }
      />
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        Filters
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {renderPostTags}
            {renderAuthor}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}

PostFilters.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onClose: PropTypes.func,
  onFilters: PropTypes.func,
  onOpen: PropTypes.func,
  onResetFilters: PropTypes.func,
  open: PropTypes.bool,
  tagOptions: PropTypes.array,
  authorOptions: PropTypes.array,
};
