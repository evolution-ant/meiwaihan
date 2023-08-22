'use client';

import { useEffect, useState } from 'react';
import { unified } from 'unified';
import markdown from 'remark-parse';
import slug from 'remark-slug';
import html from 'remark-html';
import throttle from 'lodash.throttle'; // 用来节流滚动事件
// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// utils
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import { Box } from '@mui/material';
//
import { useBlog } from '../hooks';
import PostDetailsHero from '../post-details-hero';
import { PostDetailsSkeleton } from '../post-skeleton';
import PostDetailsToolbar from '../post-details-toolbar';

import PostDirectory from '../post-directory';

// ----------------------------------------------------------------------

// 存储标题数据的数组
let headers = [];


export default function PostDetailsView() {
  const params = useParams();
  const { id } = params;
  const { post, postStatus, getPost } = useBlog();

  useEffect(() => {
    if (id) {
      getPost(id);
    }
  }, [getPost, id]);

  useEffect(() => {
    // 解析Markdown，生成headers数据
    headers = [];
    if (post?.content) {
      const processor = unified()
        .use(markdown)
        .use(slug)
        .use(() => (tree) => {
          tree.children.forEach((node) => {
            if (node.type === 'heading') {
                console.log("node:",node.children[0]);
              const text = node.children[0]?.value;
              const tmpId = node.data?.id;
              headers.push({ label: text, level: node.depth, id:tmpId });
            }
          });
        })
        .use(html);
      processor.process(post.content);
      setSelectedHeader(headers[0]?.id);
      console.log("headers:",headers);
    }
  }, [post]);

  const renderSkeleton = <PostDetailsSkeleton />;

  const renderError = (
    <EmptyContent
      filled
      title={`${postStatus.error?.message}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.blog.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{
        py: 20,
      }}
    />
  );

  const [selectedHeader, setSelectedHeader] = useState(null);

  // 添加一个新的 useEffect 来监听滚动事件
  useEffect(() => {
    // 在滚动事件发生时，找到在视口中最靠近顶部的 header
    const handleScroll = throttle(() => {
      let closestHeaderId = '';
      let closestHeaderDistance = Number.MAX_VALUE;
      headers.forEach((header) => {
        if(document.getElementById(header.id)===null){
            return;
        }
        // 计算每个 header 距离视口顶部的距离
        const distance = Math.abs(
          document.getElementById(header.id).getBoundingClientRect().top
        );
        // 如果这个距离比我们之前找到的最近距离还要小，那么我们更新最近的 header
        if (distance < closestHeaderDistance) {
          closestHeaderDistance = distance;
          closestHeaderId = header.id;
        }
      });
      setSelectedHeader(closestHeaderId);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderPost = post && (
    <>
      <PostDetailsToolbar
        backLink={paths.dashboard.blog.root}
        editInfoLink={`${process.env.NEXT_PUBLIC_STRAPI}/admin/content-manager/collectionType/api::article.article/${id}`}
        editPostLink={paths.dashboard.blog.edit(`${id}`)}
      />

      <PostDetailsHero
        title={post.title}
        author={post?.author?.data?.attributes}
        coverUrl={`${process.env.NEXT_PUBLIC_STRAPI}${post?.thumb?.data?.attributes.url}`}
        updatedAt={post.updatedAt}
      />
      <Grid
        container
        spacing={3}
        xs={{
          backgroundColor: 'red',
          mt: 300,
        }}
      >
        <Grid xs={0} sm={2} md={2}>
          <Box
            sx={{
              mt: { xs: 5, md: 10 },
              maxWidth: '30%',
            }}
          />
        </Grid>
        <Grid xs={0} sm={7} md={7}>
          <Stack
            sx={{
              mx: 'auto',
              mt: { xs: 5, md: 10 },
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 5 }}>
              {post.description}
            </Typography>
            <Markdown children={post?.content} />
            <Stack
              spacing={3}
              sx={{
                py: 3,
                borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
                borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
              }}
            >
              <Stack direction="row" flexWrap="wrap" spacing={1}>
                {post.tags.data.map((tag) => (
                  <Chip key={tag} label={tag.attributes.name} variant="soft" />
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid xs={0} sm={3} md={3}>
          <Box
            sx={{
              mt: { xs: 5, md: 10 },
              ml: 10,
              position: 'sticky',
              top: '100px',
            }}
          >
            <PostDirectory
              headers={headers}
              selectedHeader={selectedHeader}
              setSelectedHeader={setSelectedHeader}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth={false}>
      {postStatus.loading ? renderSkeleton : <>{postStatus.error ? renderError : renderPost}</>}
    </Container>
  );
}
