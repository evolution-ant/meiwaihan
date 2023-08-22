import { useCallback, useState } from 'react';
// utils
import axios from 'src/utils/axios';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const USERS_QUERY = `
query getAllUsers{
    usersPermissionsUsers(sort:["id:desc"]){
        data{
        id,
        attributes{
          username
          avatar{
            data{
              attributes{
                url
              }
            }
          }
        }
      }
    }
  }
`;
const POSTS_QUERY = `
query getArticlesByFilter(
    $page: Int!
    $pageSize: Int!
    $sortParams: [String]
    $filters: ArticleFiltersInput
  ) {
    articles(
      pagination: { page: $page, pageSize: $pageSize }
      sort: $sortParams
      filters: $filters
    ) {
      data {
        id
        attributes {
          title
          description
          updatedAt
          tags{
            data{
            	attributes{
                name
              }
            }
          }
          author {
            data {
              attributes {
                avatar {
                  data {
                    attributes {
                      name
                      url
                    }
                  }
                }
              }
            }
          }
          thumb {
            data {
              attributes {
                url
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

const POST_SEARCH_QUERY = `
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

const POST_QUERY = `
query getArticleByID($id: ID!) {
    article(id:$id) {
      data {
        id
        attributes {
          title
          description
          content
          updatedAt
          tags {
            data {
              attributes {
                name
              }
            }
          }
          thumb {
            data {
              attributes {
                url
              }
            }
          }
          author{
            data{
              attributes{
                username
                avatar{
                  data{
                    attributes{
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const POST_TAGS_QUERY = `
query ArticleTags {
    articleTags(pagination: { page: 1, pageSize: 100}) {
      data {
        id
        attributes {
          name
          articles{
            data{
              id
            }
          }
        }
      }
    }
  }  
`;

const UPDATE_POST_MUTATION = `
mutation updateArticle($id:ID!,$content:String!){
    updateArticle(id:$id,data:{
          content:$content
    }){
      data{
        id
      }
    }
  }
`;

export default function useBlog() {
  const [users, setUsers] = useState([]);

  const [posts, setPosts] = useState([]);

  const [searchPosts, setSearchPosts] = useState([]);

  const [pagination, setPagination] = useState({});

  const [post, setPost] = useState(null);

  const [allPostTags, setPostTags] = useState(null);

  const [postsStatus, setPostsStatus] = useState({
    loading: false,
    empty: false,
    error: null,
  });

  const [postStatus, setPostStatus] = useState({
    loading: false,
    error: null,
  });

  const handleSetPostsStatus = useCallback((name, value) => {
    setPostsStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleSetPostStatus = useCallback((name, value) => {
    setPostStatus((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const getPostsSearch = useCallback(async (query) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: POST_SEARCH_QUERY,
        variables: { query },
      });
      const fetchedPosts = response.data.data.articles.data;
      setSearchPosts(fetchedPosts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const changeSearch = useCallback(
    (query) => {
      getPostsSearch(query);
    },
    [getPostsSearch]
  );

  function buildFilters({ tags, authorIds }) {
    const filters = {};

    if (tags && tags.length > 0) {
      filters.tags = { name: { in: tags } };
    }

    if (authorIds && authorIds.length > 0) {
      filters.author = { id: { in: authorIds } };
    }

    return filters;
  }

  const getPosts = useCallback(
    async (sort, page, filter) => {
      handleSetPostsStatus('loading', true);
      handleSetPostsStatus('empty', false);
      handleSetPostsStatus('error', null);

      const filters = buildFilters(filter);

      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: POSTS_QUERY,
          variables: { page, pageSize: 10, sortParams: [sort], filters },
        });
        const fetchedPosts = response.data.data.articles.data;

        setPosts(fetchedPosts);
        setPagination(response.data.data.articles.meta.pagination);
        handleSetPostsStatus('loading', false);
        handleSetPostsStatus('empty', !response.data.posts.length);
        handleSetPostsStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetPostsStatus('loading', false);
        handleSetPostsStatus('empty', false);
        handleSetPostsStatus('error', error);
      }
    },
    [handleSetPostsStatus]
  );

  const getPost = useCallback(
    async (id) => {
      handleSetPostStatus('loading', true);
      handleSetPostStatus('error', null);
      try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
          query: POST_QUERY,
          variables: { id },
        });
        console.log(response.data.data.article.data);
        const fetchedPost = response.data.data.article.data.attributes;
        console.log('fetchedPost:', fetchedPost);

        setPost(fetchedPost);
        handleSetPostStatus('loading', false);
        handleSetPostStatus('error', null);
      } catch (error) {
        console.error(error);
        handleSetPostStatus('loading', false);
        handleSetPostStatus('error', error);
      }
    },
    [handleSetPostStatus]
  );

  const updatePost = useCallback(async (id, content) => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: UPDATE_POST_MUTATION,
        variables: { id, content },
      });
      const update_id = response.data.data.updateArticle.data.id;
      console.log('update_id:', update_id);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getAllPostTags = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: POST_TAGS_QUERY,
      });
      const fetchedPostTags = response.data.data.articleTags.data;
      //   fetchedPostTags 按照 attributes.articles.data 的数量进行排序
      fetchedPostTags.sort(
        (a, b) => b.attributes.articles.data.length - a.attributes.articles.data.length
      );
      setPostTags(fetchedPostTags);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: USERS_QUERY,
      });
      const result = response.data.data.usersPermissionsUsers.data;
      const resultWithIntId = result.map((item) => ({
        ...item,
        id: parseInt(item.id, 10),
      }));
      setUsers(resultWithIntId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    pagination,
    //
    post,
    posts,
    //
    postsStatus,
    postStatus,
    //
    getPost,
    getPosts,
    //
    updatePost,
    //
    searchPosts,
    changeSearch,
    //
    allPostTags,
    getAllPostTags,
    //
    users,
    getUsers,
  };
}
