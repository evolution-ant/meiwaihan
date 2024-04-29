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
import Image from 'src/components/image';
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
    console.log('window', window);
    const synth = window.speechSynthesis;
    console.log('synth', synth);
    let voices = [];
    voices = synth.getVoices();
    console.log('voices', voices);
    const names = voices.map((voice) => voice.name);
    console.log('names', names);
    if (names.length === 0) {
      console.log('voices not loaded');
      return;
    }
    let sandyVoice = voices.find((voice) => voice.name === 'Alex'); // Using 'Kathy,Fred,Melina,Moira' as the voice
    if (!sandyVoice) {
      sandyVoice = voices.find((voice) => voice.name === 'Moira');
    }
    if (sandyVoice) {
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.voice = sandyVoice;
      console.log('times:',times)
      for (let i = 0; i < times; i += 1) {
        synth.speak(utterance);
        console.log('utterance:',utterance)
        console.log('content:',content)
      }
    } else {
      console.log('Alex voice not found');
    }
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoice;
    }
    console.log('content:',content)
    console.log('voice.name:',sandyVoice)
    console.log('setVoice')
  };

  const speakText = (times = 1) => {
    console.log('speakText')
    const text =
      item.attributes.language === 'en' ? item.attributes.text : item.attributes.translatedText;
    setVoice(text, times);
  };

  useEffect(() => {
    setItem(word);
  }, [word,speakText]);

  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI}/uploads/medium_${item.attributes.image.data?.attributes.hash}${item.attributes.image.data?.attributes.ext}`;
  console.log('imageUrl', imageUrl);
  return (
    <Stack
      component={Paper}
      variant="outlined"
      onClick={() => speakText()}
    //   onMouseEnter={speakText}
      sx={{
        py: 3, // y轴方向的内边距
        px: 5, // x轴方向的内边距
        borderRadius: 2, // 边界圆角
        cursor: 'pointer', // 鼠标悬停时指针形状为“指针”
        width: '60%', // 宽度为容器的60%
        color: '#fff', // 文字颜色
        margin: 'auto', // 自动外边距，实现水平居中
        display: 'flex', // 显示类型为Flex
        flexDirection: 'column', // 子元素垂直排列
        alignItems: 'center', // 子元素水平居中
        justifyContent: 'center', // 子元素垂直居中
        ...sx, // 展开传入的其它sx样式
      }}
      {...other}
    >
      <Stack direction="row" alignItems="baseline">
        <Typography variant="h1" mr={1}>
          {item.attributes.text}
        </Typography>
        <Typography variant="h1" color="secondary">
          {item.attributes.translatedText}
        </Typography>
      </Stack>
      <Image
        sx={{
          visibility: 'visible',
          backgroundImage: `url(${imageUrl})`, // 设置为背景图片
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%', // 根据父组件宽度调整
          height: 'auto', // 高度自适应
          m: 2, // 外边距
        }}
        src={imageUrl}
      />
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
