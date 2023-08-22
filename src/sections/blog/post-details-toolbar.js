import PropTypes from 'prop-types'; // @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
// routes
import { RouterLink } from 'src/routes/components';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PostDetailsToolbar({
  backLink,
  editInfoLink,
  editPostLink,
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

        <Tooltip title="Edit Info">
          <IconButton component={RouterLink} href={editInfoLink} target='_blank'>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit Post">
          <IconButton component={RouterLink} href={editPostLink}>
            <Iconify icon="basil:edit-outline" />
          </IconButton>
        </Tooltip>

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

PostDetailsToolbar.propTypes = {
  backLink: PropTypes.string,
  editInfoLink: PropTypes.string,
  editPostLink: PropTypes.string,
  sx: PropTypes.object,
};
