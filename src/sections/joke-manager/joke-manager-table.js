// @mui
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import JokeManagerTableRow from './joke-manager-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'content', label: 'Content' },
  //   { id: 'topic', label: 'Topic', width: 120 },
  //   { id: 'tags', label: 'Tags', width: 120 },
  //   { id: 'remark', label: 'Remark', width: 140 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function JokeManagerTable({
  pagination,
  onPageChange,
  onRowsPerPageChange,
  tableData,
  notFound,
  onOpenConfirm,
  allTypes,
  allTags,
  allTopics,
  onItemChange,
  onDeleteRow,
}) {
  const theme = useTheme();

  const dense = useBoolean(true);

  const denseHeight = dense ? 58 : 78;

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: theme.spacing(-2, -3, -3, -3),
        }}
      >
        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
            //   order={order}
            //   orderBy={orderBy}
            //   onSort={onSort}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />

            <TableBody>
              {tableData.map((row) => (
                <JokeManagerTableRow
                  key={row.id}
                  row={row}
                  allTypes={allTypes}
                  allTags={allTags}
                  allTopics={allTopics}
                  onItemChange={onItemChange}
                  onDeleteRow={onDeleteRow}
                />
              ))}
              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(pagination.page-1, pagination.pageSize, pagination.total)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={pagination.total}
        page={pagination.page-1}
        rowsPerPage={pagination.pageSize}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100, 10000]}
        //
        // dense={dense}
        // onChangeDense={(event) => {
        //     console.log('event.target.checked', event.target.checked)
        //     dense.onToggle(!event.target.checked)
        // }}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}

JokeManagerTable.propTypes = {
  notFound: PropTypes.bool,
  onOpenConfirm: PropTypes.func,
  tableData: PropTypes.array,
  allTypes: PropTypes.array,
  allTags: PropTypes.array,
  allTopics: PropTypes.array,
  onItemChange: PropTypes.func,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
