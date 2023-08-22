'use client';

import { useEffect, useCallback, useState } from 'react';

import { paths } from 'src/routes/paths';
// @mui
import Container from '@mui/material/Container';
// routes
import { useParams } from 'src/routes/hook';
import MindMap from 'src/components/organizational-chart/mind-map';
import MindEditToolbar from '../mind-edit-toolbar';
// hooks
import { useMind } from '../hooks';

// ----------------------------------------------------------------------
export default function MindEditView() {
  const params = useParams();
  const { id } = params;
  const { mind, getMind, createMind, updateMind } = useMind();

  const [currentTitle,setCurrentTitle] = useState('');
  const [currentContent,setCurrentContent] = useState('');

  useEffect(() => {
    if (id) {
      getMind(id);
    }
  }, [getMind, id]);

  const handleSave = useCallback(
    (data) => {
      if (
        currentContent === null ||
        currentContent === '' ||
        currentContent === undefined ||
        currentTitle === null ||
        currentTitle === '' ||
        currentTitle === undefined
      ) {
        return;
      }
      console.log('handleSave currentContent:', currentContent);
      console.log('handleSave currentTitle:', currentTitle);
      if (id) {
        updateMind(id, {
          title: currentTitle,
          content: currentContent,
        });
      } else {
        createMind({
          title: currentTitle,
          content: currentContent,
        });
      }
    },
    [id, createMind, updateMind, currentTitle, currentContent]
  );

  const handleDataChange = useCallback(
    (data) => {
      console.log('handleDataChange:', data);
      setCurrentContent(data);
    //   currentTitle = JSON.parse(data)?.nodeData?.topic;
      setCurrentTitle(JSON.parse(data)?.nodeData?.topic);
      if (id) {
        updateMind(id, {
          title: currentTitle,
          content: currentContent,
        });
      }
    },
    [currentTitle, currentContent, id, updateMind]
  );

  return (
    <Container maxWidth={false}>
      <MindEditToolbar onSaved={handleSave} backLink={paths.dashboard.mind.root} />
      {(mind || !id) && <MindMap initialData={mind?.content} onDataChange={handleDataChange} />}
    </Container>
  );
}
