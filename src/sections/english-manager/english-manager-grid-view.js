import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';
// @mui
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TablePaginationCustom } from 'src/components/table';
import Stack from '@mui/material/Stack';

import { tablePaginationClasses } from '@mui/material/TablePagination';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import WordManagerWordItem from './english-manager-word-item';

// ----------------------------------------------------------------------

export default function WordManagerGridView({
  data,
  allTopics,
  onItemChange,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onDeleteRow,
  onDifficultyChange,
  onEditRow,
}) {
  const containerRef = useRef(null);

  const words = useBoolean();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowRight':
          if (pagination.page < Math.ceil(pagination.total / pagination.pageSize)) {
            onPageChange(event, pagination.page);
          }
          console.log('ArrowRight');
          console.log('pagination.page', pagination.page);
          break;
        case 'ArrowLeft':
          if (pagination.page > 1) {
            onPageChange(event, pagination.page - 2);
          }
          console.log('ArrowLeft');
          console.log('pagination.page', pagination.page);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pagination.page, pagination.total, pagination.pageSize, onPageChange]);

  return (
    <Box ref={containerRef}>
      <Collapse in={!words.value} unmountOnExit>
        {/* <Stack
          spacing={3}
          sx={{
            alignItems: 'center',
          }}
        > */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(1, 1fr)',
            lg: 'repeat(1, 1fr)',
          }}
          gap={3}
        >
          {data.map((word) => (
            <WordManagerWordItem
              key={word.id}
              word={word}
              allTopics={allTopics}
              onItemChange={onItemChange}
              onDeleteRow={onDeleteRow}
              onEditRow={onEditRow}
              onDifficultyChange={onDifficultyChange}
            />
          ))}
        </Box>
        {/* </Stack> */}
      </Collapse>
      <Stack
        width="100%"
        sx={{
          alignItems: 'center',
        }}
      >
        <TablePaginationCustom
          count={pagination.total}
          page={pagination.page - 1}
          rowsPerPage={pagination.pageSize}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[1, 5, 10, 25, 50, 100, 10000]}
          sx={{
            width: '100%',
            [`& .${tablePaginationClasses.toolbar}`]: {
              borderTopColor: 'transparent',
            },
          }}
        />
      </Stack>
    </Box>
  );
}

WordManagerGridView.propTypes = {
  data: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onDifficultyChange: PropTypes.func,
  onEditRow: PropTypes.func,
};
