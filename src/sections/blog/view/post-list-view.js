'use client';

import { useEffect, useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useBoolean } from 'src/hooks/use-boolean';
//
import { useBlog } from '../hooks';
import PostListHorizontal from '../post-list-horizontal';
import PostSearch from '../post-search';
import PostSort from '../post-sort';
import PostFilters from '../post-filters';
import PostFiltersResult from '../post-filters-result';

// ----------------------------------------------------------------------
const defaultFilters = {
  tags: [],
  authorIds: [],
};

export default function PostListView() {
  const settings = useSettingsContext();

  const {
    posts,
    getPosts,
    postsStatus,
    pagination,
    changeSearch,
    searchPosts,
    allPostTags,
    getAllPostTags,
    users,
    getUsers,
  } = useBlog();

  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState('updatedAt:desc');

  const openFilters = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const handlePageChange = useCallback((value) => {
    setPage(value);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const canReset = !!filters.tags.length || !!filters.authorIds.length;

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const handleSearch = useCallback(
    async (value) => {
      setSearch((prevState) => ({
        ...prevState,
        query: value,
      }));
      changeSearch(value);
    },
    [changeSearch]
  );

  useEffect(() => {
    getPosts(sortBy, page, filters);
  }, [getPosts, sortBy, page, filters]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getAllPostTags();
  }, [getAllPostTags]);

  useEffect(() => {
    setSearch((prevState) => ({
      ...prevState,
      results: searchPosts,
    }));
  }, [searchPosts]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.blog.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            // component={RouterLink}
            // href="http://localhost:1337/admin/content-manager/collectionType/api::article.article/create"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              const audioUrl = 'https://dict.youdao.com/dictvoice?audio=word&type=1';
              fetch(audioUrl, { mode: "no-cors" })
              .then((response) => response.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(blob);
                  const audio = new Audio(url);
                  audio.play();
                })
                .catch((error) => console.error('发生错误:', error));
            }}
          >
            New Post
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <PostSearch
          search={search}
          onSearch={handleSearch}
          hrefItem={(id) => paths.dashboard.blog.details(id)}
        />
        <Stack direction="row" spacing={1} flexShrink={0}>
          <PostFilters
            open={openFilters.value}
            onOpen={openFilters.onTrue}
            onClose={openFilters.onFalse}
            //
            filters={filters}
            onFilters={handleFilters}
            //
            canReset={canReset}
            onResetFilters={handleResetFilters}
            //
            tagOptions={
              allPostTags && allPostTags.length > 0
                ? allPostTags.map((postTag) => postTag.attributes.name)
                : []
            }
            authorOptions={users}
          />

          <PostSort
            sort={sortBy}
            onSort={handleSortBy}
            sortOptions={[
              { value: 'updatedAt:desc', label: 'Latest' },
              { value: 'updatedAt:asc', label: 'Oldest' },
            ]}
          />
        </Stack>
      </Stack>
      {JSON.stringify(filters) !== JSON.stringify(defaultFilters) && (
        <Stack
          spacing={2.5}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <PostFiltersResult
            filters={filters}
            onResetFilters={handleResetFilters}
            //
            canReset={canReset}
            onFilters={handleFilters}
            //
            results={posts.length}
          />
        </Stack>
      )}
      <PostListHorizontal
        posts={posts}
        loading={postsStatus.loading}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}
