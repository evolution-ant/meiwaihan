import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TablePaginationCustom } from 'src/components/table';
import Stack from '@mui/material/Stack';

import { tablePaginationClasses } from '@mui/material/TablePagination';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import WordManagerWordItem from './word-manager-word-item';

// ----------------------------------------------------------------------

export default function WordManagerGridView({
  data,
  allTopics,
  onItemChange,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onDeleteRow,
  onEditRow,
}) {
  const containerRef = useRef(null);

  const words = useBoolean();

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
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
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
          rowsPerPageOptions={[5, 10, 25, 50, 100, 10000]}
          sx={{
            width: '80%',
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
  onEditRow: PropTypes.func,
};
