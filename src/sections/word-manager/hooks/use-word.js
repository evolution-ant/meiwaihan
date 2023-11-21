import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const WORDS_QUERY = `
query($page: Int!, $pageSize: Int!, $language:String, $type:String) {
    words(pagination: { page: $page, pageSize: $pageSize }, filters: {
      language:{
        eq: $language
      }
      type:{
        eq: $type
      }
    }) {
      data {
        id
        attributes {
          text
          translatedText
          language
          status
          type
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


export default function useWord() {
  const [words, setWords] = useState([]);

  const [wordsCount, setWordsCount] = useState(0);

  const [wordPagination, setWordPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const [wordsStatus, setWordsStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const handleSetWordsStatus = useCallback((name, value) => {
    setWordsStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);


  const getWords = useCallback(
    async (sort, filters) => {
      handleSetWordsStatus('loading', true);
      handleSetWordsStatus('empty', false);
      handleSetWordsStatus('error', null);

      console.log('filters', filters);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: WORDS_QUERY,
          variables: {
            page: wordPagination.page,
            pageSize: wordPagination.pageSize,
            sortParams: [sort],
            language: filters.language,
            type: filters.type,
            status: filters.status
          },
        });
        const fetchedWords = response.data.data.words.data;
        setWords(fetchedWords);
        console.log('fetchedWords', fetchedWords);
        // response.data.data.words.meta.pagination 中的 page 需要 -1
        const { pagination } = response.data.data.words.meta;
        setWordPagination({
          page: pagination.page,
          pageSize: pagination.pageSize,
          pageCount: pagination.pageCount,
          total: pagination.total,
        });
        setWordsCount(pagination.total);
        
        handleSetWordsStatus('loading', false);
        handleSetWordsStatus('empty', !response.data.words.length);
        handleSetWordsStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetWordsStatus('loading', false);
        handleSetWordsStatus('empty', false);
        handleSetWordsStatus('error', error);
      }
    },
    [handleSetWordsStatus, wordPagination.page, wordPagination.pageSize]
  );

  return {
    wordPagination,
    setWordPagination,
    //
    wordsStatus,
    //
    words,
    setWords,
    getWords,
    wordsCount,
  };
}
