import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import { CustomSelectTags, CustomSelectLanguage } from 'src/components/custom-select';
import Checkbox from '@mui/material/Checkbox';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CodeManagerNewDialog({
  open,
  onClose,
  //
  onDelete,
  onCreate,
  onUpdate,
  editingItem, // 用来表示被选中的项目
  //
  allTags,
  allLanguages,
  ...other
}) {
  console.log('allTags', allTags);
  console.log('allLanguages', allLanguages);
  console.log('editingItem', editingItem);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [favorited, setFavorited] = useState(false);
  const isEditMode = editingItem !== null;

  useEffect(() => {
    if (isEditMode) {
      setTitle(editingItem.attributes.title);
      setContent(editingItem.attributes.content);
      setRemark(editingItem.attributes.remark);
      setSelectedTags(editingItem.attributes.tags.data);
      setSelectedLanguage(editingItem.attributes.language);
      setFavorited(editingItem.attributes.isFavorited);
    } else {
      reset();
    }
  }, [editingItem, isEditMode]);

  //   清空 title, content, remark, selectedTags, selectedLanguage, favorited
  const reset = () => {
    setTitle('');
    setContent('');
    setRemark('');
    setSelectedTags([]);
    setSelectedLanguage('');
    setFavorited(false);
  };

  const handleCreateOrUpdate = () => {
    const item = {
      title,
      content,
      remark,
      tags: selectedTags,
      language: selectedLanguage,
      isFavorited: favorited,
    };
    if (isEditMode) {
      onUpdate({ ...item, id: editingItem.id });
    } else {
      onCreate(item);
      reset();
    }
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6">{isEditMode ? 'Update Code' : 'Create Code'} </Typography>
        <Checkbox
          color="warning"
          icon={<Iconify icon="eva:star-outline" />}
          checkedIcon={<Iconify icon="eva:star-fill" />}
          checked={favorited}
          onChange={(event) => {
            event.stopPropagation();
            setFavorited(!favorited);
          }}
        />
      </Stack>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={5}
          />
          <CustomSelectLanguage
            label="Language"
            options={allLanguages}
            selectOption={selectedLanguage}
            placeholder="Select a language"
            onChange={setSelectedLanguage}
          />
          <CustomSelectTags
            label="Tags"
            options={allTags}
            selectOptions={selectedTags}
            placeholder="Select tags"
            onChange={setSelectedTags}
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
        {/* 当编辑模式时才展示更新按钮 */}
        {isEditMode && (
        <Button
          variant="soft"
          color="error"
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          onClick={() => {
            onDelete(editingItem.id);
            onClose();
          }}
        >
          Delete
        </Button>
        )}
        <Stack direction="row" justifyContent="flex-end" flexGrow={1}>
          <Button
            variant="soft"
            sx={{ mr: 1 }}
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="soft" onClick={handleCreateOrUpdate} color='primary'>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

CodeManagerNewDialog.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
  open: PropTypes.bool,
  allTags: PropTypes.array,
  allLanguages: PropTypes.array,
  editingItem: PropTypes.object,
};
