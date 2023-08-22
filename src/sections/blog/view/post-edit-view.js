'use client';

// 导入你的依赖
import React, { useEffect, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { Container } from '@mui/material';
import PostEditToolbar from '../post-edit-toolbar';
import BalloonEditor from './ckeditor';
import './ckeditor-dark-theme.css';
import { useBlog } from '../hooks';

export default function PostEditView() {
  const params = useParams();
  const { id } = params;
  const { post, getPost, updatePost } = useBlog();
  const [unsavedData, setUnsavedData] = useState('');
  const [changedContent, setChangedContent] = useState('');

  useEffect(() => {
    if (id) {
      getPost(id);
    }
  }, [getPost, id]);

  // 检查是否有未保存的更改，如果有，则每隔60秒自动保存
  useEffect(() => {
    if (unsavedData) {
      const saveTimer = setTimeout(() => {
        updatePost(id, unsavedData);
        console.log('Auto saved:', unsavedData);
        setUnsavedData('');
      }, 3 * 1000);
      clearTimeout(saveTimer);
    }
  }, [unsavedData, id, updatePost]);

  const [html, setHtml] = useState('');
  useEffect(() => {
    if (post) {
      console.log('post:', post);
      setHtml(post?.content);
    }
  }, [post]);

  return (
    <>
      <PostEditToolbar
        sx={{ position: 'sticky', top: 18 }}
        backLink={paths.dashboard.blog.details(id)}
        onSave={() => {
          updatePost(id, changedContent);
          console.log('Saved:', changedContent);
          setUnsavedData('');
        }}
      />
      <Container sx={{ width: '60%' }}>
        <CKEditor
          editor={BalloonEditor}
          data={html}
          config={{
            simpleUpload: {
              uploadUrl: `${process.env.NEXT_PUBLIC_HOST_API  }/upload`,
              headers: {
                'X-CSRF-TOKEN': 'CSRF-Token',
                Authorization:
                  'Bearer 2eb726a6ffbfbe2ec8c6de1cee0288f24c3a5a6590bae3abd001a7385ec52f907011b369d44581d41bda8e56269516174a4ed516c849210a02895529364db0ead6ba3ae6e215218d9d8a1b33eccee5e40f6abfb4e8cb87502781207d6e9b3d0a251dbabc276d92228aa5f586a0ae0e859875154213fb6c5c49aafbb0fd2cbe11',
              },
            },
          }}
          autosave={(editor) => {
            console.log('The editor is ready to use!', editor.getData());
          }}
          onReady={(editor) => {
            console.log('Editor is ready to use!', editor);
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            console.log('data changed:', data);
            setUnsavedData(data);
            setChangedContent(data);
            const count = editor.plugins.get('WordCount');
            console.log('count:', count);
          }}
          onBlur={(event, editor) => {}}
          onFocus={(event, editor) => {}}
          on
        />
      </Container>
    </>
  );
}
