'use client';

// @mui
import Timeline from '@mui/lab/Timeline';
import Box from '@mui/material/Box';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { alpha } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useCallback } from 'react';
// routes
import { useBoolean } from 'src/hooks/use-boolean';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

// components
import Iconify from 'src/components/iconify';
import { isDateError } from 'src/components/custom-date-range-picker';
import CarouselBasic3 from './carousel-basic-3';
import CarouselBasic1 from './carousel-basic-1';
import CarouselAnimation from './carousel-animation';

//
import DialyFilters from './diary-filters';
import DialyFiltersResult from './diary-filters-result';
import NewDiaryDialog from './new-diary-dialog';

import { useDiary } from './hooks';

// ----------------------------------------------------------------------

const _carouselsExample3 = [
  {
    // id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9',
    // title: '10 Must-Visit Destinations for Adventure Travelers',
    coverUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_9.jpg',
    // description:
    //   'Eaque natus adipisci soluta nostrum dolorem. Nesciunt ipsum molestias ut aliquid natus ut omnis qui fugiat. Dolor et rem. Ut neque voluptatem blanditiis quasi ullam deleniti.',
  },
  {
    // id: 'e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10',
    // title: 'The Benefits of Mindfulness Meditation',
    coverUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_10.jpg',
    // description:
    //   'Nam et error exercitationem qui voluptate optio. Officia omnis qui accusantium ipsam qui. Quia sequi nulla perspiciatis optio vero omnis maxime omnis ipsum. Perspiciatis consequuntur asperiores veniam dolores.',
  },
];

const typeStyles = [
  {
    type: 'family',
    color: 'info',
    icon: <Iconify icon="emojione-v1:family" width={24} />,
  },
  {
    type: 'travel',
    color: 'grey',
    icon: <Iconify icon="twemoji:desert-island" width={24} />,
  },
  {
    type: 'study',
    color: 'secondary',
    icon: <Iconify icon="twemoji:graduation-cap" width={24} />,
  },
  {
    type: 'friend',
    color: 'success',
    icon: <Iconify icon="twemoji:man-light-skin-tone" width={24} />,
  },
  {
    type: 'hobby',
    color: 'warning',
    icon: <Iconify icon="twemoji:studio-microphone" width={24} />,
  },
  {
    type: 'sports',
    color: 'error',
    icon: <Iconify icon="twemoji:bicycle" width={24} />,
  },
  {
    type: 'work',
    color: 'primary',
    icon: <Iconify icon="twemoji:laptop" width={24} />,
  },
];

const defaultFilters = {
  title: '',
  type: '',
  startDate: null,
  endDate: null,
};

export default function TimelineView() {
  const [data, setData] = useState([]);
  const { diaries, getDiaries, createDiary, updateDiary, deleteDiary } = useDiary();
  const [filters, setFilters] = useState(defaultFilters);
  const dateError = isDateError(filters.startDate, filters.endDate);
  const isCreate = useBoolean();
  const isEdit = useBoolean();
  const [editingDiary, setEditingDiary] = useState(null);

  const canReset = !!filters.title || !!filters.type || (!!filters.startDate && !!filters.endDate);

  const openDateRange = useBoolean();
  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleFilters = useCallback(
    (name, value) => {
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [setFilters]
  );

  useEffect(() => {
    getDiaries(filters);
  }, [getDiaries, filters]);

  useEffect(() => {
    const newData = diaries.map((item) => {
      const type = typeStyles.find((ts) => ts.type === item.attributes.type);
      const happenedAt = item.attributes.happenedAt.split('T')[0];
      return {
        key: item.id,
        title: item.attributes.title,
        des: item.attributes.description,
        happenedAt,
        color: type.color,
        icon: type.icon,
        item,
      };
    });
    setData(newData);
  }, [diaries]);

  const onCreate = useCallback(
    (item) => {
      createDiary(item);
    },
    [createDiary]
  );

  const onUpdated = useCallback(
    (id, item) => {
      updateDiary(id, item);
    },
    [updateDiary]
  );

  const onDelete = useCallback(
    (id) => {
      deleteDiary(id);
    },
    [deleteDiary]
  );

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 4 }}>
        <Typography variant="h4">Diary</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="material-symbols:add" />}
          onClick={isCreate.onTrue}
        >
          Create
        </Button>
      </Stack>
      <NewDiaryDialog open={isCreate.value} onClose={isCreate.onFalse} onCreate={onCreate} />
      <NewDiaryDialog
        open={isEdit.value}
        onClose={isEdit.onFalse}
        onUpdate={onUpdated}
        isEditing={isEdit.value}
        editingDiary={editingDiary}
        onDelete={onDelete}
      />
      <DialyFilters
        typeStyles={typeStyles}
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={['work', 'study', 'family', 'friend', 'hobby', 'sports', 'travel']}
      />
      <DialyFiltersResult
        filters={filters}
        onResetFilters={handleResetFilters}
        //
        canReset={canReset}
        onFilters={handleFilters}
        //
        results={diaries.length}
      />
      {/* <ComponentBlock title="Events"> */}
      <Timeline position="alternate">
        {data.map((item) => (
          <TimelineItem
            key={item.key}
            // 添加右键点击事件
            onContextMenu={(e) => {
              e.preventDefault();
              setEditingDiary(item.item);
              isEdit.onTrue();
            }}
          >
            <TimelineOppositeContent>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.happenedAt}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color={item.color}>{item.icon}</TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Paper
                sx={{
                  p: 3,
                  bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
                }}
              >
                <Typography variant="title2" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {item.des}
                </Typography>
                <Box sx={{ width: '100%', mt: 2, maxWidth: 450, overflow: 'hidden' }}>
                  {/* <Card> */}
                  {/* <CardHeader title="Carousel Basic 1" /> */}
                  {/* <CardContent> */}
                  <CarouselBasic3 data={item.item.attributes.images.data} />
                  {/* </CardContent> */}
                  {/* </Card> */}
                </Box>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      {/* </ComponentBlock> */}
    </Container>
  );
}
