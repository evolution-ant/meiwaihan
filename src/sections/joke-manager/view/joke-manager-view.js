'use client';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import { useJoke } from '../hooks';
//
import JokeManagerTable from '../joke-manager-table';
import JokeManagerFilters from '../joke-manager-filters';
import JokeManagerGridView from '../joke-manager-grid-view';
import JokeManagerFiltersResult from '../joke-manager-filters-result';
import JokeManagerNewSentenceDialog from '../joke-manager-new-sentence-dialog';

// ----------------------------------------------------------------------

const defaultFilters = {
  content: '',
  tags: [],
  topics: [],
  type: '',
  isFavorited: null
};

// ----------------------------------------------------------------------

export default function JokeManagerView() {
  const {
    //
    jokes,
    jokesCount,
    setJokes,
    updateJoke,
    createJoke,
    deleteJoke,
    //
    jokePagination,
    setJokePagination,
    //
    getJokes,
    jokeTags,
    getJokeTags,
    jokeTopics,
    getJokeTopics,
    jokeTypes,
    getJokeTypes
  } = useJoke();

  const [filters, setFilters] = useState(defaultFilters);

  const [sortParams] = useState(['updatedAt:desc']);

  const allTags = jokeTags.map((tag) => ({ id: tag.id, label: tag.attributes.name }));
  const allTopics = jokeTopics.map((topic) => ({ id: topic.id, label: topic.attributes.name }));
  const allTypes = jokeTypes.map((type) => ({ id: type.id, label: type.attributes.name }));

  useEffect(() => {
    getJokes(sortParams, filters);
  }, [getJokes, sortParams, filters]);

  useEffect(() => {
    getJokeTags();
  }, [getJokeTags]);

  useEffect(() => {
    getJokeTopics();
  }, [getJokeTopics]);

  useEffect(() => {
    getJokeTypes();
  }, [getJokeTypes]);

  const settings = useSettingsContext();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [view, setView] = useState('grid');

  const canReset = !!filters.tags.length || !!filters.topics.length || !!filters.type || !!filters.content || filters.isFavorited!==null;

  const notFound = (!jokesCount && canReset) || !jokesCount;

  const handleChangeView = useCallback((event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  }, []);

  const handleFilters = useCallback(
    (name, value) => {
      // page 重置为 1
      setJokePagination((prevState) => ({
        ...prevState,
        page: 1,
      }));
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setJokePagination]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleItemChange = useCallback(
    (item) => {
      updateJoke(item);
      setJokes((prevState) => {
        const index = prevState.findIndex((x) => x.id === item.id);
        if (index === -1) {
          return prevState;
        }
        console.log('item', item);
        const newState = [...prevState];
        newState[index] = item;
        return newState;
      });
    },
    [setJokes, updateJoke]
  );

  const handelPageChange = useCallback(
    (event, newValue) => {
      newValue += 1;
      console.log('newVale', newValue);
      setJokePagination((prevState) => ({
        ...prevState,
        page: newValue,
      }));
    },
    [setJokePagination]
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      console.log('newVale', event.target.value);
      setJokePagination((prevState) => ({
        ...prevState,
        pageSize: event.target.value,
      }));
    },
    [setJokePagination]
  );

  const handleCreated = useCallback(
    async (item) => {
      const createdItem = await createJoke(item);
      setJokes((prevState) => {
        const newState = [...prevState];
        newState.unshift(createdItem);
        return newState;
      });
    },
    [setJokes, createJoke]
  );

  const handleDeleteRow = useCallback(
    async (id) => {
      console.log('delete id', id);
      const deleteID = await deleteJoke(id);
      console.log('delete id', deleteID);
      setJokes((prevState) => {
        const newState = prevState.filter((x) => x.id !== deleteID);
        return newState;
      });
    },
    [setJokes, deleteJoke]
  );

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <JokeManagerFilters
        filters={filters}
        onFilters={handleFilters}
        tagOptions={allTags.map((tag) => tag.label)}
        topicOptions={allTopics.map((topic) => topic.label)}
        typeOptions={allTypes.map((type) => type.label)}
      />

      <ToggleButtonGroup size="small" value={view} exclusive onChange={handleChangeView}>
        <ToggleButton value="list">
          <Iconify icon="solar:list-bold" />
        </ToggleButton>

        <ToggleButton value="grid">
          <Iconify icon="mingcute:dot-grid-fill" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );

  const renderResults = (
    <JokeManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={jokesCount}
    />
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h4">Idea</Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="material-symbols:add" />}
            onClick={upload.onTrue}
          >
            Create
          </Button>
        </Stack>

        <Stack
          spacing={2.5}
          sx={{
            my: { xs: 3, md: 5 },
          }}
        >
          {renderFilters}

          {canReset && renderResults}
        </Stack>

        {notFound ? (
          <EmptyContent
            filled
            title="No Data"
            sx={{
              py: 10,
            }}
          />
        ) : (
          <>
            {view === 'list' ? (
              <JokeManagerTable
                tableData={jokes}
                notFound={notFound}
                onOpenConfirm={confirm.onTrue}
                onPageChange={handelPageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                allTypes={allTypes}
                allTags={allTags}
                allTopics={allTopics}
                onItemChange={handleItemChange}
                pagination={jokePagination}
                onDeleteRow={handleDeleteRow}
              />
            ) : (
              <JokeManagerGridView
                data={jokes}
                onOpenConfirm={confirm.onTrue}
                allTypes={allTypes}
                allTags={allTags}
                allTopics={allTopics}
                onItemChange={handleItemChange}
                pagination={jokePagination}
                onPageChange={handelPageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onDeleteRow={handleDeleteRow}
              />
            )}
          </>
        )}
      </Container>

      <JokeManagerNewSentenceDialog
        onCreate={handleCreated}
        open={upload.value}
        onClose={upload.onFalse}
        allTypes={allTypes}
        allTags={allTags}
        allTopics={allTopics}
      />
    </>
  );
}
