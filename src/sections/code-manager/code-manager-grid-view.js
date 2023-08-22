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
import CodeManagerCodeItem from './code-manager-code-item';

// ----------------------------------------------------------------------

export default function CodeManagerGridView({
  data,
  allTags,
  allTopics,
  onItemChange,
  pagination,
  onPageChange,
  onRowsPerPageChange,
  onDeleteRow,
  onEditRow,
}) {
  const containerRef = useRef(null);

  const codes = useBoolean();

  return (
    <Box ref={containerRef}>
      <Collapse in={!codes.value} unmountOnExit>
        <Stack
          spacing={3}
          sx={{
            alignItems: 'center',
          }}
        >
          {data.map((code) => (
            <CodeManagerCodeItem
              key={code.id}
              code={code}
              allTags={allTags}
              allTopics={allTopics}
              onItemChange={onItemChange}
              onDeleteRow={onDeleteRow}
              onEditRow={onEditRow}
            />
          ))}
        </Stack>
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

CodeManagerGridView.propTypes = {
  data: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
