'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Tabs,
  Tab,
  Unstable_Grid2 as Grid,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CompaniesList } from '@/components/companies/companies-list';
import { paths } from '@/paths';
import { useCompanies } from '@/hooks/super-admin/use-companies';
import ErrorMessage from '@/components/common/error-message';

const Page = () => {
  const { t } = useTranslation('superAdmin');
  const [tabValue, setTabValue] = useState(0);
  const { data: companies = [], isLoading, error, refetch } = useCompanies();
  
  const activeCompanies = companies.filter((company) => company.is_active);
  const inactiveCompanies = companies.filter((company) => !company.is_active);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">
                {t('page_titles.companies')}
              </Typography>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Button
                  color="inherit"
                  component={Link}
                  href={paths.superAdmin.dashboard}
                  size="small"
                >
                  {t('page_titles.dashboard')}
                </Button>
                <Box
                  sx={{
                    backgroundColor: 'text.primary',
                    borderRadius: '50%',
                    height: 4,
                    width: 4
                  }}
                />
                <Typography color="text.secondary" variant="body2">
                  {t('page_titles.companies')}
                </Typography>
              </Stack>
            </Stack>
            <Button
              component={Link}
              href={`${paths.superAdmin.companies}/create`}
              startIcon={
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              }
              variant="contained"
            >
              {t('companies.add')}
            </Button>
          </Stack>
          
          <Card>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label={t('companies.all')} />
              <Tab label={t('companies.active')} />
              <Tab label={t('companies.inactive')} />
            </Tabs>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box sx={{ p: 3 }}>
                <ErrorMessage 
                  error={error} 
                  title={t('companies.failed_to_load')} 
                  onRetry={refetch} 
                />
              </Box>
            ) : (
              <Box>
                {tabValue === 0 && <CompaniesList companies={companies} />}
                {tabValue === 1 && <CompaniesList companies={activeCompanies} />}
                {tabValue === 2 && <CompaniesList companies={inactiveCompanies} />}
              </Box>
            )}
          </Card>
        </Stack>
      </Container>
    </Box>
  );
};

export default Page; 