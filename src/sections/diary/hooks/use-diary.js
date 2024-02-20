import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const DIARIES_QUERY = `
query diaries($filters:DiaryFiltersInput!){
    diaries(pagination:{
      page:1,
      pageSize:100
    },sort:["happenedAt:desc"],filters:$filters){
      data{
        id
        attributes{
          title
          description
          type
          happenedAt
        }
      }
    }
  }
`;

const CREATE_DIARY_MUTATION = `
mutation createDiary($input: DiaryInput!) {
    createDiary(data: $input) {
      data {
        id
        attributes {
          title
          description
          type
          happenedAt
        }
      }
    }
  }  
`;

const UPDATE_DIARY_MUTATION = `
mutation updateDiary($id: ID!, $input: DiaryInput!) {
    updateDiary(id: $id, data: $input) {
        data {
            id
            attributes {
                title
                description
                type
                happenedAt
            }
        }
    }
}
`;

const DELETE_DIARY_MUTATION = `
mutation deleteDiary($id: ID!) {
    deleteDiary(id: $id) {
        data {
            id
        }
    }
}
`;

function buildFilters({ title, type, startDate, endDate }) {
  const filters = {};

  if (type) {
    filters.type = { eq: type };
  }

  if (title) {
    filters.title = { contains: title };
  }

  if (startDate && endDate) {
    filters.happenedAt = {
      between: [startDate, endDate],
    };
  }

  return filters;
}

export default function useDiary() {
  const [diaries, setDiaries] = useState([]);

  const [DiarysStatus, setDiariesStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const handleSetDiariesStatus = useCallback((name, value) => {
    setDiariesStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const getDiaries = useCallback(
    async (filters) => {
      handleSetDiariesStatus('loading', true);
      handleSetDiariesStatus('empty', false);
      handleSetDiariesStatus('error', null);

      try {
        filters = buildFilters(filters);
        console.log('filters', filters);
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: DIARIES_QUERY,
          variables: {
            filters,
          },
        });
        console.log('response', response);
        const fetchedDiaries = response.data.data.diaries.data;
        console.log('fetchedDiaries', fetchedDiaries);

        setDiaries(fetchedDiaries);

        console.log('fetchedDiaries', fetchedDiaries);
        handleSetDiariesStatus('loading', false);
        handleSetDiariesStatus('empty', !response.data.diaries.data.length);
        handleSetDiariesStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetDiariesStatus('loading', false);
        handleSetDiariesStatus('empty', false);
        handleSetDiariesStatus('error', error);
      }
    },
    [handleSetDiariesStatus]
  );

  const createDiary = useCallback(
    async (Diary) => {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CREATE_DIARY_MUTATION,
        variables: {
          input: Diary,
        },
      });
      const createdDiary = response.data.data.createDiary.data;
      setDiaries((prevState) => {
        const newState = [...prevState];
        newState.unshift(createdDiary);
        return newState;
      });
      return createdDiary;
    },
    [setDiaries]
  );

  const updateDiary = useCallback(
    async (DiaryId, Diary) => {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_DIARY_MUTATION,
        variables: {
          id: DiaryId,
          input: Diary,
        },
      });
      const updatedDiary = response.data.data.updateDiary.data;

      setDiaries((prevState) => {
        const newState = prevState.map((d) => {
          if (d.id === updatedDiary.id) {
            return updatedDiary;
          }
          return d;
        });
        return newState;
      });
      return updatedDiary;
    },
    [setDiaries]
  );


  // 删除日记
  const deleteDiary = useCallback(
    async (DiaryId) => {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: DELETE_DIARY_MUTATION,
        variables: {
          id: DiaryId,
        },
      });
      const deletedDiary = response.data.data.deleteDiary.data;
      setDiaries((prevState) => {
        const newState = prevState.filter((Diary) => Diary.id !== deletedDiary.id);
        return newState;
      });
      return deletedDiary;
    },
    [setDiaries]
  );

  return {
    DiarysStatus,
    diaries,
    setDiaries,
    getDiaries,
    createDiary,
    deleteDiary,
    updateDiary
  };
}
