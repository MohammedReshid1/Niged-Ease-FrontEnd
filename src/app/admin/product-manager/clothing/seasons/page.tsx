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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { PageHeading } from '@/components/page-heading';
import { Season, SeasonCreateData } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from '@/hooks/use-clothings';
import { useStore } from '@/providers/store-provider';

export default function SeasonsPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { isLoading: isLoadingSeasons, data: seasons = [] } = useSeasons(currentStore?.id || '');
  const { mutate: createSeason, isPending: isCreating } = useCreateSeason();
  const { mutate: updateSeason, isPending: isUpdating } = useUpdateSeason();
  const { mutate: deleteSeason, isPending: isDeleting } = useDeleteSeason();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [newSeason, setNewSeason] = useState({
    name: '',
    description: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')
  });
  
  const { enqueueSnackbar } = useSnackbar();
  const isLoading = !currentStore || isLoadingSeasons || isCreating || isUpdating || isDeleting;
  
  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    setNewSeason({
      name: '',
      description: '',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(new Date().setMonth(new Date().getMonth() + 3)), 'yyyy-MM-dd')
    });
    setIsAddDialogOpen(true);
  };
  
  const handleOpenEditDialog = (season: Season) => {
    setCurrentSeason(season);
    setNewSeason({
      name: season.name,
      description: season.description,
      start_date: season.start_date,
      end_date: season.end_date
    });
    setIsEditDialogOpen(true);
  };
  
  const handleOpenDeleteDialog = (season: Season) => {
    setCurrentSeason(season);
    setIsDeleteDialogOpen(true);
  };
  
  const handleAddSeason = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    if (!newSeason.name) {
      enqueueSnackbar(t('clothing.seasons.name_required'), { variant: 'error' });
      return;
    }
    
    const seasonData = {
      ...newSeason,
      store_id: currentStore.id
    };
    
    createSeason({ 
      storeId: currentStore.id, 
      data: seasonData 
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar(t('clothing.seasons.season_created'), { variant: 'success' });
      }
    });
  };
  
  const handleEditSeason = () => {
    if (!currentSeason || !currentStore) return;
    
    if (!newSeason.name) {
      enqueueSnackbar(t('clothing.seasons.name_required'), { variant: 'error' });
      return;
    }
    
    const seasonData = {
      ...newSeason,
      store_id: currentStore.id
    };
    
    updateSeason({ 
      storeId: currentStore.id,
      id: currentSeason.id, 
      data: seasonData 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar(t('clothing.seasons.season_updated'), { variant: 'success' });
      }
    });
  };
  
  const handleDeleteSeason = () => {
    if (!currentSeason || !currentStore) return;
    
    deleteSeason({ 
      storeId: currentStore.id, 
      id: currentSeason.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setCurrentSeason(null);
        enqueueSnackbar(t('clothing.seasons.season_deleted'), { variant: 'success' });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSeason({ ...newSeason, [name]: value });
  };

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setNewSeason({ ...newSeason, start_date: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setNewSeason({ ...newSeason, end_date: format(date, 'yyyy-MM-dd') });
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <PageHeading 
            title={t('clothing.seasons.title')}
            subtitle={currentStore ? `${t('common.store')}: ${currentStore.name}` : t('common.no_store')}
            actions={
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
                disabled={isLoading || !currentStore}
              >
                {t('clothing.seasons.add_season')}
              </Button>
            }
          />
          
          <Card>
            <CardHeader title={t('clothing.seasons.title')} />
            <CardContent>
              {!currentStore ? (
                <Alert severity="warning">{t('common.no_store_message')}</Alert>
              ) : isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : seasons.length === 0 ? (
                <Alert severity="info">
                  {t('clothing.seasons.no_seasons')}
                </Alert>
              ) : (
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.name')}</TableCell>
                        <TableCell>{t('common.description')}</TableCell>
                        <TableCell>{t('clothing.seasons.start_date')}</TableCell>
                        <TableCell>{t('clothing.seasons.end_date')}</TableCell>
                        <TableCell align="right">{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {seasons.map((season) => (
                        <TableRow
                          key={season.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {season.name}
                          </TableCell>
                          <TableCell>{season.description || '-'}</TableCell>
                          <TableCell>
                            {format(parseISO(season.start_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(parseISO(season.end_date), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title={t('common.edit')}>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenEditDialog(season)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.delete')}>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(season)}
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

      {/* Add Season Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('clothing.seasons.add_season')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label={t('clothing.seasons.season_name')}
              type="text"
              fullWidth
              value={newSeason.name}
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
              value={newSeason.description}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('clothing.seasons.start_date')}
                value={parseISO(newSeason.start_date)}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label={t('clothing.seasons.end_date')}
                value={parseISO(newSeason.end_date)}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={isCreating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleAddSeason} 
            variant="contained"
            disabled={isCreating}
          >
            {isCreating ? t('common.saving') : t('clothing.seasons.add_season')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Season Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('clothing.seasons.edit_season')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="edit-name"
              name="name"
              label={t('clothing.seasons.season_name')}
              type="text"
              fullWidth
              value={newSeason.name}
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
              value={newSeason.description}
              onChange={handleInputChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('clothing.seasons.start_date')}
                value={parseISO(newSeason.start_date)}
                onChange={handleStartDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
              <DatePicker
                label={t('clothing.seasons.end_date')}
                value={parseISO(newSeason.end_date)}
                onChange={handleEndDateChange}
                slotProps={{ textField: { fullWidth: true, margin: 'dense' } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={isUpdating}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleEditSeason} 
            variant="contained"
            disabled={isUpdating}
          >
            {isUpdating ? t('common.saving') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>{t('clothing.seasons.delete_season')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('clothing.seasons.confirm_delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleDeleteSeason} 
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