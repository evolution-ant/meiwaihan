'use client'

import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Image from 'src/components/image';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';


import ImagePicker from './image-picker'; // 导入新的图片选择组件

export default function ImageView() {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectImage = (img) => {
    setSelectedImage(img);
    handleClose();
  };

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Image"
            links={[
              {
                name: 'Components',
                href: paths.components,
              },
              { name: 'Image' },
            ]}
          />
        </Container>
      </Box>

      <Container sx={{ my: 10 }}>
        <Stack spacing={2}>
          <Button variant="outlined" onClick={handleClickOpen}>
            Open Image Select Dialog
          </Button>
          <ImagePicker open={open} handleClose={handleClose} handleSelectImage={handleSelectImage} />
          {selectedImage && (
            <Card>
              <Image src={selectedImage.url} alt={selectedImage.id} />
            </Card>
          )}
        </Stack>
      </Container>
    </>
  );
}
