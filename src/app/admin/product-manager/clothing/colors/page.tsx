'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { HexColorPicker } from 'react-colorful';
import Alert from '@mui/material/Alert';
import { useTranslation } from 'react-i18next';

import { PageHeading } from '@/components/page-heading';
import { Color, ColorCreateData, ColorUpdateData } from '@/services/api/clothings';
import { useSnackbar } from 'notistack';
import { useColors, useCreateColor, useUpdateColor, useDeleteColor } from '@/hooks/use-clothings';
import { useStore } from '@/providers/store-provider';

export default function ColorsPage(): React.JSX.Element {
  const { t } = useTranslation('admin');
  const { currentStore } = useStore();
  const { isLoading: isLoadingColors, data: colors = [] } = useColors(currentStore?.id || '');
  const { mutate: createColor, isPending: isCreating } = useCreateColor();
  const { mutate: updateColor, isPending: isUpdating } = useUpdateColor();
  const { mutate: deleteColor, isPending: isDeleting } = useDeleteColor();

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [colorToDelete, setColorToDelete] = useState<Color | null>(null);
  const [currentColor, setCurrentColor] = useState({
    name: '',
    color_code: '#3b82f6',
    is_active: true
  });

  const { enqueueSnackbar } = useSnackbar();
  const isLoading = !currentStore || isLoadingColors || isCreating || isUpdating || isDeleting;

  // Filter colors by search term
  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddDialog = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }
    
    setCurrentColor({
      name: '',
      color_code: '#3b82f6',
      is_active: true
    });
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (color: Color) => {
    setCurrentColor({
      name: color.name,
      color_code: color.color_code,
      is_active: color.is_active
    });
    setIsEditDialogOpen(true);
  };

  const handleOpenDeleteDialog = (color: Color) => {
    setColorToDelete(color);
    setIsDeleteDialogOpen(true);
  };

  const handleAddColor = () => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }

    if (!currentColor.name) {
      enqueueSnackbar(t('clothing.colors.color_name_required'), { variant: 'error' });
      return;
    }

    const colorData = {
      ...currentColor,
      store_id: currentStore.id
    };

    createColor({ 
      storeId: currentStore.id, 
      data: colorData 
    }, {
      onSuccess: () => {
        setIsAddDialogOpen(false);
        enqueueSnackbar(t('clothing.colors.color_created'), { variant: 'success' });
      }
    });
  };

  const handleEditColor = (color: Color) => {
    if (!currentStore) {
      enqueueSnackbar(t('common.no_store'), { variant: 'error' });
      return;
    }

    if (!currentColor.name) {
      enqueueSnackbar(t('clothing.colors.color_name_required'), { variant: 'error' });
      return;
    }

    const colorData = {
      ...currentColor,
      store_id: currentStore.id
    };

    updateColor({ 
      storeId: currentStore.id,
      id: color.id, 
      data: colorData 
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        enqueueSnackbar(t('clothing.colors.color_updated'), { variant: 'success' });
      }
    });
  };

  const handleDeleteColor = () => {
    if (!colorToDelete || !currentStore) return;

    deleteColor({ 
      storeId: currentStore.id, 
      id: colorToDelete.id 
    }, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setColorToDelete(null);
        enqueueSnackbar(t('clothing.colors.color_deleted'), { variant: 'success' });
      }
    });
  };

  const handleColorChange = (newColor: string) => {
    setCurrentColor(prev => ({ ...prev, color_code: newColor }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    // Handle checkbox differently
    if (name === 'is_active') {
      setCurrentColor(prev => ({ ...prev, [name]: checked }));
    } else {
      setCurrentColor(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <PageHeading 
              title={t('clothing.colors.title')} 
              subtitle={currentStore ? `${t('common.store')}: ${currentStore.name}` : t('common.no_store')}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', sm: 240 } }}
              />
              <Button
                startIcon={<PlusIcon />}
                variant="contained"
                onClick={handleOpenAddDialog}
                disabled={isLoading || !currentStore}
              >
                {t('clothing.colors.add_color')}
              </Button>
            </Stack>
          </Stack>

          <Card>
            {!currentStore ? (
              <Alert severity="warning" sx={{ m: 2 }}>
                {t('common.no_store_message')}
              </Alert>
            ) : isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : filteredColors.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Typography>{t('clothing.colors.no_colors')}</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('clothing.colors.title')}</TableCell>
                      <TableCell>{t('common.name')}</TableCell>
                      <TableCell>{t('clothing.colors.color_code')}</TableCell>
                      <TableCell>{t('common.status')}</TableCell>
                      <TableCell align="right">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredColors.map((color) => (
                      <TableRow key={color.id}>
                        <TableCell>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: 1,
                              bgcolor: color.color_code,
                              border: '1px solid',
                              borderColor: 'divider',
                            }}
                          />
                        </TableCell>
                        <TableCell>{color.name}</TableCell>
                        <TableCell>{color.color_code}</TableCell>
                        <TableCell>
                          {color.is_active ? t('common.active') : t('common.inactive')}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title={t('common.edit')}>
                              <IconButton onClick={() => handleOpenEditDialog(color)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.delete')}>
                              <IconButton 
                                onClick={() => handleOpenDeleteDialog(color)} 
                                color="error"
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
          </Card>
        </Stack>
      </Container>

      {/* Add Color Dialog */}
      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>{t('clothing.colors.add_color')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('clothing.colors.color_name')}
              name="name"
              value={currentColor.name}
              onChange={handleInputChange}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('clothing.colors.color_code')}: {currentColor.color_code}
              </Typography>
              <Box sx={{ width: '100%', height: 200 }}>
                <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch 
                  checked={currentColor.is_active} 
                  onChange={handleInputChange} 
                  name="is_active" 
                />
              }
              label={t('common.active')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleAddColor}>
            {t('clothing.colors.add_color')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Color Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>{t('clothing.colors.edit_color')}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('clothing.colors.color_name')}
              name="name"
              value={currentColor.name}
              onChange={handleInputChange}
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t('clothing.colors.color_code')}: {currentColor.color_code}
              </Typography>
              <Box sx={{ width: '100%', height: 200 }}>
                <HexColorPicker color={currentColor.color_code} onChange={handleColorChange} />
              </Box>
            </Box>
            <FormControlLabel
              control={
                <Switch 
                  checked={currentColor.is_active} 
                  onChange={handleInputChange} 
                  name="is_active" 
                />
              }
              label={t('common.active')}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => colorToDelete && handleEditColor(colorToDelete)}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Color Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle>{t('clothing.colors.delete_color')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('clothing.colors.confirm_delete')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDeleteColor} 
            color="error" 
            variant="contained"
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 