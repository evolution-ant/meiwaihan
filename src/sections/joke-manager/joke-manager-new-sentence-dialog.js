import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { CustomSelectTags, CustomSelectType } from 'src/components/custom-select';
import Checkbox from '@mui/material/Checkbox';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function JokeManagerNewSentenceDialog({
  title = 'Create Joke',
  open,
  onClose,
  //
  onCreate,
  //
  allTypes,
  allTags,
  allTopics,
  ...other
}) {
  const [content, setContent] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedType, setSelectedType] = useState({ id: 7, label: '默认' });
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const favoriteToogle = useBoolean(false);

  const handleClick = () => {
    const item = {
      content,
      remark,
      type: selectedType,
      tags: selectedTags,
      topics: selectedTopics,
      isFavorited: favoriteToogle.value,
    };
    onCreate(item);
    // 重置
    setContent('');
    setRemark('');
    setSelectedType({
      id: 7,
      label: '默认',
    });
    setSelectedTags([]);
    setSelectedTopics([]);
    favoriteToogle.onFalse();
    onClose();
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6"> {title} </Typography>
        <Checkbox
          color="warning"
          icon={<Iconify icon="eva:star-outline" />}
          checkedIcon={<Iconify icon="eva:star-fill" />}
          checked={favoriteToogle.value}
          onChange={favoriteToogle.onToggle}
        />
      </Stack>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={5}
          />
          <CustomSelectType
            label="Type"
            options={allTypes}
            selectOption={selectedType}
            placeholder="Select a type"
            onChange={setSelectedType}
          />
          <CustomSelectTags
            label="Tags"
            options={allTags}
            selectOptions={selectedTags}
            placeholder="Select tags"
            onChange={setSelectedTags}
          />
          <CustomSelectTags
            label="Topics"
            options={allTopics}
            selectOptions={selectedTopics}
            placeholder="Select topics"
            onChange={setSelectedTopics}
          />
          Remark
          <TextField
            label="Remark"
            multiline
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Button variant="soft" onClick={handleClick}>
            Create
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

JokeManagerNewSentenceDialog.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
};
