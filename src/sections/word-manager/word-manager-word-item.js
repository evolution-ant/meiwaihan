import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function WordManagerWordItem({
  word,
  allTopics,
  selected,
  onSelect,
  onDeleteRow,
  onEditRow,
  onDifficultyChange,
  sx,
  ...other
}) {
  const [item, setItem] = useState(word);

  const speakText = (times) => {
    const content =
      item.attributes.language === 'en' ? item.attributes.text : item.attributes.translatedText;

    const synth = window.speechSynthesis;
    let voices = [];

    const setVoice = () => {
      voices = synth.getVoices();
      const sandyVoice = voices.find((voice) => voice.name === 'Alex'); // Using 'Alex' as the voice
      if (sandyVoice) {
        const utterance = new SpeechSynthesisUtterance(content);
        utterance.voice = sandyVoice;
        for(let i = 0; i < times; i+=1){
            synth.speak(utterance);
        }
      } else {
        console.log('Alex voice not found');
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }
    setVoice();
  };

  useEffect(() => {
    setItem(word);
  }, [word]);

  const handleDoubleClick = () => {
    speakText(3);
  };

  const difficultyButtons = (
    <Stack
      direction="row"
      spacing={2}
      className="difficulty-buttons"
      sx={{
        visibility: 'hidden',
        mt: 2,
        // position: 'absolute',
        // bottom: 8,
        // right: 8,
      }}
    >
      <Button
        variant={item.attributes.status === 'easy' ? 'contained' : 'outlined'}
        color="success"
        onClick={() => {
          speakText(1);
          onDifficultyChange(item.id, 'easy');
        }}
      >
        Easy
      </Button>
      <Button
        variant={item.attributes.status === 'normal' ? 'contained' : 'outlined'}
        color="warning"
        onClick={() => {
          speakText(1);
          onDifficultyChange(item.id, 'normal');
        }}
      >
        Normal
      </Button>
      <Button
        variant={item.attributes.status === 'hard' ? 'contained' : 'outlined'}
        color="error"
        onClick={() => {
          speakText(1);
          onDifficultyChange(item.id, 'hard');
        }}
      >
        Hard
      </Button>
    </Stack>
  );

  const renderText = (
    <Stack
      sx={{
        width: '100%',
      }}
    >
      <Stack direction="row" alignItems="start">
        <Stack>
          <Typography variant="h4">{item.attributes.text}</Typography>
          {item.attributes.translatedText}
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Stack
      component={Paper}
      variant="outlined"
      onDoubleClick={handleDoubleClick}
      sx={{
        py: 3,
        px: 5,
        borderRadius: 2,
        bgcolor: 'unset',
        cursor: 'pointer',
        width: '100%',
        position: 'relative',
        '&:hover': {
          '& .difficulty-buttons': {
            visibility: 'visible',
          },
        },
        ...sx,
      }}
      {...other}
    >
      {renderText}
      {difficultyButtons}
    </Stack>
  );
}

WordManagerWordItem.propTypes = {
  word: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  allTopics: PropTypes.array,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelect: PropTypes.func,
  onDifficultyChange: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
