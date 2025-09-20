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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as DeleteIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { PageHeading } from '@/components/page-heading';
import { Collection, CollectionCreateData, Season } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useCollections, useCreateCollection, useDeleteCollection, useUpdateCollection, useSeasons } from '@/hooks/use-clothings';
import { useStore } from '@/providers/store-provider';

export default function CollectionsPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { isLoading: isLoadingCollections, data: collections = [] } = useCollections(currentStore?.id || '');
  const { isLoading: isLoadingSeasons, data: seasons = [] } = useSeasons(currentStore?.id || '');
  const { mutate: createCollection, isPending: isCreating } = useCreateCollection();
  const { mutate: updateCollection, isPending: isUpdating } = useUpdateCollection();
  const { mutate: deleteCollection, isPending: isDeleting } = useDeleteCollection();
  
  const [openCollection, setOpenCollection] = useState<Collection | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCollection, setNewCollection] = useState<any>({
    name: '',
    description: '',
    season_id: '',
    release_date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const isLoading = !currentStore || isLoadingCollections || isLoadingSeasons || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    // Reset form data
    setNewCollection({
      name: '',
      description: '',
      season_id: seasons.length > 0 ? seasons[0].id : '',
      release_date: format(new Date(), 'yyyy-MM-dd')
    });
    
    // Show warning if no seasons available
    if (seasons.length === 0) {
      enqueueSnackbar(t('clothing.collections.no_seasons_available'), { variant: 'warning' });
    }
    
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (collection: Collection) => {
    setOpenCollection(collection);
    setNewCollection({
      name: collection.name,
      description: collection.description,
      season_id: collection.season_id,
      release_date: collection.release_date
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (collection: Collection) => {
    setOpenCollection(collection);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddCollection = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    if (!newCollection.season_id) {
      enqueueSnackbar(t('clothing.collections.season_required'), { variant: 'error' });
      return;
    }
    
    // Add store_id to the collection data
    const collectionData = {
      ...newCollection,
      store_id: currentStore.id // Explicitly include store_id in the request data
    };
    
    console.log('Creating collection with data:', collectionData);
    
    createCollection({ 
      storeId: currentStore.id, 
      data: collectionData  // Use the data with store_id included
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar(t('clothing.collections.collection_created'), { variant: 'success' });
      }
    });
  };
  
  const handleEditCollection = () => {
    if (!openCollection || !currentStore) return;
    
    // Add store_id to the collection data
    const collectionData = {
      ...newCollection,
      store_id: currentStore.id // Explicitly include store_id in the request data
    };
    
    console.log('Updating collection with data:', collectionData);
    
    updateCollection({ 
      storeId: currentStore.id, 
      id: openCollection.id, 
      data: collectionData // Use the data with store_id included
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar(t('clothing.collections.collection_updated'), { variant: 'success' });
      }
    });
  };
  
  const handleDeleteCollection = () => {
    if (!openCollection || !currentStore) return;
    
    deleteCollection({ 
      storeId: currentStore.id, 
      id: openCollection.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setOpenCollection(null);
        enqueueSnackbar(t('clothing.collections.collection_deleted'), { variant: 'success' });
      }
    });
  };
  
  const getSeasonName = (id: string) => {
    const season = seasons.find(s => s.id === id);
    return season ? season.name : t('clothing.collections.unknown_season');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setNewCollection({ ...newCollection, [name]: value });
  };
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setNewCollection({ ...newCollection, release_date: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading 
            title={t('clothing.collections.title')}
            subtitle={currentStore ? `${t('common.store')}: ${currentStore.name}` : t('common.no_store')}
            actions={
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
                disabled={isLoading || !currentStore}
              >
                {t('clothing.collections.add_collection')}
              </Button>
            }
          />
          
          <Card>
            <CardHeader title={t('clothing.collections.title')} />
            <CardContent>
              {!currentStore ? (
                <Alert severity="warning">{t('common.no_store_message')}</Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : collections.length === 0 ? (
                <Alert severity="info">
                  {t('clothing.collections.no_collections')}
                </Alert>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.name')}</TableCell>
                        <TableCell>{t('common.description')}</TableCell>
                        <TableCell>{t('clothing.collections.collection_season')}</TableCell>
                        <TableCell>{t('clothing.collections.release_date')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {collections.map((collection) => (
                        <TableRow
                          key={collection.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {collection.name}
                          </TableCell>
                          <TableCell>{collection.description || '-'}</TableCell>
                          <TableCell>{getSeasonName(collection.season_id)}</TableCell>
                          <TableCell>
                            {format(parseISO(collection.release_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title={t('common.edit')}>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenEditDialog(collection)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.delete')}>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(collection)}
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

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('clothing.collections.add_collection')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label={t('clothing.collections.collection_name')}
              type="text"
              fullWidth
              value={newCollection.name}
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
              value={newCollection.description}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="season-label">{t('clothing.collections.collection_season')}</InputLabel>
              <Select
                labelId="season-label"
                id="season_id"
                name="season_id"
                value={newCollection.season_id}
                label={t('clothing.collections.collection_season')}
                onChange={handleSelectChange}
                required
              >
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('clothing.collections.release_date')}
                value={parseISO(newCollection.release_date)}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleAddCollection} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? t('common.saving') : t('clothing.collections.add_collection')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('clothing.collections.edit_collection')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label={t('clothing.collections.collection_name')}
              type="text"
              fullWidth
              value={newCollection.name}
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
              value={newCollection.description}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="edit-season-label">{t('clothing.collections.collection_season')}</InputLabel>
              <Select
                labelId="edit-season-label"
                id="edit-season_id"
                name="season_id"
                value={newCollection.season_id}
                label={t('clothing.collections.collection_season')}
                onChange={handleSelectChange}
                required
              >
                {seasons.map((season) => (
                  <MenuItem key={season.id} value={season.id}>
                    {season.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('clothing.collections.release_date')}
                value={parseISO(newCollection.release_date)}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleEditCollection} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>{t('clothing.collections.delete_collection')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('clothing.collections.confirm_delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleDeleteCollection} 
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? t('common.deleting') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 