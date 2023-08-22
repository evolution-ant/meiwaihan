import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const MINDS_QUERY = `
query getMindByFilter(
    $page: Int!
    $pageSize: Int!
    $sortParams: [String]
    $filters: MindFiltersInput
  ) {
    minds(
      pagination: { page: $page, pageSize: $pageSize }
      sort: $sortParams
      filters: $filters
    ) {
      data {
        id
        attributes {
          title
          content
          tags{
            data{
              attributes{
                name
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          pageSize
          pageCount
          total
        }
      }
    }
  }  
`;

const MIND_SEARCH_QUERY = `
query getArticleSearch($query: String!) {
    articles(filters: { title: { contains: $query } }) {
      data {
        id
        attributes {
          title
          thumb {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }  
`;

const MIND_QUERY = `
query getMindByID($id: ID!) {
    mind(id:$id) {
      data {
        id
        attributes {
          title
          content
          updatedAt
          tags {
            data {
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

const MIND_TAGS_QUERY = `
query getAllMindTags{
    mindTags{
      data{
        attributes{
          name
        }
      }
    }
  }
`;

const UPDATE_MIND_MUTATION = `
mutation updateMind($id: ID!, $data: MindInput!) {
    updateMind(id: $id, data: $data) {
      data {
        id
      }
    }
  }  
`;

const CREATE_MIND_MUTATION = `
mutation createMind($data:MindInput!){
    createMind(data:$data){
      data{
        id
      }
    }
  }
`;

export default function useMind() {
  const [minds, setMinds] = useState([]);

  const [searchMinds, setSearchMinds] = useState([]);

  const [pagination, setPagination] = useState({});

  const [mind, setMind] = useState(null);

  const [allMindTags, setMindTags] = useState(null);

  const [mindsStatus, setMindsStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const [mindStatus, setMindStatus] = useState({
    loading: false,
    error: null,
  });

  const handleSetMindsStatus = useCallback((name, value) => {
    setMindsStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSetMindStatus = useCallback((name, value) => {
    setMindStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const getMindsSearch = useCallback(async (query) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: MIND_SEARCH_QUERY,
        variables: { query },
      });
      const fetchedMinds = response.data.data.minds.data;
      setSearchMinds(fetchedMinds);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const changeSearch = useCallback(
    (query) => {
      getMindsSearch(query);
    },
    [getMindsSearch]
  );

  function buildFilters({ tags }) {
    const filters = {};

    if (tags && tags.length > 0) {
      filters.tags = { name: { in: tags } };
    }

    return filters;
  }

  const getMinds = useCallback(
    async (sort, page, filter) => {
      handleSetMindsStatus('loading', true);
      handleSetMindsStatus('empty', false);
      handleSetMindsStatus('error', null);

      const filters = buildFilters(filter);
      console.log('fetchedMinds filter:', { page, pageSize: 10, sortParams: [sort], filters });

      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: MINDS_QUERY,
          variables: { page, pageSize: 10, sortParams: [sort], filters },
        });
        console.log('fetchedMinds response:', response);
        const fetchedMinds = response.data.data.minds.data;
        setMinds(fetchedMinds);
        setPagination(response.data.data.minds.meta.pagination);
        console.log('fetchedMinds:', fetchedMinds);
        handleSetMindsStatus('loading', false);
        handleSetMindsStatus('empty', !response.data.posts.length);
        handleSetMindsStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetMindsStatus('loading', false);
        handleSetMindsStatus('empty', false);
        handleSetMindsStatus('error', error);
      }
    },
    [handleSetMindsStatus]
  );

  const getMind = useCallback(
    async (id) => {
      handleSetMindStatus('loading', true);
      handleSetMindStatus('error', null);
      console.log('fetchedMind id:', id);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: MIND_QUERY,
          variables: { id },
        });
        console.log('response :', response);

        const fetchedMind = response.data.data.mind.data.attributes;
        console.log('fetchedMind:', fetchedMind);

        setMind(fetchedMind);
        handleSetMindStatus('loading', false);
        handleSetMindStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetMindStatus('loading', false);
        handleSetMindStatus('error', error);
      }
    },
    [handleSetMindStatus]
  );

  const createMind = useCallback(async (data) => {
    try {
        console.log('createMind data:', data);
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CREATE_MIND_MUTATION,
        variables: { data },
      });
      const create_id = response.data.data.createMind.data.id;
      console.log('create_id:', create_id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateMind = useCallback(async (id,data) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_MIND_MUTATION,
        variables: { id,data },
      });
      const update_id = response.data.data.updateMind.data.id;
      console.log('update_id:', update_id);
      return update_id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const getAllMindTags = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: MIND_TAGS_QUERY,
      });
      const fetchedMindTags = response.data.data.mindTags.data;
      setMindTags(fetchedMindTags);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    pagination,
    //
    mind,
    minds,
    //
    mindsStatus,
    mindStatus,
    //
    getMind,
    getMinds,
    //
    createMind,
    updateMind,
    //
    searchMinds,
    changeSearch,
    //
    allMindTags,
    getAllMindTags,
  };
}
