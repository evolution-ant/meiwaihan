// @mui
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
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
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import TextMaxLine from 'src/components/text-max-line';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function PostItemHorizontal({ post }) {
  const popover = usePopover();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const id = post?.id;
  const title = post?.attributes?.title;
  const description = post?.attributes?.description;
  const updatedAt = post?.attributes?.updatedAt;
  const thumb_url = post?.attributes?.thumb?.data?.attributes?.url;
  const author = post?.attributes?.author?.data?.attributes;
  const tags = post?.attributes?.tags?.data;

  console.log('tags:', tags);
  return (
    <>
      <Stack component={Card} direction="row" justifyContent="space-between">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            {/* <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
              {publish}
            </Label> */}

            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {fDate(updatedAt)}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <Link color="inherit" component={RouterLink} href={paths.dashboard.blog.details(id)}>
              <TextMaxLine variant="subtitle2" line={2}>
                {title}
              </TextMaxLine>
            </Link>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {description}
            </TextMaxLine>
            
            
          </Stack>
          <Stack
              direction="row"
              alignItems="center"
              sx={{
                maxWidth: 0.99,
                whiteSpace: 'nowrap',
                typography: 'caption',
                color: 'text.disabled',
                mt: 2,
              }}
            >
              {tags.map((tag, index) => (
                <>
                  <span>{tag.attributes.name}</span>
                  {index < tags.length - 1 && (
                    <Box
                      component="span"
                      sx={{
                        mx: 0.75,
                        width: 2,
                        height: 2,
                        flexShrink: 0,
                        borderRadius: '50%',
                        bgcolor: 'currentColor',
                      }}
                    />
                  )}
                </>
              ))}
            </Stack>
        </Stack>
        {mdUp && (
          <Box sx={{ width: 300, height: 240, position: 'relative', flexShrink: 0, p: 1 }}>
            <Avatar
              alt={author?.name}
              src={`${process.env.NEXT_PUBLIC_STRAPI}${author?.avatar?.data?.attributes?.url}`}
              sx={{ position: 'absolute', top: 16, right: 16, zIndex: 9 }}
            />
            <Image
              alt={title}
              src={process.env.NEXT_PUBLIC_STRAPI + thumb_url}
              sx={{ height: 1, borderRadius: 1.5 }}
            />
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
            router.push(paths.dashboard.blog.details(title));
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.post.edit(title));
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
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

PostItemHorizontal.propTypes = {
  post: PropTypes.object,
};
