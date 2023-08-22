import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableRow, { tableRowClasses } from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
//
import JokeManagerFileDetails from './joke-manager-file-details';

// ----------------------------------------------------------------------

export default function JokeManagerTableRow({
  row,
  onDeleteRow,
  allTypes,
  allTags,
  allTopics,
  onItemChange,
}) {
  const theme = useTheme();

  const {
    attributes: {
      content,
      isFavorited,
    },
  } = row;

  const [item, setItem] = useState(row);

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const details = useBoolean();

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  const onFavoriteChange = useCallback(() => {
    setItem((prevData) => ({
        ...prevData,
        attributes: {
            ...prevData.attributes,
            isFavorited: !prevData.attributes.isFavorited,
        },
    }));
    onItemChange(item);
  }, [item, onItemChange]);

  const defaultStyles = {
    borderTop: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    '&:first-of-type': {
      borderTopLeftRadius: 16,
      borderBottomLeftRadius: 16,
      borderLeft: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
    '&:last-of-type': {
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.16)}`,
    },
  };

  return (
    <>
      <TableRow
        sx={{
          borderRadius: 2,
          [`&.${tableRowClasses.selected}, &:hover`]: {
            backgroundColor: 'background.paper',
            boxShadow: theme.customShadows.z20,
            transition: theme.transitions.create(['background-color', 'box-shadow'], {
              duration: theme.transitions.duration.shortest,
            }),
            '&:hover': {
              backgroundColor: 'background.paper',
              boxShadow: theme.customShadows.z20,
            },
          },
          [`& .${tableCellClasses.root}`]: {
            ...defaultStyles,
          },
          ...(details.value && {
            [`& .${tableCellClasses.root}`]: {
              ...defaultStyles,
            },
          }),
        }}
      >
        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center"  spacing={2}>
            <Typography
              variant="inherit"
              sx={{
                maxWidth: 660,
                cursor: 'pointer',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {content}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            whiteSpace: 'nowrap',
          }}
        >
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={isFavorited}
            onChange={onFavoriteChange}
            sx={{ p: 0.75 }}
          />
        </TableCell>
      </TableRow>

      <JokeManagerFileDetails
        item={item}
        setItem={setItem}
        favorited={isFavorited}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
        allTypes={allTypes}
        allTags={allTags}
        allTopics={allTopics}
        onItemChange={onItemChange}
      />
    </>
  );
}

JokeManagerTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  row: PropTypes.object,
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
};
