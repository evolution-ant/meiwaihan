import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const CODES_QUERY = `
query Code(
    $page: Int!
    $pageSize: Int!
    $sortParams: [String!]
    $filters: CodeFiltersInput!
  ) {
    codes(
      pagination: { page: $page, pageSize: $pageSize }
      sort: $sortParams
      filters: $filters
    ) {
      data {
        id
        attributes {
          title
          content
          remark
          isFavorited
          tags {
            data {
              id
              attributes {
                name
              }
            }
          }
          language
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

const CODE_TAGS_QUERY = `
query CodeTags {
    codeTags(pagination: { page: 1, pageSize: 1000 }) {
      data {
        id
        attributes {
          name
          codes {
            data {
              id
            }
          }
        }
      }
    }
  }  
`;

const UPDATE_CODE_MUTATION = `
mutation UpdateCode($id: ID!, $input: CodeInput!) {
    updateCode(id: $id, data: $input) {
      data {
        id
        attributes {
          title
          content
          remark
          language
          tags {
            data {
              id
              attributes {
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

const CREATE_CODE_MUTATION = `
mutation CreateCode($input:CodeInput!){
    createCode(data:$input){
      data{
        id
        attributes{
          title
          content
          remark
          language
          tags{
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

const DELETE_CODE_MUTATION = `
mutation DeleteCode($id:ID!){
    deleteCode(id:$id){
      data{
        id
      }
    }
  }
`;

export default function useCode() {
  const [codes, setCodes] = useState([]);

  const [codesCount, setCodesCount] = useState(0);

  const [codeTags, setCodeTags] = useState([]);

  const [codePagination, setCodePagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [codesStatus, setCodesStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const handleSetCodesStatus = useCallback((name, value) => {
    setCodesStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  function buildFilters({ title, tags, topics, language, isFavorited }) {
    const filters = {};

    if (tags && tags.length > 0) {
      filters.tags = { name: { in: tags } };
    }

    if (topics && topics.length > 0) {
      filters.topics = { name: { in: topics } };
    }

    if (title) {
      filters.title = { contains: title };
    }

    if (language) {
      filters.language = { eq: language };
    }

    if (isFavorited !== null) {
      filters.isFavorited = { eq: isFavorited };
    }

    return filters;
  }

  const getCodes = useCallback(
    async (sort, filters) => {
      handleSetCodesStatus('loading', true);
      handleSetCodesStatus('empty', false);
      handleSetCodesStatus('error', null);

      filters = buildFilters(filters);

      console.log('filters', filters);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: CODES_QUERY,
          variables: {
            page: codePagination.page,
            pageSize: codePagination.pageSize,
            sortParams: [sort],
            filters,
          },
        });
        const fetchedCodes = response.data.data.codes.data;
        console.log('fetchedCodes', fetchedCodes);
        // 把 tags 的数据结构转换成 {id:label} 的结构
        fetchedCodes.forEach((code) => {
          code.attributes.tags.data = code.attributes.tags.data.map((tag) => ({
            id: tag.id,
            label: tag.attributes.name,
          }));
        });

        setCodes(fetchedCodes);

        console.log('fetchedCodes', fetchedCodes);
        // response.data.data.codes.meta.pagination 中的 page 需要 -1
        const { pagination } = response.data.data.codes.meta;
        setCodePagination({
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
        });
        setCodesCount(pagination.total);
        
        handleSetCodesStatus('loading', false);
        handleSetCodesStatus('empty', !response.data.codes.length);
        handleSetCodesStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetCodesStatus('loading', false);
        handleSetCodesStatus('empty', false);
        handleSetCodesStatus('error', error);
      }
    },
    [handleSetCodesStatus, codePagination.page, codePagination.pageSize]
  );

  const getCodeTags = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CODE_TAGS_QUERY,
      });
      const fetchedCodeTags = response.data.data.codeTags.data;
      // 按照 fetchedCodeTags 按照 attributes.codes.data 的数量进行排序
      fetchedCodeTags.sort(
        (a, b) => b.attributes.codes.data.length - a.attributes.codes.data.length
      );

      setCodeTags(fetchedCodeTags);
    } catch (error) {
      console.error(error);
    }
  }, [setCodeTags]);

  const updateCode = useCallback(async (item) => {
    try {
      console.log('update item', item);
      const input = {
        title: item.title,
        content: item.content,
        remark: item.remark,
        language: item.language,
        tags: item.tags.map((tag) => tag.id),
        isFavorited: item.isFavorited,
      };
      console.log('input', input);
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_CODE_MUTATION,
        variables: { id: item.id, input },
      });
      const updatedItem = response.data.data.updateCode.data;
      // 把 tags 的数据结构转换成 {id:label} 的结构
      updatedItem.attributes.tags.data = updatedItem.attributes.tags.data.map((tag) => ({
        id: tag.id,
        label: tag.attributes.name,
      }));
      return updatedItem;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const updateCodeFavorited = useCallback(async (id, isFavorited) => {
    try {
      const input = {
        isFavorited,
      };
      console.log('input', input);
      await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_CODE_MUTATION,
        variables: { id, input },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createCode = useCallback(async (item) => {
    try {
      const input = {
        title: item.title,
        content: item.content,
        remark: item.remark,
        tags: item.tags.map((tag) => tag.id),
        isFavorited: item.isFavorited,
        language: item.language ? item.language : 'txt',
      };
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: CREATE_CODE_MUTATION,
        variables: { input },
      });
      const createdItem = response.data.data.createCode.data;
      // 把 tags 的数据结构转换成 {id:label} 的结构
      createdItem.attributes.tags.data = createdItem.attributes.tags.data.map((tag) => ({
        id: tag.id,
        label: tag.attributes.name,
      }));
      return createdItem;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  const deleteCode = useCallback(async (id) => {
    console.log('delete id', id);
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: DELETE_CODE_MUTATION,
        variables: { id },
      });
      const deleteID = response.data.data.deleteCode.data.id;
      return deleteID;
    } catch (error) {
      console.error(error);
      return null;
    }
  }, []);

  return {
    codePagination,
    setCodePagination,
    //
    codesStatus,
    //
    codes,
    setCodes,
    getCodes,
    codesCount,
    //
    codeTags,
    getCodeTags,
    //
    updateCode,
    createCode,
    deleteCode,
    updateCodeFavorited,
  };
}
