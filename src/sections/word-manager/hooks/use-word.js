import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const WORDS_QUERY = `
query($page: Int!, $pageSize: Int!, $language:String, $type:String, $text:String) {
    words(pagination: { page: $page, pageSize: $pageSize }, filters: {
      language:{
        eq: $language
      }
      type:{
        eq: $type
      }
      text:{
        contains:$text
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

const UPDATE_WORD_STATUS_MUTATION = `
mutation ($id:ID!,$status:ENUM_WORD_STATUS){
    updateWord(id: $id, data: { status: $status }) {
      data {
        id
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
            status: filters.status,
            text: filters.text,
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

  const updateWordStatus = useCallback(
    async (id, status) => {
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: UPDATE_WORD_STATUS_MUTATION,
          variables: {
            id,
            status,
          },
        });
        const updatedWord = response.data.data.updateWordStatus;
        // setWords((prevState) => {
        //   const newState = [...prevState];
        //   const index = newState.findIndex((word) => word.id === updatedWord.id);
        //   newState[index] = updatedWord;
        //   return newState;
        // });
      } catch (error) {
        console.error(error);
      }
    },
    []
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
    updateWordStatus
  };
}
