import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
// hooks
// components
import Iconify from 'src/components/iconify';
import Typography from '@mui/material/Typography';
import { useWord } from './hooks';

// ----------------------------------------------------------------------

export default function WordManagerWordItem({
  word,
  allTopics,
  selected,
  onSelect,
  onDeleteRow,
  onEditRow,
  sx,
  ...other
}) {
  const [item, setItem] = useState(word);

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    let voices = [];

    const setVoice = () => {
      voices = synth.getVoices();
      for (let i = 0; i < voices.length; i++) {
        console.log(`Voice ${i}: ${voices[i].name}, ${voices[i].lang}`);
      }
      const sandyVoice = voices.find((voice) => voice.name === 'Alex');
      if (sandyVoice) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = sandyVoice;
        synth.speak(utterance);
      } else {
        console.log('Sandy voice not found');
      }
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }
    setVoice();
  };

  //   监控 word 的变化
  useEffect(() => {
    console.log('word', word);
    setItem(word);
  }, [word]);

  const renderText = (
    <Stack
      sx={{
        width: '100%',
      }}
    >
      <Stack direction="row" alignItems="start">
        <IconButton size="small" onClick={() => speakText(item.attributes.text)}>
          <Iconify icon="fluent-emoji-flat:speaker-medium-volume" />
        </IconButton>
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
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: 'unset',
        cursor: 'pointer',
        width: '100%',
        ...sx,
      }}
      {...other}
    >
      {renderText}
    </Stack>
  );
}

WordManagerWordItem.propTypes = {
  word: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  allTopics: PropTypes.array,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
