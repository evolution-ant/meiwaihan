'use client';

import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import TablePagination, { tablePaginationClasses } from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import { ImageList } from '@mui/material';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ImageListItem from '@mui/material/ImageListItem';
import EmptyContent from 'src/components/empty-content';
import ImageSort from './image-sort';
import { useImage } from './hooks';

const ListItem = styled('div')(({ theme, selected }) => ({
  cursor: 'pointer',
  color: selected ? `white !important` : 'white',
  backgroundColor: selected ? `${theme.palette.primary.light} !important` : 'transparent',
  '&:hover': {
    color: `${theme.palette.grey[500]}`,
    backgroundColor: `${theme.palette.grey[200]}`,
  },
  borderRadius: '3px',
  paddingLeft: '5px',
  marginBottom: '5px',
}));

const IconLi = styled('li')(({ theme }) => ({
  listStyleType: 'none',
  '&::before': {
    content: '"<Iconify icon="eva:arrow-circle-down-fill" width={24} />"',
    marginRight: theme.spacing(1),
  },
  marginBottom: '5px',
}));

export default function ImagePicker({ open, handleClose, handleSelectImage }) {
  const { folders, getFolders, images, getImages } = useImage();
  const [sortBy, setSortBy] = useState('createdAt:desc');
  const [selectedFolderPath, setSelectedFolderPath] = useState('');
  const [page, setPage] = useState(0); // 默认页码为0
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [imagesToShow, setImagesToShow] = useState([]);
  const [filtersImage, setFiltersImage] = useState(images);

  useEffect(() => {
    getFolders();
  }, [getFolders]);

  useEffect(() => {
    getImages(sortBy);
  }, [getImages, sortBy]);

  useEffect(() => {
    // /8代表视频
    if (selectedFolderPath.includes('/8')) {
      // 去除 images 中 mime 为 video/mp4 的数据
      const newImages = images.filter((image) => image.mime.includes('video/mp4'));
      // image.folderPath 等于 selectedFolderPath
      const newFiltersImage = newImages.filter((image) => {
        const isEqual = image.folderPath === selectedFolderPath;
        // image.folderPath 包含 selectedFolderPath + "/"
        const include = image.folderPath.includes(`${selectedFolderPath}/`);
        return isEqual || include;
      });

      setFiltersImage(newFiltersImage);
      const newShowImages = newFiltersImage.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setImagesToShow(newShowImages);
    } else {
      const newImages = images.filter((image) => image.mime.includes('image/'));
      let newFiltersImage = newImages;
      if (selectedFolderPath) {
        newFiltersImage = newImages.filter((image) => {
          // image.folderPath 等于 selectedFolderPath
          const isEqual = image.folderPath === selectedFolderPath;
          // image.folderPath 包含 selectedFolderPath + "/"
          const include = image.folderPath.includes(`${selectedFolderPath}/`);
          return isEqual || include;
        });
      }
      setFiltersImage(newFiltersImage);
      const newShowImages = newFiltersImage.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
      setImagesToShow(newShowImages);
    }
  }, [images, selectedFolderPath, page, rowsPerPage]);

  const handleSortBy = useCallback((newSortBy) => {
    setSortBy(newSortBy);
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderFolders = (myFolders, idPrefix = '') => (
    <ul key={`ul-${idPrefix}`}>
      <ListItem
        selected={`${idPrefix}` === selectedFolderPath}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedFolderPath(`${idPrefix}`);
          console.log('selectedFolderPath:', idPrefix);
        }}
      >
        {/* Place the folder name here if it's for a top-level folder */}
        {idPrefix === '' && 'All Images'}
      </ListItem>
      {myFolders.map((folder, index) => (
        <IconLi key={`${folder.path}`}>
          <ListItem
            selected={`${folder.path}` === selectedFolderPath}
            onClick={(event) => {
              event.stopPropagation();
              setSelectedFolderPath(`${folder.path}`);
              console.log('selectedFolderPath:', folder.path);
            }}
          >
            {folder.name}
          </ListItem>
          {folder.children.length > 0 && renderFolders(folder.children, folder.path)}
        </IconLi>
      ))}
    </ul>
  );

  function renderContent() {
    if (selectedFolderPath.includes('/8')) {
      return (
        <Box width="100%" minWidth="1200px">
          <Grid container spacing={2}>
            {imagesToShow.map((media) => (
              <Grid item xs={12} sm={6} md={4}>
                <video
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  src={`${process.env.NEXT_PUBLIC_STRAPI}${media.url}`}
                  onClick={() => handleSelectImage(media)}
                  controls
                >
                  <track kind="captions" />
                </video>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    return (
      <Box width="100%" minWidth="1200px">
        <ImageList variant="masonry" cols={5} gap={8}>
          {imagesToShow.map((media) => (
            <ImageListItem key={media.id}>
              <Box
                onClick={() => handleSelectImage(media)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSelectImage(media);
                  }
                }}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_STRAPI}${media.url}?w=248&fit=crop&auto=format`}
                  srcSet={`${process.env.NEXT_PUBLIC_STRAPI}${media.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={media.url}
                  loading="lazy"
                  style={{
                    margin: '5px 0',
                    borderRadius: '10px',
                  }}
                />
              </Box>
              {media.caption ? (
                <ImageListItemBar
                  sx={{
                    background:
                      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
                      'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  }}
                  title={media.caption}
                  position="top"
                  actionPosition="left"
                />
              ): null}
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <DialogActions
        sx={{
          '& .MuiDialogActions-root': {
            padding: '2px',
            minHeight: 'unset',
            minWidth: 'unset',
          },
        }}
      >
        <ImageSort
          sort={sortBy}
          onSort={handleSortBy}
          sortOptions={[
            { value: 'createdAt:desc', label: 'Latest' },
            { value: 'createdAt:asc', label: 'Oldest' },
          ]}
        />
      </DialogActions>
      <Grid container spacing={2} style={{ maxWidth: '100%', overflowY: 'auto' }}>
        <Grid xs={2}>
          <Box sx={{ position: 'sticky', top: 18 }}>{renderFolders(folders)}</Box>
        </Grid>
        <Grid xs={10}>
          <DialogContent sx={{ pt: 5, height: '700px' }} style={{ overflowX: 'hidden' }}>
            {imagesToShow.length > 0 ? (
              renderContent()
            ) : (
              <Box width="100%">
                <EmptyContent
                  filled
                  title="No Data"
                  sx={{
                    width: '1500px',
                    height: '600px',
                  }}
                />{' '}
              </Box>
            )}
          </DialogContent>
        </Grid>
      </Grid>
      <DialogActions>
        <TablePagination
          count={filtersImage.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50, 100, 10000]}
          sx={{
            [`& .${tablePaginationClasses.toolbar}`]: {
              borderTopColor: 'transparent',
            },
          }}
        />
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

ImagePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSelectImage: PropTypes.func.isRequired,
};
