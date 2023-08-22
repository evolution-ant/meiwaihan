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
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babel';
import { useCode } from './hooks';

// ----------------------------------------------------------------------

const icon = (language) =>
  language === null || language === undefined || language === '' ? (
    <Box
      component="img"
      src="/assets/icons/code-languages/code_txt.svg"
      sx={{ width: 24, height: 24 }}
    />
  ) : (
    <Box
      component="img"
      src={`/assets/icons/code-languages/code_${language}.svg`}
      sx={{ width: 24, height: 24 }}
    />
  );

export default function CodeManagerCodeItem({
  code,
  allTags,
  allTopics,
  selected,
  onSelect,
  onDeleteRow,
  onEditRow,
  sx,
  ...other
}) {
  const [item, setItem] = useState(code);
  const [isHovered, setIsHovered] = useState(false);

  const { updateCodeFavorited } = useCode();
  const onFavoriteChange = (event) => {
    setItem((prevData) => {
      const newData = {
        ...prevData,
        attributes: {
          ...prevData.attributes,
          isFavorited: event.target.checked,
        },
      };
      updateCodeFavorited(newData.id, event.target.checked);
      return newData;
    });
  };

//   const language = item.attributes.language;
//   let codeContent = item.attributes.content;
  const {
    attributes: { language }
  }
    = item;
    let {
        attributes: { content: codeContent }
    }
    = item;

  if (language === 'js' || language === 'jsx') {
    try {
      codeContent = prettier.format(codeContent, {
        parser: 'babel',
        plugins: [parserBabel],
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'always',
        rangeStart: 0,
        rangeEnd: Infinity,
      });
    } catch (e) {
      console.error(e);
    }
  }

  //   监控 code 的变化
  useEffect(() => {
    console.log('code', code);
    setItem(code);
  }, [code]);

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
              <Typography variant="h4">{item.attributes.title}</Typography>
              <Stack
                direction="row"
                alignItems="center"
                sx={{
                  maxWidth: 0.99,
                  whiteSpace: 'nowrap',
                  typography: 'caption',
                  color: 'text.disabled',
                  mt: 2,
                }}
              >
                {item.attributes.tags.data.map((tag, index) => (
                  <>
                    <span>{tag.label}</span>
                    {index < item.attributes.tags.data.length - 1 && (
                      <Box
                        component="span"
                        sx={{
                          mx: 0.75,
                          width: 2,
                          height: 2,
                          flexShrink: 0,
                          borderRadius: '50%',
                          bgcolor: 'currentColor',
                        }}
                      />
                    )}
                  </>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Markdown children={`\`\`\`\`\`${language ? `${language}\n` : '\n'}${codeContent}`} />
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
        width: '80%',
        ...sx,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...other}
    >
      <Stack direction="row" alignItems="between" justifyContent="space-between">
        {icon(language)}
        {/* 编辑按钮 */}
        {isHovered && (
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
        )}
      </Stack>
      {renderText}
    </Stack>
  );
}

CodeManagerCodeItem.propTypes = {
  code: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
};
