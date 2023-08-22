import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  events: [],
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    // GET EVENTS
    getEventsSuccess(state, action) {
      state.events = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      state.events = [...state.events, action.payload];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      const event = action.payload;

      state.events = state.events.map((_event) => {
        if (_event.id === event.id) {
          return event;
        }
        return _event;
      });
    },

    // DELETE EVENT
    deleteEventSuccess(state, action) {
      state.events = state.events.filter((event) => event.id !== action.payload);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

const QUERY_EVENTS = `
query queryEvent{
    events{
      data{
        id
        attributes{
          title
          description
          end
          start
          allDay
          
          color
        }
      }
    }
  }
`;

const CREATE_EVENT = `
mutation createEvent($data:EventInput!){
    createEvent(data:$data){
        data{
            id
            attributes{
                title
                description
                allDay
                start
                end
                color
            }
        }
    }
}
`;

const UPDATE_EVENT = `
mutation updateEvent($id:ID!,$data:EventInput!){
    updateEvent(id:$id,data:$data){
      data{
        id
        attributes{
          title
          description
          allDay
          start
          end
          color
        }
      }
    }
  }
`;

const DELETE_EVENT = `
mutation deleteEvent($id:ID!){
    deleteEvent(id:$id){
        data{
            id
        }
    }
}
`;
export function getEvents() {
  return async (dispatch) => {
    try {
      //   const response = await axios.get(API_ENDPOINTS.calendar);
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: QUERY_EVENTS,
      });
      const targetData = response.data.data.events.data.map((event) => ({
        id: String(event.id),
        title: event.attributes.title,
        description: event.attributes.description,
        start: event.attributes.start,
        end: event.attributes.end,
        allDay: event.attributes.allDay,
        color: event.attributes.color,
      }));

      dispatch(slice.actions.getEventsSuccess(targetData));
    } catch (error) {
      console.error(error);
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(eventData) {
  return async (dispatch) => {
    try {
      const data = {
        title: eventData.title,
        description: eventData.description,
        color: eventData.color,
        allDay: eventData.allDay,
        end: eventData.end,
        start: eventData.start,
      };
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CREATE_EVENT,
        variables: {
          data,
        },
      });
      const responseData = response.data.data.createEvent.data;
      const createdEvent = {
        id: String(responseData.id),
        title: responseData.attributes.title,
        description: responseData.attributes.description,
        start: responseData.attributes.start,
        end: responseData.attributes.end,
        allDay: responseData.attributes.allDay,
        color: responseData.attributes.color,
      };
      dispatch(slice.actions.createEventSuccess(createdEvent));
    } catch (error) {
      console.error(error);
    }
  };
}

// ----------------------------------------------------------------------

export function updateEvent(eventId, eventData) {
  return async (dispatch) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_EVENT,
        variables: {
          id: eventId,
          data: eventData,
        },
      });
      const responseData = response.data.data.updateEvent.data;
      const updatedEvent = {
        id: String(responseData.id),
        title: responseData.attributes.title,
        description: responseData.attributes.description,
        start: responseData.attributes.start,
        end: responseData.attributes.end,
        allDay: responseData.attributes.allDay,
        color: responseData.attributes.color,
      };
      dispatch(slice.actions.updateEventSuccess(updatedEvent));
    } catch (error) {
      console.error(error);
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(eventId) {
  return async (dispatch) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: DELETE_EVENT,
        variables: {
          id: eventId,
        },
      });
      const responseData = response.data.data.deleteEvent.data;
      const deletedEventId = String(responseData.id);
      dispatch(slice.actions.deleteEventSuccess(deletedEventId));
    } catch (error) {
      console.error(error);
    }
  };
}
