'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CodeSort from '../code-sort';

import { useCode } from '../hooks';
//
import CodeManagerFilters from '../code-manager-filters';
import CodeManagerGridView from '../code-manager-grid-view';
import CodeManagerFiltersResult from '../code-manager-filters-result';
import CodeManagerNewDialog from '../code-manager-new-dialog';

// ----------------------------------------------------------------------

const defaultFilters = {
  title: '',
  tags: [],
  language: '',
  isFavorited: null,
};

// ----------------------------------------------------------------------
export default function CodeManagerView() {
  const {
    //
    codes,
    codesCount,
    setCodes,
    updateCode,
    createCode,
    deleteCode,
    //
    codePagination,
    setCodePagination,
    //
    getCodes,
    codeTags,
    getCodeTags,
  } = useCode();

  const [filters, setFilters] = useState(defaultFilters);

  const [sortBy, setSortBy] = useState('updatedAt:desc');

  const allTags = codeTags.map((tag) => ({ id: tag.id, label: tag.attributes.name }));

  const allLanguages = ['jsx', 'js', 'css', 'python', 'sql', 'bash', 'php', 'go', 'java', 'txt'];

  useEffect(() => {
    getCodes(sortBy, filters);
  }, [getCodes, sortBy, filters]);

  useEffect(() => {
    getCodeTags();
  }, [getCodeTags]);

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const createOrUpdate = useBoolean();

  const canReset =
    !!filters.tags.length || !!filters.language || !!filters.title || filters.isFavorited !== null;

  const notFound = (!codesCount && canReset) || !codesCount;

  const [editingItem, setEditingItem] = useState(null);

  const handleFilters = useCallback(
    (name, value) => {
      // page 重置为 1
      setCodePagination((prevState) => ({
        ...prevState,
        page: 1,
      }));
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setCodePagination]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handelPageChange = useCallback(
    (event, newValue) => {
      newValue += 1;
      console.log('newVale', newValue);
      setCodePagination((prevState) => ({
        ...prevState,
        page: newValue,
      }));
    },
    [setCodePagination]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      console.log('newVale', event.target.value);
      setCodePagination((prevState) => ({
        ...prevState,
        pageSize: event.target.value,
      }));
    },
    [setCodePagination]
  );

  const handleCreated = useCallback(
    async (item) => {
      console.log('item', item);
      const createdItem = await createCode(item);
      setCodes((prevState) => {
        const newState = [...prevState];
        newState.unshift(createdItem);
        return newState;
      });
    },
    [setCodes, createCode]
  );

  const handleUpdated = useCallback(
    async (item) => {
      console.log('item', item);
      const updatedItem = await updateCode(item);
      setCodes((prevState) => {
        const index = prevState.findIndex((x) => x.id === updatedItem.id);
        if (index === -1) {
          return prevState;
        }
        const newState = [...prevState];
        newState[index] = updatedItem;
        console.log('index', index);
        console.log('newState', newState);
        return newState;
      });
    },
    [setCodes, updateCode]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      console.log('delete id', id);
      const deleteID = await deleteCode(id);
      console.log('delete id', deleteID);
      setCodes((prevState) => {
        const newState = prevState.filter((x) => x.id !== deleteID);
        return newState;
      });
    },
    [setCodes, deleteCode]
  );

  const renderFilters = (
    <Stack
      sx={{
        width: '80%',
      }}
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems="center"
    >
      <CodeManagerFilters
        filters={filters}
        onFilters={handleFilters}
        tagOptions={allTags.map((tag) => tag.label)}
        languageOptions={allLanguages}
      />
      <Box>
        <CodeSort
          sort={sortBy}
          onSort={setSortBy}
          sortOptions={[
            { value: 'updatedAt:desc', label: 'Latest' },
            { value: 'updatedAt:asc', label: 'Oldest' },
          ]}
        />
      </Box>
    </Stack>
  );

  const renderResults = (
    <CodeManagerFiltersResult
      sx={{
        width: '80%',
      }}
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={codesCount}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Code</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="material-symbols:add" />}
            onClick={() => {
              setEditingItem(null);
              createOrUpdate.onTrue();
            }}
          >
            Create
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
          alignItems="center"
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <Stack
            sx={{
              width: '100%',
            }}
            alignItems="center"
          >
            <EmptyContent
              filled
              title="No Data"
              sx={{
                py: 10,
                width: '80%',
              }}
            />
          </Stack>
        ) : (
          <CodeManagerGridView
            data={codes}
            onOpenConfirm={confirm.onTrue}
            allTags={allTags}
            allLanguages={allLanguages}
            pagination={codePagination}
            onPageChange={handelPageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onEditRow={(item) => {
              setEditingItem(item);
              createOrUpdate.onTrue();
            }}
          />
        )}
      </Container>

      <CodeManagerNewDialog
        onCreate={handleCreated}
        onUpdate={handleUpdated}
        onDelete={handleDeleteRow}
        open={createOrUpdate.value}
        onClose={createOrUpdate.onFalse}
        allTags={allTags}
        allLanguages={allLanguages}
        editingItem={editingItem}
      />
    </>
  );
}
