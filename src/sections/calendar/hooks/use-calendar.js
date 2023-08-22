import merge from 'lodash/merge';
import { useState, useCallback, useRef } from 'react';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { createEvent, updateEvent, deleteEvent } from 'src/redux/slices/calendar';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// _mock
import { CALENDAR_COLOR_OPTIONS } from 'src/_mock/_calendar';

// ----------------------------------------------------------------------

export default function useCalendar() {
  const calendarRef = useRef(null);

  const calendarEl = calendarRef.current;

  const smUp = useResponsive('up', 'sm');

  const dispatch = useDispatch();

  const [selectedRange, setSelectedRange] = useState(null);

  const [date, setDate] = useState(new Date());

  const [openForm, setOpenForm] = useState(false);

  const [currentEventId, setCurrentEventId] = useState(null);

  const [view, setView] = useState(smUp ? 'dayGridMonth' : 'listWeek');

  const { events: eventData } = useSelector((state) => state.calendar);

  const events = eventData.map((event) => ({
    ...event,
    textColor: event.color,
  }));

  const currentEvent = useSelector(() => {
    if (currentEventId) {
      return events.find((event) => event.id === currentEventId);
    }

    return null;
  });

  const onOpenForm = useCallback(() => {
    setOpenForm(true);
  }, []);

  const onCloseForm = useCallback(() => {
    setOpenForm(false);
    setSelectedRange(null);
    setCurrentEventId(null);
  }, []);

  const onInitialView = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      const newView = smUp ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [calendarEl, smUp]);

  const onChangeView = useCallback(
    (newView) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.changeView(newView);
        setView(newView);
      }
    },
    [calendarEl]
  );

  const onDateToday = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDatePrev = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onDateNext = useCallback(() => {
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, [calendarEl]);

  const onSelectRange = useCallback(
    (arg) => {
      if (calendarEl) {
        const calendarApi = calendarEl.getApi();

        calendarApi.unselect();
      }
      onOpenForm();
      setSelectedRange({
        start: arg.start,
        end: arg.end,
      });
    },
    [calendarEl, onOpenForm]
  );

  const onClickEvent = useCallback(
    (arg) => {
      onOpenForm();
      setCurrentEventId(arg.event.id);
    },
    [onOpenForm]
  );

  const onResizeEvent = useCallback(
    ({ event }) => {
      try {
        dispatch(
          updateEvent(event.id, {
            allDay: event.allDay,
            start: event.start,
            end: event.end,
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const onDropEvent = useCallback(
    ({ event }) => {
      try {
        dispatch(
          updateEvent(event.id, {
            allDay: event.allDay,
            start: event.start,
            end: event.end,
          })
        );
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch]
  );

  const onCreateEvent = useCallback(
    (newEvent) => {
      dispatch(createEvent(newEvent));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  const onUpdateEvent = useCallback(
    (newEvent) => {
      if (currentEventId) {
        dispatch(updateEvent(currentEventId, newEvent));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, currentEventId]
  );

  const onDeleteEvent = useCallback(
    (eventId) => {
      dispatch(deleteEvent(eventId));
    },
    [dispatch]
  );

  const onClickEventInFilters = useCallback(
    (eventId) => {
      if (eventId) {
        onOpenForm();
        setCurrentEventId(eventId);
      }
    },
    [onOpenForm]
  );

  const initialEvent = useCallback(() => {
    const initial = {
      title: '',
      description: '',
      color: CALENDAR_COLOR_OPTIONS[1],
      allDay: false,
      start: selectedRange ? new Date(selectedRange.start).toISOString() : new Date().toISOString(),
      end: selectedRange ? new Date(selectedRange.end).toISOString() : new Date().toISOString(),
    };

    if (currentEvent || selectedRange) {
      return merge({}, initial, currentEvent);
    }

    return initial;
  }, [currentEvent, selectedRange]);

  return {
    calendarRef,
    //
    view,
    date,
    events,
    initialEvent,
    currentEvent,
    currentEventId,
    //
    onDatePrev,
    onDateNext,
    onDateToday,
    onDropEvent,
    onChangeView,
    onInitialView,
    onSelectRange,
    onClickEvent,
    onResizeEvent,
    onDeleteEvent,
    onCreateEvent,
    onUpdateEvent,
    //
    openForm,
    onOpenForm,
    onCloseForm,
    //
    onClickEventInFilters,
  };
}
