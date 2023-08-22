// @mui
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
//
import { MindItemSkeleton } from './mind-skeleton';
import MindItemHorizontal from './mind-item-horizontal';

// ----------------------------------------------------------------------

export default function MindListHorizontal({ minds, loading, pagination, onPageChange }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <MindItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {minds.map((mind) => (
        <MindItemHorizontal key={mind.id} mind={mind} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {pagination.total > pagination.pageCount && (
        <Pagination
          count={pagination.pageCount}
          onChange={(event, value) => {
            onPageChange(value);
          }}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

MindListHorizontal.propTypes = {
  loading: PropTypes.bool,
  minds: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
};
