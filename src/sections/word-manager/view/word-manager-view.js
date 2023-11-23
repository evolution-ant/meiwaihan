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
import WordSort from '../word-sort';

import { useWord } from '../hooks';
//
import WordManagerFilters from '../word-manager-filters';
import WordManagerGridView from '../word-manager-grid-view';
import WordManagerFiltersResult from '../word-manager-filters-result';
import WordManagerNewDialog from '../word-manager-new-dialog';

// ----------------------------------------------------------------------

const defaultFilters = {
  text: '',
  type: 'default',
  status: '',
};

// ----------------------------------------------------------------------
export default function WordManagerView() {
  const {
    //
    words,
    wordsCount,
    setWords,
    updateWord,
    createWord,
    updateWordStatus,
    deleteWord,
    //
    wordPagination,
    setWordPagination,
    //
    getWords,
  } = useWord();

  const [filters, setFilters] = useState(defaultFilters);

  const [sortBy, setSortBy] = useState('updatedAt:desc');

  const allTypes = ["default"];

  useEffect(() => {
    getWords(sortBy, filters);
  }, [getWords, sortBy, filters]);

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const createOrUpdate = useBoolean();

  const canReset = filters.type!=='default' || filters.status!=='' || !!filters.text;

  const notFound = (!wordsCount && canReset) || !wordsCount;

  const [editingItem, setEditingItem] = useState(null);

  const handleFilters = useCallback(
    (name, value) => {
      // page 重置为 1
      setWordPagination((prevState) => ({
        ...prevState,
        page: 1,
      }));
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setWordPagination]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handelPageChange = useCallback(
    (event, newValue) => {
      newValue += 1;
      console.log('newVale', newValue);
      setWordPagination((prevState) => ({
        ...prevState,
        page: newValue,
      }));
    },
    [setWordPagination]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      console.log('newVale', event.target.value);
      setWordPagination((prevState) => ({
        ...prevState,
        pageSize: event.target.value,
      }));
    },
    [setWordPagination]
  );

  const handleCreated = useCallback(
    async (item) => {
      console.log('item', item);
      const createdItem = await createWord(item);
      setWords((prevState) => {
        const newState = [...prevState];
        newState.unshift(createdItem);
        return newState;
      });
    },
    [setWords, createWord]
  );

  const handleUpdated = useCallback(
    async (item) => {
      console.log('item', item);
      const updatedItem = await updateWord(item);
      setWords((prevState) => {
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
    [setWords, updateWord]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      console.log('delete id', id);
      const deleteID = await deleteWord(id);
      console.log('delete id', deleteID);
      setWords((prevState) => {
        const newState = prevState.filter((x) => x.id !== deleteID);
        return newState;
      });
    },
    [setWords, deleteWord]
  );

const handleDifficultyChange = useCallback(
    async (id, status) => {
        await updateWordStatus(id, status);
        getWords(sortBy, filters);
    },
    [getWords, sortBy, filters, updateWordStatus]
);

  const renderFilters = (
    <Stack
      sx={{
        width: '100%',
      }}
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems="center"
    >
    <WordManagerFilters
        filters={filters}
        onFilters={handleFilters}
        typeOptions={allTypes}
      />
      <Box>
        <WordSort
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
    <WordManagerFiltersResult
      sx={{
        width: '100%',
      }}
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={wordsCount}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Word</Typography>
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
                width: '100%',
              }}
            />
          </Stack>
        ) : (
          <WordManagerGridView
            data={words}
            onOpenConfirm={confirm.onTrue}
            allTypes={allTypes}
            pagination={wordPagination}
            onPageChange={handelPageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onDifficultyChange={handleDifficultyChange}
            onEditRow={(item) => {
              setEditingItem(item);
              createOrUpdate.onTrue();
            }}
          />
        )}
      </Container>

      <WordManagerNewDialog
        onCreate={handleCreated}
        onUpdate={handleUpdated}
        onDelete={handleDeleteRow}
        open={createOrUpdate.value}
        onClose={createOrUpdate.onFalse}
        allTypes={allTypes}
        editingItem={editingItem}
      />
    </>
  );
}
