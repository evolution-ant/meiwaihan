import PropTypes from 'prop-types'; // @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PostEditToolbar({
  backLink,
  onSave,
  sx,
  ...other
}) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
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

        <Box sx={{ flexGrow: 1 }} />

        <Button
          startIcon={<Iconify icon="dashicons:saved" width={16} />}
          onClick={onSave}
        >
          Save
        </Button>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      />
    </>
  );
}

PostEditToolbar.propTypes = {
  backLink: PropTypes.string,
  onSave: PropTypes.func,
  sx: PropTypes.object,
};
