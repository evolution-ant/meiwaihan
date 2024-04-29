import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const WORDS_QUERY = `
query($sortParams:[String], $page: Int!, $pageSize: Int!, $filters: WordFiltersInput!) {
    words(pagination: { page: $page, pageSize: $pageSize }, filters: $filters, sort:$sortParams) {
      data {
        id
        attributes {
          text
          phonetic
          translatedText
          explanation
          origin
          sourceSentence
          translationSentence
          language
          status
          type
          word_topic{
            data{
              attributes{
                name
              }
            }
          }
          image{
            data{
                attributes{
                    hash
                    ext
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

const UPDATE_WORD_STATUS_MUTATION = `
mutation ($id:ID!,$status:ENUM_WORD_STATUS){
    updateWord(id: $id, data: { status: $status }) {
      data {
        id
      }
    }
  }  
`;

const buildFilters = (filters) => {
  const { language, status, type, topic, text } = filters;
  const filtersObj = {};
  if (language) {
    filtersObj.language = {
      eq: language,
    };
  }
  if (status && status !== 'all') {
    filtersObj.status = {
      eq: status,
    };
  }
  if (type) {
    filtersObj.type = {
      eq: type,
    };
  }
  if (topic) {
    filtersObj.word_topic = {
      name: {
        eq: topic,
      },
    };
  }
  if (text) {
    filtersObj.text = {
      contains: text,
    };
  }
  return filtersObj;
};

export default function useWord() {
  const [words, setWords] = useState([]);

  const [wordTopics, setWordTopics] = useState([]);

  const [wordsCount, setWordsCount] = useState(0);

  const [wordPagination, setWordPagination] = useState({
    page: 1,
    pageSize: 1,
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

  const getWordTopics = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: `
            query {
                wordTopics (pagination:{
                    page:1,
                    pageSize:100
                  }) {
                    data {
                        id
                        attributes {
                            name
                        }
                    }
                }
            }
            `,
      });
      const fetchedWordTopics = response.data.data.wordTopics.data.map(
        (topic) => topic.attributes.name
      );
      setWordTopics(fetchedWordTopics);
    } catch (error) {
      console.error(error);
    }
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
            filters: buildFilters(filters),
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

  const updateWordStatus = useCallback(async (id, status) => {
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
  }, []);

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
    updateWordStatus,
    wordTopics,
    getWordTopics,
  };
}
