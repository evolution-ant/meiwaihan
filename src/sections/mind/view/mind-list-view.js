'use client';

import { useEffect, useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
//
import { useMind } from '../hooks';
import MindListHorizontal from '../mind-list-horizontal';
import MindSearch from '../mind-search';
import MindSort from '../mind-sort';

const filter = {
    tags: [],
}
// ----------------------------------------------------------------------
export default function MindListView() {
  const settings = useSettingsContext();

  const {
    minds,
    getMinds,
    pagination,
    changeSearch,
    searchMinds,
    allMindTags,
    getAllMindTags,
  } = useMind();

  const [page, setPage] = useState(1);
  
  const [sortBy, setSortBy] = useState('updatedAt:desc');

  const handlePageChange = useCallback((value) => {
    setPage(value);
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
    getMinds(sortBy, page, filter);
  }, [getMinds, sortBy, page]);

  useEffect(() => {
    getAllMindTags();
  }, [getAllMindTags]);

  useEffect(() => {
    setSearch((prevState) => ({
      ...prevState,
      results: searchMinds,
    }));
  }, [searchMinds]);

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
            name: 'Mind',
            href: paths.dashboard.mind.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href="/dashboard/mind/new"
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Mind
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
        <MindSearch
          search={search}
          onSearch={handleSearch}
          hrefItem={(id) => paths.dashboard.mind.edit(id)}
        />
        <Stack direction="row" spacing={1} flexShrink={0}>
          <MindSort
            sort={sortBy}
            onSort={handleSortBy}
            sortOptions={[
              { value: 'updatedAt:desc', label: 'Latest' },
              { value: 'updatedAt:asc', label: 'Oldest' },
            ]}
          />
        </Stack>
      </Stack>
      <MindListHorizontal
        minds={minds}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}

