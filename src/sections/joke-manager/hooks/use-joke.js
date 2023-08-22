import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const JOKES_QUERY = `
query Jokes(
    $page: Int!
    $pageSize: Int!
    $sortParams: [String!]
    $filters: JokeFiltersInput
  ) {
    jokes(
      pagination: { page: $page, pageSize: $pageSize }
      sort: $sortParams
      filters: $filters
    ) {
      data {
        id
        attributes {
          content
          remark
          isFavorited
            type{
                data{
                    id
                    attributes{
                        name
                    }
                }
            }
          tags {
            data {
              id
              attributes {
                name
              }
            }
          }
          topics {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
      meta{
        pagination{
          page
          pageSize
          pageCount
          total
        }
      }
    }
  }  
`;

const JOKE_TAGS_QUERY = `
query JokeTags {
    jokeTags(pagination: { page: 1, pageSize: 100}) {
      data {
        id
        attributes {
          name
          jokes{
            data{
              id
            }
          }
        }
      }
    }
  }  
`;

const JOKE_TOPICS_QUERY = `
query JokeTopics {
    jokeTopics(pagination: { page: 1, pageSize: 100}) {
      data {
        id
        attributes {
          name
          jokes{
            data{
              id
            }
          }
        }
      }
    }
  }  
`;

const JOKE_TYPES_QUERY = `
query jokeType{
    jokeTypes(pagination: { page: 1, pageSize: 100}){
      data{
        id
        attributes{
          name
          jokes{
            data{
              id
            }
          }
        }
      }
    }
  }
`;

const UPDATE_JOKE_MUTATION = `
mutation UpdateJoke($id: ID!, $input: JokeInput!) {
    updateJoke(id: $id, data: $input) {
        data{
            id
        }
    }
}
`;

const CREATE_JOKE_MUTATION = `
mutation CreateJoke($input:JokeInput!){
    createJoke(data:$input){
      data{
        id
        attributes{
          content
          remark
          type{
            data{
                id
                attributes{
                    name
                }
            }
            }
          tags{
            data{
              id
              attributes{
                name
              }
            }
          }
          topics{
            data{
              id
              attributes{
                name
              }
            }
          }
          isFavorited
        }
      }
    }
  }
`;

const DELETE_JOKE_MUTATION = `
mutation DeleteJoke($id:ID!){
    deleteJoke(id:$id){
      data{
        id
      }
    }
  }
`;

