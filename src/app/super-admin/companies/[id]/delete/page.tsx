'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';
import { WarningCircle as WarningCircleIcon } from '@phosphor-icons/react/dist/ssr/WarningCircle';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

import { useDeleteCompany, useCompany, useSubscriptionPlan } from '@/hooks/super-admin/use-companies';
import { extractErrorMessage } from '@/utils/api-error';
import { paths } from '@/paths';
import ErrorMessage from '@/components/common/error-message';

export default function CompanyDeletePage({ params }: { params: { id: string } }): React.JSX.Element {
  const router = useRouter();
  const { id } = params;
  const { data: company, isLoading: isLoadingCompany, error: companyError } = useCompany(id);
  const { data: subscriptionPlan, isLoading: isLoadingPlan } = useSubscriptionPlan(company?.subscription_plan || '');
  const deleteCompanyMutation = useDeleteCompany();
  
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await deleteCompanyMutation.mutateAsync(id);
      
      // Navigate back to companies list after successful deletion
      router.push(paths.superAdmin.companies);
    } catch (error) {
      console.error('Error deleting company:', error);
      setDeleteError(extractErrorMessage(error));
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingCompany || deleteCompanyMutation.isPending || isLoadingPlan;

  // Show loading state while company data is being fetched
  if (isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Show error if company is not found or there was an error fetching it
  if ((companyError || !company) && !isLoadingCompany) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        flexDirection="column"
        gap={2}
      >
        <ErrorMessage 
          error={companyError || new Error('Company not found')}
          title="Failed to load company"
          onRetry={() => router.refresh()}
          fullPage
        />
        <Button
          color="primary"
          variant="contained"
          onClick={() => router.push(paths.superAdmin.companies)}
        >
          Back to Companies
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Button
              color="inherit"
              startIcon={<ArrowLeftIcon />}
              onClick={() => router.push(paths.superAdmin.companies)}
            >
              Back to Companies
            </Button>
            <Typography variant="h4">Delete Company</Typography>
          </Stack>
          
          <Card>
            <CardHeader 
              title="Confirm Deletion" 
              titleTypographyProps={{ color: 'error' }}
              avatar={<WarningCircleIcon size={28} weight="fill" color="red" />}
            />
            <CardContent>
              <Alert severity="warning" sx={{ mb: 3 }}>
                This action cannot be undone. This will permanently delete the company and all associated data.
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                Company Details
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Company Name:
                  </Typography>
                  <Typography variant="body1">{company?.name}</Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Description:
                  </Typography>
                  <Typography variant="body1">{company?.description}</Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Status:
                  </Typography>
                  <Typography variant="body1">
                    {company?.is_active ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Subscription Status:
                  </Typography>
                  <Typography variant="body1">
                    {(typeof company?.is_subscribed === 'string' ? 
                      (company.is_subscribed.toLowerCase() === 'true' || 
                       company.is_subscribed.toLowerCase() === 'yes' || 
                       company.is_subscribed.toLowerCase() === 'subscribed') :
                      !!company?.is_subscribed) || 
                     !!company?.subscription_plan ? 'Subscribed' : 'Not Subscribed'}
                  </Typography>
                </Box>
                
                {company?.subscription_plan && (
                  <Box display="flex" flexDirection="row">
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                      Subscription Plan:
                    </Typography>
                    <Typography variant="body1">
                      {isLoadingPlan ? (
                        <CircularProgress size={16} sx={{ ml: 1 }} />
                      ) : (
                        subscriptionPlan?.name || company.subscription_plan
                      )}
                    </Typography>
                  </Box>
                )}
                
                <Box display="flex" flexDirection="row">
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ minWidth: 200 }}>
                    Created:
                  </Typography>
                  <Typography variant="body1">
                    {company?.created_at ? format(new Date(company.created_at), 'PPP') : ''}
                  </Typography>
                </Box>
              </Stack>
              
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body1" color="error" sx={{ mb: 3, fontWeight: 'bold' }}>
                Are you absolutely sure you want to delete this company?
              </Typography>
              
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={() => router.push(paths.superAdmin.companies)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  startIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Company'}
                </Button>
              </Stack>
              
              {(deleteCompanyMutation.isError || deleteError) && (
                <ErrorMessage 
                  error={deleteError || deleteCompanyMutation.error}
                  title="Delete Failed"
                  onRetry={handleDelete}
                />
              )}
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
} 