import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomSelectTags from 'src/components/custom-select/custom-select-tags';
import CustomSelectType from 'src/components/custom-select/custom-select-type';

// ----------------------------------------------------------------------

export default function JokeManagerFileDetails({
  item,
  setItem,
  open,
  onCopyLink,
  onClose,
  onDelete,
  allTypes,
  allTags,
  allTopics,
  onItemChange,
  ...other
}) {
  const isFirstRender = useRef(true);

  const onTagsChange = (newValue) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        tags: {
          data: newValue,
        },
      },
    }));
  };

  const onTopicsChange = (newValue) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        topics: {
          data: newValue,
        },
      },
    }));
  };

  const onTypeChange = (newValue) => {
    setItem((prevData) => ({
        ...prevData,
        attributes: {
            ...prevData.attributes,
            type: {
                data: newValue,
            },
        },
    }))
  };

  const onFavoriteChange = (event) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        isFavorited: event.target.checked,
      },
    }));
  };

  const handleRemarkChange = (event) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        remark: event.target.value,
      },
    }));
  };

  const handleContentChange = (event) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        content: event.target.value,
      },
    }));
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onItemChange(item);
  }, [item, onItemChange]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 320 },
      }}
      {...other}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> Info </Typography>
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={item.attributes.isFavorited}
            onChange={onFavoriteChange}
          />
        </Stack>

        <Stack
          spacing={2.5}
          justifyContent="center"
          sx={{
            p: 2.5,
            bgcolor: 'background.neutral',
          }}
        >
          Content
          <TextField multiline value={item.attributes.content} onChange={handleContentChange} />
          <CustomSelectType
            label="Type"
            options={allTypes}
            selectOption={item.attributes.type.data}
            placeholder="Select a type"
            onChange={onTypeChange}
          />
          <CustomSelectTags
            label="Tags"
            options={allTags}
            selectOptions={item.attributes.tags.data}
            placeholder="Select tags"
            onChange={onTagsChange}
          />
          <CustomSelectTags
            label="Topics"
            options={allTopics}
            selectOptions={item.attributes.topics.data}
            placeholder="Select topics"
            onChange={onTopicsChange}
          />
          Remark
          <TextField multiline value={item.attributes.remark} onChange={handleRemarkChange} />
        </Stack>
      </Scrollbar>

      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth
          variant="soft"
          color="error"
          size="large"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            onDelete(item.id);
            onClose();
          }}
        >
          Delete
        </Button>
      </Box>
    </Drawer>
  );
}

JokeManagerFileDetails.propTypes = {
  item: PropTypes.object,
  setItem: PropTypes.func,
  onClose: PropTypes.func,
  onCopyLink: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
};
