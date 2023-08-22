import MindElixirReact from 'mind-elixir-react';
import MindElixir from 'mind-elixir';
import React, { useRef, useState } from 'react';
import '@mind-elixir/node-menu/dist/style.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

export default function MindMap({
     initialData, onDataChange 
    }) {
  const [data, setData] = useState(
    initialData ? JSON.parse(initialData) : MindElixir.new('new topic')
  );
  const options = { direction: MindElixir.SIDE };
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const randomString = () => {
    const len = 16;
    const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i+1) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSetData = () => {
    const topics = inputValue
      .split('，')
      .map((topic) => ({ topic: topic.trim(), id: randomString(), children: [] }));
    const newData = {
        nodeData: {
          id: '9d40d48d236e3975',
          topic: 'topic',
          root: true,
          children: topics,
        },
        linkData: {},
        theme: {
          name: 'Dark',
          palette: [
            '#848FA0',
            '#748BE9',
            '#D2F9FE',
            '#4145A5',
            '#789AFA',
            '#706CF4',
            '#EF987F',
            '#775DD5',
            '#FCEECF',
            '#DA7FBC',
          ],
          cssVar: {
            '--main-color': '#ffffff',
            '--main-bgcolor': '#4c4f69',
            '--color': '#cccccc',
            '--bgcolor': '#252526',
          },
        },
      };
    setData(newData);
    onDataChange(JSON.stringify(newData));
    setOpen(false);
  };

  const handleOperate = (operation) => {
    console.log('handleOperate', ME.current.instance.getData());
    onDataChange(JSON.stringify(ME.current.instance.getData())); // 通知外部数据变化
  };

  const ME = useRef(null);
  console.log('App render', ME);
  const handleSelectNode = (operation) => {
    console.log('handleSelectNode', operation);
  };
  const handleExpandNode = (operation) => {
    console.log('handleExpandNode', operation);
  };

  return (
    <div className="showcase">
      <div className="block">
        <MindElixirReact
          ref={ME}
          data={data}
          options={options}
          style={{ height: '87vh', width: '100%' }}
          onOperate={handleOperate}
          onSelectNode={handleSelectNode}
          onExpandNode={handleExpandNode}
        />
      </div>
      <div className="block">
        <Button variant="contained" onClick={handleClickOpen} sx={{ my: 1 }} size='small'>
          Set data
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Enter Topics</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the topics separated by commas.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Topics"
              type="text"
              fullWidth
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSetData}>Set</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

MindMap.propTypes = {
    initialData: PropTypes.string,
    onDataChange: PropTypes.func,
    };
