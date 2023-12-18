import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import { useSnackbar } from 'src/components/snackbar';
import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';

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

  const { copy } = useCopyToClipboard();

  const { enqueueSnackbar } = useSnackbar();

  const copyText = () => {
    const text =
      item.attributes.language === 'en' ? item.attributes.text : item.attributes.translatedText;
    enqueueSnackbar('Copied!');
    copy(text);
  };

  const setVoice = (content, times = 1) => {
    const synth = window.speechSynthesis;
    let voices = [];
    voices = synth.getVoices();
    const names = voices.map((voice) => voice.name);
    alert(names)
    const sandyVoice = voices.find((voice) => voice.name === 'Alex'); // Using 'Alex' as the voice
    if (sandyVoice) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.voice = sandyVoice;
      for (let i = 0; i < times; i += 1) {
        synth.speak(utterance);
      }
    } else {
      console.log('Alex voice not found');
    }
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }
  };

  const speakText = (times = 1) => {
    const text =
      item.attributes.language === 'en' ? item.attributes.text : item.attributes.translatedText;
    setVoice(text, times);
  };

  const speakSentence = (times = 1) => {
    const text = item.attributes.sourceSentence;
    console.log('text', text);
    setVoice(text, times);
  };

  useEffect(() => {
    setItem(word);
  }, [word]);

  const hiddenView = (
    <Stack
      sx={{
        visibility: 'hidden',
      }}
      className="difficulty-buttons"
    >
      <Stack>
        <Typography variant="h5" color="secondary">
          {item.attributes.translatedText}
        </Typography>

        <Typography variant="body2">
          <IconButton size="large" disabled="true">
            <Iconify width="24" icon="fluent:apps-list-detail-20-filled" />
          </IconButton>
          {item.attributes.explanation}
        </Typography>
        <Typography variant="body2">
          <IconButton size="large" disabled="true">
            <Iconify width="24" icon="material-symbols:history-edu" />
          </IconButton>
          {item.attributes.origin}
        </Typography>
        <Typography fontStyle="italic">
          <IconButton
            size="large"
            onClick={() => {
              speakSentence();
            }}
          >
            <Iconify width="24" icon="tabler:message" />
          </IconButton>
          {item.attributes.sourceSentence}
        </Typography>
        <Typography variant="body2" color="primary" ml={4}>
          {item.attributes.translationSentence}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mt: 2,
        }}
      >
        <Button
          size="small"
          variant={item.attributes.status === 'easy' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => {
            speakText();
            onDifficultyChange(item.id, 'easy');
          }}
        >
          Easy
        </Button>
        <Button
          size="small"
          variant={item.attributes.status === 'normal' ? 'contained' : 'outlined'}
          color="warning"
          onClick={() => {
            copyText();
            speakText();
            onDifficultyChange(item.id, 'normal');
          }}
        >
          Normal
        </Button>
        <Button
          size="small"
          variant={item.attributes.status === 'hard' ? 'contained' : 'outlined'}
          color="error"
          onClick={() => {
            copyText();
            speakText();
            onDifficultyChange(item.id, 'hard');
          }}
        >
          Hard
        </Button>
      </Stack>
    </Stack>
  );
  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI}/uploads/medium_${item.attributes.image.data?.attributes.hash}${item.attributes.image.data?.attributes.ext}`;
  console.log('imageUrl', imageUrl);
  return (
    <Stack
      component={Paper}
      variant="outlined"
      onDoubleClick={() => {
        speakText();
      }}
      onMouseEnter={() => {
        speakText();
      }}
      sx={{
        py: 3,
        px: 5,
        borderRadius: 2,
        cursor: 'pointer',
        width: '100%',
        color: '#fff', // 文字颜色（可根据需要调整）
        position: 'relative',
        '&:hover': {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imageUrl})`, // hover 时显示图片和蒙版
          backgroundSize: 'cover', // 确保图片覆盖整个元素
          backgroundPosition: 'center', // 图片居中
          '& .difficulty-buttons': {
            visibility: 'visible',
          },
        },
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="baseline">
        <Typography variant="h4" mr={1}>
          {item.attributes.text}
        </Typography>
        {item.attributes.phonetic}
      </Stack>
      {hiddenView}
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
