import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

// @mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import TextMaxLine from 'src/components/text-max-line';
//
import JokeManagerFileDetails from './joke-manager-file-details';

// ----------------------------------------------------------------------

export default function JokeManagerFileItem({
  file,
  allTypes,
  allTags,
  allTopics,
  selected,
  onSelect,
  onDeleteRow,
  sx,
  onItemChange,
  ...other
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [item, setItem] = useState(file);

  const { copy } = useCopyToClipboard();

  const details = useBoolean();

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(file.url);
  }, [copy, enqueueSnackbar, file.url]);

  const onFavoriteChange = (event) => {
    setItem((prevData) => ({
      ...prevData,
      attributes: {
        ...prevData.attributes,
        isFavorited: event.target.checked,
      },
    }));
    onItemChange(item);
  };

  const renderAction = (
    <Stack direction="row" alignItems="center" sx={{ bottom: 8, right: 8, position: 'absolute' }}>
      <Checkbox
        color="warning"
        icon={<Iconify icon="eva:star-outline" />}
        checkedIcon={<Iconify icon="eva:star-fill" />}
        checked={file.attributes.isFavorited}
        onChange={onFavoriteChange}
      />
    </Stack>
  );

  const renderText = (
    <>
      <TextMaxLine persistent line={3} onClick={details.onTrue} sx={{ width: 1, mt: 0, mb: 0.5 }}>
        {file.attributes.content}
      </TextMaxLine>

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
        {file.attributes.type?.data?.label ? (
          <Box
            component="img"
            src={`/assets/icons/joke-types/joke_${file.attributes.type.data.label}.svg`}
            sx={{
              width: 18,
              height: 18,
              flexShrink: 0,
              mr: 0.75,
            }}
          />
        ) : (
          <Box
            component="img"
            src="/assets/icons/joke-types/joke_默认.svg"
            sx={{
              width: 18,
              height: 18,
              flexShrink: 0,
              mr: 0.75,
            }}
          />
        )}
        {file.attributes.tags.data.map((tag, index) => (
          <>
            <span>{tag.label}</span>
            {index < file.attributes.tags.data.length - 1 && (
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
    </>
  );

  return (
    <>
      <Stack
        component={Paper}
        variant="outlined"
        alignItems="flex-start"
        sx={{
          p: 2.5,
          borderRadius: 2,
          bgcolor: 'unset',
          cursor: 'pointer',
          position: 'relative',
          ...sx,
        }}
        {...other}
      >
        {renderText}
        {renderAction}
      </Stack>

      <JokeManagerFileDetails
        item={item}
        setItem={setItem}
        allTypes={allTypes}
        allTags={allTags}
        allTopics={allTopics}
        favorited={file.attributes.isFavorited}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
        onItemChange={onItemChange}
      />
    </>
  );
}

JokeManagerFileItem.propTypes = {
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onDeleteRow: PropTypes.func,
  onSelect: PropTypes.func,
  onFavorite: PropTypes.func,
  selected: PropTypes.bool,
  sx: PropTypes.object,
  onItemChange: PropTypes.func,
};
