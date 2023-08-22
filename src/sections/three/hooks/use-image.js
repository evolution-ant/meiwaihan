import { useCallback, useState } from 'react';
// utils
import axios from 'axios';
import { HOST_API } from 'src/config-global';
import { convertFolderTree } from 'src/utils/convert-folder-tree';

// ----------------------------------------------------------------------
// 定义GraphQL查询

const FOLDERS_QUERY = `
query getUploadFolders($pagination:PaginationArg){
    uploadFolders(pagination:$pagination){
      data{
        id
        attributes{
          name
          path
      }
    }
  }
}
`;

const IMAGES_QUERY = `
query getUploadFile(
    $pagination: PaginationArg!
    $sortParams: [String]
  ) {
    uploadFiles(pagination: $pagination,sort: $sortParams) {
      data {
        attributes {
          url
          folderPath
          createdAt
          mime
          caption
        }
      }
    }
  }  
`;

export default function useImage() {
  const [folders, setFolders] = useState([]);

  const [images, setImages] = useState([]);

  const getFolders = useCallback(async () => {
    try {
      //   给 axios header 添加 token
      const axiosInstance = axios.create({
        baseURL: HOST_API,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });
      const response = await axiosInstance.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: FOLDERS_QUERY,
        variables: {
            "pagination": {
              "page":1,
              "pageSize":100
            }
          }
      });
      const fetchedFolders = response.data.data.uploadFolders.data;

      console.log('fetchedFolders', fetchedFolders);
      const convertedFolders = convertFolderTree(fetchedFolders);
      console.log('convertedFolders', convertedFolders);
      setFolders(convertedFolders);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getImages = useCallback(async (sort) => {
    try {
      //   给 axios header 添加 token
      const axiosInstance = axios.create({
        baseURL: HOST_API,
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });
      const response = await axiosInstance.post(process.env.NEXT_PUBLIC_GRAPHQL_API, {
        query: IMAGES_QUERY,
        variables: {
          pagination: {
            page: 1,
            pageSize: 1000,
          },
          sortParams:[sort],
        },
      });
      const fetchedImages = response.data.data.uploadFiles.data;
      console.log('fetchedImages', fetchedImages);
      const convertedImages = fetchedImages.map((image) => ({
        url: image.attributes.url,
        folderPath: image.attributes.folderPath,
        createdAt: image.attributes.createdAt,
        mime: image.attributes.mime,
        caption: image.attributes.caption,
      }));
      console.log('convertedImages', convertedImages);
      setImages(convertedImages);
    } catch (error) {
      console.error(error);
    }
  }, []);

  return {
    //
    folders,
    getFolders,
    //
    images,
    getImages,
  };
}
