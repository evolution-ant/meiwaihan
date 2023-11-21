import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
// hooks
// components
import Iconify from 'src/components/iconify';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Markdown from 'src/components/markdown';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import prettier from 'prettier/standalone';
// import parserBabel from 'prettier/parser-babel';
import { useWord } from './hooks';

// ----------------------------------------------------------------------

const icon = (language) =>
  language === null || language === undefined || language === '' ? (
    <Box
      component="img"
      src="/assets/icons/word-languages/word_txt.svg"
      sx={{ width: 24, height: 24 }}
    />
  ) : (
    <Box
      component="img"
      src={`/assets/icons/word-languages/word_${language}.svg`}
      sx={{ width: 24, height: 24 }}
    />
  );

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
  const [isHovered, setIsHovered] = useState(false);

  const { updateWordFavorited } = useWord();
  const onFavoriteChange = (event) => {
    setItem((prevData) => {
      const newData = {
        ...prevData,
        attributes: {
          ...prevData.attributes,
          isFavorited: event.target.checked,
        },
      };
      updateWordFavorited(newData.id, event.target.checked);
      return newData;
    });
  };

  const language = item.attributes.language;
  const wordContent = item.attributes.content;

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
      <Accordion
        sx={{
          backgroundColor: 'transparent !important',
          boxShadow: 'none !important',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Stack direction="row" alignItems="start">
            <Checkbox
              color="warning"
              icon={<Iconify icon="eva:star-outline" />}
              checkedIcon={<Iconify icon="eva:star-fill" />}
              checked={item.attributes.isFavorited}
              onChange={(event) => {
                event.stopPropagation();
                onFavoriteChange(event);
              }}
              onClick={(event) => {
                event.stopPropagation();
              }}
              sx={{
                marginRight: 1,
              }}
            />
            <Stack>
              <Typography variant="h4">{item.attributes.text}</Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Markdown children={`\`\`\`\`\`${language ? `${language}\n` : '\n'}${wordContent}`} />
        </AccordionDetails>
      </Accordion>
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      <Stack direction="row" alignItems="between" justifyContent="space-between">
        {/* {isHovered && (
          <Iconify
            icon="ri:more-fill"
            sx={{
              width: 24,
              height: 24,
              marginRight: 1,
              cursor: 'pointer',
            }}
            onClick={(event) => {
              onEditRow(item);
            }}
          />
        )} */}
      </Stack>
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