export default function useJoke() {
  const [jokes, setJokes] = useState([]);

  const [jokesCount, setJokesCount] = useState(0);

  const [jokeTags, setJokeTags] = useState([]);

  const [jokeTopics, setJokeTopics] = useState([]);

  const [jokeTypes, setJokeTypes] = useState([]);

  const [jokePagination, setJokePagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [jokesStatus, setJokesStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const handleSetJokesStatus = useCallback((name, value) => {
    setJokesStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  function buildFilters({ content, tags, topics, type, isFavorited }) {
    const filters = { isMine: { eq: false } };

    if (tags && tags.length > 0) {
      filters.tags = { name: { in: tags } };
    }

    if (topics && topics.length > 0) {
      filters.topics = { name: { in: topics } };
    }

    if (type) {
      filters.type = { name: { eq: type } };
    }

    if (isFavorited != null) {
      filters.isFavorited = { eq: isFavorited };
    }

    if (content) {
      filters.content = { contains: content };
    }

    return filters;
  }

  const getJokes = useCallback(
    async (sortParams, filters) => {
      handleSetJokesStatus('loading', true);
      handleSetJokesStatus('empty', false);
      handleSetJokesStatus('error', null);

      filters = buildFilters(filters);

      console.log('filters', filters);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: JOKES_QUERY,
          variables: {
            page: jokePagination.page,
            pageSize: jokePagination.pageSize,
            sortParams,
            filters,
          },
        });
        const fetchedJokes = response.data.data.jokes.data;

        console.log('fetchedJokes', fetchedJokes);
        // 把 tags 和 topics 的数据结构转换成 {id:label} 的结构
        fetchedJokes.forEach((joke) => {
          joke.attributes.tags.data = joke.attributes.tags.data.map((tag) => ({
            id: tag.id,
            label: tag.attributes.name,
          }));
          joke.attributes.topics.data = joke.attributes.topics.data.map((topic) => ({
            id: topic.id,
            label: topic.attributes.name,
          }));
          if (joke.attributes.type.data) {
            joke.attributes.type.data = {
              id: joke.attributes.type.data.id,
              label: joke.attributes.type.data.attributes.name,
            };
          } else {
            joke.attributes.type.data = {
              id: 7,
              label: '默认',
            };
          }
        });

        setJokesCount(response.data.data.jokes.meta.pagination.total);
        setJokes(fetchedJokes);

        // response.data.data.jokes.meta.pagination 中的 page 需要 -1
        const { pagination } = response.data.data.jokes.meta;
        setJokePagination({
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
        });
        handleSetJokesStatus('loading', false);
        handleSetJokesStatus('empty', !response.data.jokes.length);
        handleSetJokesStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetJokesStatus('loading', false);
        handleSetJokesStatus('empty', false);
        handleSetJokesStatus('error', error);
      }
    },
    [handleSetJokesStatus, jokePagination.page, jokePagination.pageSize]
  );

  const getJokeTags = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: JOKE_TAGS_QUERY,
      });
      const fetchedJokeTags = response.data.data.jokeTags.data;
      //   fetchedJokeTags 按照 attributes.jokes.data 的数量进行排序
      fetchedJokeTags.sort(
        (a, b) => b.attributes.jokes.data.length - a.attributes.jokes.data.length
      );
      setJokeTags(fetchedJokeTags);
    } catch (error) {
      console.error(error);
    }
  }, [setJokeTags]);

  const getJokeTopics = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: JOKE_TOPICS_QUERY,
      });
      const fetchedJokeTopics = response.data.data.jokeTopics.data;
      //   fetchedJokeTopics 按照 attributes.jokes.data 的数量进行排序
      fetchedJokeTopics.sort(
        (a, b) => b.attributes.jokes.data.length - a.attributes.jokes.data.length
      );
      setJokeTopics(fetchedJokeTopics);
    } catch (error) {
      console.error(error);
    }
  }, [setJokeTopics]);

  const getJokeTypes = useCallback(async () => {
    try {
      console.log('fetchedJokeTypes');
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: JOKE_TYPES_QUERY,
      });
      console.log('fetchedJokeTypes', response);
      const fetchedJokeTypes = response.data.data.jokeTypes.data;
      //   fetchedJokeTopics 按照 attributes.jokes.data 的数量进行排序
      fetchedJokeTypes.sort(
        (a, b) => b.attributes.jokes.data.length - a.attributes.jokes.data.length
      );
      console.log('fetchedJokeTypes', fetchedJokeTypes);
      setJokeTypes(fetchedJokeTypes);
    } catch (error) {
      console.error(error);
    }
  }, [setJokeTypes]);

  const updateJoke = useCallback(async (item) => {
    try {
      const input = {
        content: item.attributes.content,
        remark: item.attributes.remark,
        type: item.attributes.type.data.id,
        tags: item.attributes.tags.data.map((tag) => tag.id),
        topics: item.attributes.topics.data.map((topic) => topic.id),
        isFavorited: item.attributes.isFavorited,
      };
      console.log('input', input);
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_JOKE_MUTATION,
        variables: { id: item.id, input },
      });
      console.log('response', response);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createJoke = useCallback(async (item) => {
    try {
      const input = {
        content: item.content,
        remark: item.remark,
        type: item.type?.id||7,
        tags: item.tags.map((tag) => tag.id),
        topics: item.topics.map((topic) => topic.id),
        isFavorited: item.isFavorited,
      };
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CREATE_JOKE_MUTATION,
        variables: { input },
      });
      const createdItem = response.data.data.createJoke.data;
      //   转换 tags 和 topics 的数据结构
      createdItem.attributes.tags.data = createdItem.attributes.tags.data.map((tag) => ({
        id: tag.id,
        label: tag.attributes.name,
      }));
      createdItem.attributes.topics.data = createdItem.attributes.topics.data.map((topic) => ({
        id: topic.id,
        label: topic.attributes.name,
      }));
      if (createdItem.attributes.type.data) {
        createdItem.attributes.type.data = {
          id: createdItem.attributes.type.data.id,
          label: createdItem.attributes.type.data.attributes.name,
        };
      } else {
        createdItem.attributes.type.data = {
          id: 7,
          label: '默认',
        };
      }
      return createdItem;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const deleteJoke = useCallback(async (id) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: DELETE_JOKE_MUTATION,
        variables: { id },
      });
      const deleteID = response.data.data.deleteJoke.data.id;
      return deleteID;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  return {
    jokePagination,
    setJokePagination,
    //
    jokesStatus,
    //
    jokes,
    jokesCount,
    setJokes,
    getJokes,
    //
    jokeTags,
    getJokeTags,
    //
    jokeTopics,
    getJokeTopics,
    //
    jokeTypes,
    getJokeTypes,
    //
    updateJoke,
    createJoke,
    deleteJoke,
  };
}
