'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
  Chip,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

import { useCompanyActivityLogs } from '@/hooks/admin/use-activity-logs';
import { useStore } from '@/providers/store-provider';
import { useCurrentUser } from '@/hooks/use-auth';

export default function ActivityLogsPage() {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { userInfo } = useCurrentUser();
  const companyId = userInfo?.company_id;
  const { data: activityLogs, isLoading, error } = useCompanyActivityLogs(companyId);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Filter logs based on search term
  const filteredLogs = activityLogs?.filter(log => {
    const searchLower = searchTerm.toLowerCase();
    return (
      log.user_email.toLowerCase().includes(searchLower) ||
      log.action.toLowerCase().includes(searchLower) ||
      log.description.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Apply pagination
  const paginatedLogs = filteredLogs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Function to get action color based on the action type
  const getActionChipColor = (action: string) => {
    if (action.includes('create') || action.includes('add')) return 'success';
    if (action.includes('delete') || action.includes('remove')) return 'error';
    if (action.includes('update') || action.includes('edit')) return 'warning';
    return 'default';
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Stack spacing={1}>
              <Typography variant="h4">
                {t('navigation.activity_logs')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('activity_logs.description', 'View system activity logs and user actions')}
              </Typography>
              {companyId && (
                <Typography variant="body2" color="primary.main">
                  {t('activity_logs.viewing_company', 'Viewing logs for your company')}
                </Typography>
              )}
            </Stack>
          </Stack>

          <TextField
            fullWidth
            placeholder={t('activity_logs.search_placeholder', 'Search by user, action or description...')}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlass />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Card>
            <CardContent>
              {!companyId ? (
                <Alert severity="warning">
                  {t('activity_logs.no_company', 'No company ID found. Please ensure you are logged in with the correct account.')}
                </Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error">
                  {t('activity_logs.error', 'Failed to load activity logs')}
                </Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('activity_logs.user', 'User')}</TableCell>
                        <TableCell>{t('activity_logs.action', 'Action')}</TableCell>
                        <TableCell>{t('activity_logs.description', 'Description')}</TableCell>
                        <TableCell>{t('activity_logs.date', 'Date')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedLogs.length > 0 ? (
                        paginatedLogs.map((log) => (
                          <TableRow key={log.id} hover>
                            <TableCell>{log.user_email}</TableCell>
                            <TableCell>
                              <Chip
                                label={log.action}
                                color={getActionChipColor(log.action) as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{log.description}</TableCell>
                            <TableCell>
                              {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm')}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            {searchTerm
                              ? t('activity_logs.no_results', 'No activity logs found matching your search')
                              : t('activity_logs.no_logs', 'No activity logs found')}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredLogs.length}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage={t('common.rows_per_page', 'Rows per page:')}
                  />
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
} 