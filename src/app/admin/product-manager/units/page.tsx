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
import { useTranslation } from 'react-i18next';

import { PageHeading } from '@/components/page-heading';
import { useSnackbar } from 'notistack';
import { 
  useProductUnits, 
  useCreateProductUnit, 
  useUpdateProductUnit, 
  useDeleteProductUnit 
} from '@/hooks/use-inventory';
import { useStore } from '@/providers/store-provider';
import { ProductUnit, ProductUnitCreateData } from '@/services/api/inventory';

export default function ProductUnitsPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { isLoading: isLoadingUnits, data: productUnits = [] } = useProductUnits(currentStore?.id || '');
  const { mutate: createProductUnit, isPending: isCreating } = useCreateProductUnit();
  const { mutate: updateProductUnit, isPending: isUpdating } = useUpdateProductUnit();
  const { mutate: deleteProductUnit, isPending: isDeleting } = useDeleteProductUnit();
  
  const [openUnit, setOpenUnit] = useState<ProductUnit | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newUnit, setNewUnit] = useState<Partial<ProductUnitCreateData>>({
    name: '',
    description: '',
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState<string | null>(null);
  
  const isLoading = !currentStore || isLoadingUnits || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    // Reset form data
    setNewUnit({
      name: '',
      description: '',
    });
    
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (unit: ProductUnit) => {
    setOpenUnit(unit);
    setNewUnit({
      name: unit.name,
      description: unit.description,
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (unit: ProductUnit) => {
    setOpenUnit(unit);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddUnit = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    if (!newUnit.name) {
      enqueueSnackbar(t('product_units.unit_name') + ' ' + t('common.is_required'), { variant: 'error' });
      return;
    }
    
    // Add store_id to the unit data
    const unitData: ProductUnitCreateData = {
      ...newUnit as Omit<ProductUnitCreateData, 'store_id'>,
      store_id: currentStore.id
    };
    
    console.log('Creating product unit with data:', unitData);
    
    createProductUnit({ 
      storeId: currentStore.id, 
      data: unitData
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar(t('product_units.unit_created'), { variant: 'success' });
      }
    });
  };
  
  const handleEditUnit = () => {
    if (!openUnit || !currentStore) return;
    
    if (!newUnit.name) {
      enqueueSnackbar(t('product_units.unit_name') + ' ' + t('common.is_required'), { variant: 'error' });
      return;
    }
    
    // Add store_id to the unit data
    const unitData = {
      ...newUnit,
      store_id: currentStore.id
    };
    
    console.log('Updating product unit with data:', unitData);
    
    updateProductUnit({ 
      storeId: currentStore.id, 
      id: openUnit.id, 
      data: unitData as ProductUnitCreateData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar(t('product_units.unit_updated'), { variant: 'success' });
      }
    });
  };
  
  const handleDeleteUnit = () => {
    if (!openUnit || !currentStore) return;
    
    deleteProductUnit({ 
      storeId: currentStore.id, 
      id: openUnit.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setOpenUnit(null);
        enqueueSnackbar(t('product_units.unit_deleted'), { variant: 'success' });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUnit({ ...newUnit, [name]: value });
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title={t('product_units.title')} 
              subtitle={currentStore ? `${t('common.store')}: ${currentStore.name}` : t('dashboard.no_store')}
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                  disabled={isLoading || !currentStore}
                >
                  {t('product_units.add_unit')}
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title={t('product_units.all_units')} />
              <CardContent>
                {!currentStore ? (
                  <Alert severity="warning">{t('dashboard.no_store_message')}</Alert>
                ) : isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>{t('product_units.loading_units')}</Typography>
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : productUnits.length === 0 ? (
                  <Alert severity="info">{t('product_units.no_units')}</Alert>
                ) : (
                  <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('common.name')}</TableCell>
                          <TableCell>{t('common.description')}</TableCell>
                          <TableCell>{t('common.created_at')}</TableCell>
                          <TableCell align="right">{t('common.actions')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {productUnits.map((unit) => (
                          <TableRow
                            key={unit.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell>{unit.name}</TableCell>
                            <TableCell>{unit.description || '-'}</TableCell>
                            <TableCell>
                              {format(parseISO(unit.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title={t('common.edit')}>
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenEditDialog(unit)}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={t('common.delete')}>
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenDeleteDialog(unit)}
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

      {/* Add Product Unit Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('product_units.add_unit')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label={t('product_units.unit_name')}
              type="text"
              fullWidth
              value={newUnit.name || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="description"
              name="description"
              label={t('common.description')}
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newUnit.description || ''}
              onChange={handleInputChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleAddUnit} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? t('common.saving') : t('common.add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Unit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('product_units.edit_unit')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label={t('product_units.unit_name')}
              type="text"
              fullWidth
              value={newUnit.name || ''}
              onChange={handleInputChange}
              required
            />
            <TextField
              margin="dense"
              id="edit-description"
              name="description"
              label={t('common.description')}
              type="text"
              fullWidth
              multiline
              rows={3}
              value={newUnit.description || ''}
              onChange={handleInputChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleEditUnit} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>{t('product_units.delete_unit')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('product_units.confirm_delete').replace('{name}', openUnit?.name || '')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleDeleteUnit} 
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 