import PropTypes from 'prop-types';
import { useRef } from 'react';
// @mui
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { TablePaginationCustom } from 'src/components/table';

import { tablePaginationClasses } from '@mui/material/TablePagination';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
//
import JokeManagerFileItem from './joke-manager-file-item';

// ----------------------------------------------------------------------

export default function JokeManagerGridView({
  data,
  allTypes,
  allTags,
  allTopics,
  onItemChange,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onDeleteRow
}) {
  const containerRef = useRef(null);

  const files = useBoolean();

  return (
    <Box ref={containerRef}>
      <Collapse in={!files.value} unmountOnExit>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={3}
        >
          {data.map((file) => (
            <JokeManagerFileItem
              key={file.id}
              file={file}
              sx={{ maxWidth: 'auto' }}
              allTypes={allTypes}
              allTags={allTags}
              allTopics={allTopics}
              onItemChange={onItemChange}
              onDeleteRow={onDeleteRow}
            />
          ))}
        </Box>
      </Collapse>
      <TablePaginationCustom
        count={pagination.total}
        page={pagination.page - 1}
        rowsPerPage={pagination.pageSize}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100, 10000]}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </Box>
  );
}

JokeManagerGridView.propTypes = {
  data: PropTypes.array,
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
