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
import { CustomSelectLabel } from 'src/components/custom-select';
import Checkbox from '@mui/material/Checkbox';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';

// ----------------------------------------------------------------------

export default function NewDiaryDialog({
  dialogTitle = 'Create Diary',
  open,
  onClose,
  //
  onCreate,
  //
  ...other
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const historyToogle = useBoolean(false);
  const [happenedAt, setHappenedAt] = useState(new Date());

  const handleClick = () => {
    const item = {
      title,
      description,
      type: selectedType,
      isHistory: historyToogle.value,
      happenedAt,
    };
    onCreate(item);
    // 重置
    setTitle('');
    setDescription('');
    setSelectedType('');
    historyToogle.onFalse();
    setHappenedAt(new Date());
    onClose();
  };
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose} {...other}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
        <Typography variant="h6"> {dialogTitle} </Typography>
        <Checkbox
          color="warning"
          icon={<Iconify icon="eva:star-outline" />}
          checkedIcon={<Iconify icon="eva:star-fill" />}
          checked={historyToogle.value}
          onChange={historyToogle.onToggle}
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
          <CustomSelectLabel
            label="Type"
            options={['family', 'travel', 'study', 'friend', 'hobby', 'sports', 'work']}
            selectOption={selectedType}
            placeholder="Select a type"
            onChange={setSelectedType}
          />
          Description
          <TextField
            label="Description"
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

NewDiaryDialog.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
  open: PropTypes.bool,
  dialogTitle: PropTypes.string,
};
