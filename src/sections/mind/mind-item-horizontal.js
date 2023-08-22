import { useState, useEffect } from 'react';
// @mui
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import OrganizationalChart from 'src/components/organizational-chart';

// ----------------------------------------------------------------------

export default function MindItemHorizontal({ mind }) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const id = mind?.id;
  const title = mind?.attributes?.title;
  const updatedAt = mind?.attributes?.updatedAt;

  const [parsedData, setParsedData] = useState(null);

  const transformData = (data) => {
    const mapNode = (node) => ({
      name: node.topic,
      children: node.children && node.children.length > 0 ? node.children.map(mapNode) : undefined,
    });
    if (!data) {
      return null;
    }
    const rootNode = data.nodeData.root ? data.nodeData : data.nodeData.children.find(node => node.root);
    console.log('rootNode:', mapNode(rootNode));
    return mapNode(rootNode);
  };
  
  useEffect(() => {
    if (mind) {
      try {
        const data = JSON.parse(mind.attributes.content);
        setParsedData(data);
        console.log('data:', data);
      } catch (e) {
        console.error('Failed to parse mind.content:', e);
      }
    }
  }, [mind]);

  return (
    <>
      <Stack component={Card} direction="row" justifyContent="space-between">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(updatedAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}
            sx={{
                writingMode: 'vertical-rl'
              }}
          >
            <Link color="inherit" component={RouterLink} href={paths.dashboard.mind.edit(id)}>
              <TextMaxLine variant="subtitle1" line={2}>
                {title}
              </TextMaxLine>
            </Link>
          </Stack>
        </Stack>
        {mdUp && (
          <Box sx={{ width: 500, height: 240, position: 'relative',mt:1 }}>
            <OrganizationalChart data={transformData(parsedData)} variant="mini" lineHeight="10px"  />
          </Box>
        )}
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.mind.edit(title));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}

MindItemHorizontal.propTypes = {
  mind: PropTypes.object,
};