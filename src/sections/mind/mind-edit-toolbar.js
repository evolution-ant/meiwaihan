import PropTypes from 'prop-types'; // @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MindEditToolbar({ backLink, onSaved, sx, ...other }) {
  return (
    <Stack
      spacing={0}
      direction="row"
      justifyContent="space-between"
      sx={{
        mb: { xs: 1, md: 1 },
        ...sx,
      }}
      {...other}
    >
      <Button
        component={RouterLink}
        href={backLink}
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
      >
        Back
      </Button>
      <Button
        component={RouterLink}
        onClick={onSaved}
        href={backLink}
        variant="contained"
        color="primary"
        size='small'
      >
        Save
      </Button>
    </Stack>
  );
}

MindEditToolbar.propTypes = {
  backLink: PropTypes.string,
  sx: PropTypes.object,
  onSaved: PropTypes.func,
};
