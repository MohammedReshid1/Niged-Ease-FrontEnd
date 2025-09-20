'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as DeleteIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import { format, parseISO } from 'date-fns';

import { PageHeading } from '@/components/page-heading';
import { useSnackbar } from 'notistack';
import { 
  usePaymentModes, 
  useCreatePaymentMode, 
  useUpdatePaymentMode, 
  useDeletePaymentMode 
} from '@/hooks/use-transactions';
import { useStore } from '@/providers/store-provider';
import { PaymentMode, PaymentModeCreateData } from '@/services/api/transactions';

export default function PaymentModesPage(): React.JSX.Element {
  const { currentStore } = useStore();
  const { isLoading: isLoadingPaymentModes, data: paymentModes = [] } = usePaymentModes(currentStore?.id || '');
  const { mutate: createPaymentMode, isPending: isCreating } = useCreatePaymentMode();
  const { mutate: updatePaymentMode, isPending: isUpdating } = useUpdatePaymentMode();
  const { mutate: deletePaymentMode, isPending: isDeleting } = useDeletePaymentMode();
  
  const [openPaymentMode, setOpenPaymentMode] = useState<PaymentMode | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newPaymentMode, setNewPaymentMode] = useState<Partial<PaymentModeCreateData>>({
    name: '',
    description: '',
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  
  const isLoading = !currentStore || isLoadingPaymentModes || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    // Reset form data
    setNewPaymentMode({
      name: '',
      description: '',
    });
    
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (paymentMode: PaymentMode) => {
    setOpenPaymentMode(paymentMode);
    setNewPaymentMode({
      name: paymentMode.name,
      description: paymentMode.description,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (paymentMode: PaymentMode) => {
    setOpenPaymentMode(paymentMode);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddPaymentMode = () => {
    if (!currentStore) {
      enqueueSnackbar('No store selected', { variant: 'error' });
      return;
    }
    
    if (!newPaymentMode.name) {
      enqueueSnackbar('Payment mode name is required', { variant: 'error' });
      return;
    }
    
    // Add store_id to the payment mode data
    const paymentModeData: PaymentModeCreateData = {
      ...newPaymentMode as Omit<PaymentModeCreateData, 'store_id'>,
      store_id: currentStore.id
    };
    
    console.log('Creating payment mode with data:', paymentModeData);
    
    createPaymentMode({ 
      storeId: currentStore.id, 
      data: paymentModeData
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
      }
    });
  };
  
  const handleEditPaymentMode = () => {
    if (!openPaymentMode || !currentStore) return;
    
    if (!newPaymentMode.name) {
      enqueueSnackbar('Payment mode name is required', { variant: 'error' });
      return;
    }
    
    // Add store_id to the payment mode data
    const paymentModeData = {
      ...newPaymentMode,
      store_id: currentStore.id
    };
    
    console.log('Updating payment mode with data:', paymentModeData);
    
    updatePaymentMode({ 
      storeId: currentStore.id, 
      id: openPaymentMode.id, 
      data: paymentModeData as PaymentModeCreateData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
      }
    });
  };
  
  const handleDeletePaymentMode = () => {
    if (!openPaymentMode || !currentStore) return;
    
    deletePaymentMode({ 
      storeId: currentStore.id, 
      id: openPaymentMode.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setOpenPaymentMode(null);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPaymentMode({ ...newPaymentMode, [name]: value });
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title="Payment Modes Management" 
              subtitle={currentStore ? `Store: ${currentStore.name}` : 'No store selected'}
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                  disabled={isLoading || !currentStore}
                >
                  Add Payment Mode
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title="Payment Modes" />
              <CardContent>
                {!currentStore ? (
                  <Alert severity="warning">Please select a store to view payment modes.</Alert>
                ) : isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : paymentModes.length === 0 ? (
                  <Alert severity="info">No payment modes found for this store. Start by adding your first payment mode.</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Created At</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paymentModes.map((paymentMode) => (
                          <TableRow
                            key={paymentMode.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{paymentMode.name}</TableCell>
                            <TableCell>{paymentMode.description || '-'}</TableCell>
                            <TableCell>
                              {format(parseISO(paymentMode.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenEditDialog(paymentMode)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenDeleteDialog(paymentMode)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Add Payment Mode Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Payment Mode</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Payment Mode Name"
              type="text"
              fullWidth
              value={newPaymentMode.name || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newPaymentMode.description || ''}
              onChange={handleInputChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>Cancel</Button>
          <Button 
            onClick={handleAddPaymentMode} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? 'Saving...' : 'Add Payment Mode'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Payment Mode Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Payment Mode</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label="Payment Mode Name"
              type="text"
              fullWidth
              value={newPaymentMode.name || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="edit-description"
              name="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newPaymentMode.description || ''}
              onChange={handleInputChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>Cancel</Button>
          <Button 
            onClick={handleEditPaymentMode} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>Delete Payment Mode</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the payment mode "{openPaymentMode?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
          <Button 
            onClick={handleDeletePaymentMode} 
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 