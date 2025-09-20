import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Pencil as PencilIcon } from '@phosphor-icons/react/dist/ssr/Pencil';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import { paths } from '@/paths';
import { Company } from '@/services/api/companies';
import { useSubscriptionPlans } from '@/hooks/super-admin/use-companies';

interface CompaniesListProps {
  companies: Company[];
}

export const CompaniesList = ({ companies }: CompaniesListProps) => {
  const { t } = useTranslation('superAdmin');
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: subscriptionPlans, isLoading: isLoadingPlans } = useSubscriptionPlans();

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const paginatedCompanies = companies.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Function to get subscription plan name by id
  const getSubscriptionPlanName = (planId: string | null) => {
    if (!planId) return null;
    
    const plan = subscriptionPlans?.find(plan => plan.id === planId);
    return plan ? plan.name : planId;
  };

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('companies.company_name')}</TableCell>
            <TableCell>{t('companies.description')}</TableCell>
            <TableCell>{t('companies.subscription')}</TableCell>
            <TableCell>{t('companies.status')}</TableCell>
            <TableCell>{t('companies.date_created')}</TableCell>
            <TableCell align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedCompanies.map((company) => {
            const planName = getSubscriptionPlanName(company.subscription_plan);
            
            return (
              <TableRow key={company.id} hover>
                <TableCell>
                  <Typography variant="subtitle2">{company.name}</Typography>
                </TableCell>
                <TableCell>{company.description}</TableCell>
                <TableCell>
                  {planName ? (
                    <Chip 
                      label={planName} 
                      color="primary" 
                      size="small"
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {t('companies.no_plan')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={company.is_active ? t('companies.active') : t('companies.inactive')} 
                    color={company.is_active ? 'success' : 'default'} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(company.created_at), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title={t('companies.edit_tooltip')}>
                      <IconButton 
                        onClick={() => router.push(`${paths.superAdmin.companies}/${company.id}/edit`)}
                        size="small"
                      >
                        <PencilIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('companies.delete_tooltip')}>
                      <IconButton 
                        onClick={() => router.push(`${paths.superAdmin.companies}/${company.id}/delete`)}
                        size="small" 
                        color="error"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
          
          {paginatedCompanies.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {t('companies.no_companies')}
                </Typography>
                <Button
                  onClick={() => router.push(`${paths.superAdmin.companies}/create`)}
                  startIcon={<PlusIcon />}
                  sx={{ mt: 2 }}
                >
                  {t('companies.add')}
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <TablePagination
        component="div"
        count={companies.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage={t('common.rows_per_page')}
        labelDisplayedRows={({ from, to, count }) => 
          t('common.displayed_rows', { from, to, count })
        }
      />
    </Box>
  );
}; 