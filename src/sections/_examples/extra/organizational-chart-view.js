'use client';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
// _mock
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import OrganizationalChart from 'src/components/organizational-chart';
//
import ComponentBlock from '../component-block';

// ----------------------------------------------------------------------

export default function OrganizationalChartView() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          py: 5,
          bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
        }}
      >
        <Container>
          <CustomBreadcrumbs
            heading="Organizational Chart"
            links={[
              { name: 'Components', href: paths.components },
              { name: 'Organizational Chart' },
            ]}
          />
        </Container>
      </Box>

      <Box sx={{ my: 10 }}>
      <Stack spacing={5}>
      <ComponentBlock title="By Standard" sx={{ overflowX: 'scroll' }}>
      <Box sx={{ width: '100%' }}>
              <OrganizationalChart data={POOR_DATA} variant="simple" lineHeight="40px" />
            </Box>
      </ComponentBlock>
      </Stack>
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

const POOR_DATA = {
  name: 'tasha mcneill',
  children: [
    {
      name: 'product design',
      children: [
        {
          name: 'john stone',
          children: [
            {
              name: 'rimsha wynn',
            },
          ],
        },
      ],
    },
    {
      name: 'development',
      children: [
        {
          name: 'ponnappa priya',
          children: [
            {
              name: 'tyra elliott',
              children: [
                {
                  name: 'sheridan mckee',
                  children: [
                    {
                      name: 'ang li',
                    },
                  ],
                },
                {
                  name: 'hope ahmad',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'marketing',
      children: [
        {
          name: 'peter stanbridge',
          children: [
            {
              name: 'madeline harding',
            },
            {
              name: 'eoin medrano',
            },
          ],
        },
      ],
    },
  ],
};
