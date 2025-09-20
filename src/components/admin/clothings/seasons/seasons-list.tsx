'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { PlusCircle, PencilSimple, Trash, X } from '@phosphor-icons/react';
import { useSeasons, useCreateSeason, useUpdateSeason, useDeleteSeason } from '@/hooks/use-clothings';
import { SeasonCreateData, SeasonUpdateData } from '@/services/api/clothings';
import { useCurrentUser } from '@/hooks/use-auth';
import { format } from 'date-fns';

interface SeasonFormData {
  name: string;
  start_date: string;
  end_date: string;
  description: string;
}

export const SeasonsList = ({ storeId }: { storeId: string }) => {
  const { data: seasons, isLoading } = useSeasons(storeId);
  const createSeason = useCreateSeason();
  const updateSeason = useUpdateSeason();
  const deleteSeason = useDeleteSeason();
  const { userInfo } = useCurrentUser();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SeasonFormData>({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedSeason = seasons?.find((season) => season.id === selectedSeasonId);

  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      description: '',
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (seasonId: string) => {
    const season = seasons?.find((c) => c.id === seasonId);
    if (season) {
      setSelectedSeasonId(seasonId);
      setFormData({
        name: season.name,
        start_date: season.start_date,
        end_date: season.end_date,
        description: season.description,
      });
      setFormErrors({});
      setIsEditDialogOpen(true);
    }
  };

  const handleOpenDeleteDialog = (seasonId: string) => {
    setSelectedSeasonId(seasonId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedSeasonId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.start_date) {
      errors.start_date = 'Start date is required';
    }
    
    if (!formData.end_date) {
      errors.end_date = 'End date is required';
    } else if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      errors.end_date = 'End date must be after start date';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSeason = async () => {
    if (!validateForm()) return;
    
    const data: SeasonCreateData = {
      store_id: storeId,
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
    };
    
    await createSeason.mutateAsync({ storeId, data });
    handleCloseDialog();
  };

  const handleUpdateSeason = async () => {
    if (!validateForm() || !selectedSeasonId) return;
    
    const data: SeasonUpdateData = {
      store_id: storeId,
      name: formData.name,
      start_date: formData.start_date,
      end_date: formData.end_date,
      description: formData.description,
    };
    
    await updateSeason.mutateAsync({ storeId, id: selectedSeasonId, data });
    handleCloseDialog();
  };

  const handleDeleteSeason = async () => {
    if (selectedSeasonId) {
      await deleteSeason.mutateAsync({ storeId, id: selectedSeasonId });
      handleCloseDialog();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader 
          title="Seasons Management" 
          action={
            <Button
              startIcon={<PlusCircle weight="bold" />}
              variant="contained"
              onClick={handleOpenAddDialog}
            >
              Add Season
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {seasons && seasons.length > 0 ? (
                    seasons.map((season) => (
                      <TableRow key={season.id}>
                        <TableCell>{season.name}</TableCell>
                        <TableCell>{formatDate(season.start_date)}</TableCell>
                        <TableCell>{formatDate(season.end_date)}</TableCell>
                        <TableCell>{season.description}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenEditDialog(season.id)}
                              size="small"
                            >
                              <PencilSimple />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(season.id)}
                              size="small"
                              color="error"
                            >
                              <Trash />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="body1">No seasons found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Season Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Season
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Season Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name="start_date"
              label="Start Date"
              type="date"
              fullWidth
              value={formData.start_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.start_date}
              helperText={formErrors.start_date}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="end_date"
              label="End Date"
              type="date"
              fullWidth
              value={formData.end_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.end_date}
              helperText={formErrors.end_date}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddSeason} 
            variant="contained" 
            disabled={createSeason.isPending}
          >
            {createSeason.isPending ? <CircularProgress size={24} /> : 'Add Season'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Season Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Season
          <IconButton
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              name="name"
              label="Season Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name="start_date"
              label="Start Date"
              type="date"
              fullWidth
              value={formData.start_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.start_date}
              helperText={formErrors.start_date}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="end_date"
              label="End Date"
              type="date"
              fullWidth
              value={formData.end_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.end_date}
              helperText={formErrors.end_date}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              name="description"
              label="Description"
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateSeason} 
            variant="contained" 
            disabled={updateSeason.isPending}
          >
            {updateSeason.isPending ? <CircularProgress size={24} /> : 'Update Season'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Season Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Season</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the season &quot;{selectedSeason?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteSeason} 
            color="error"
            disabled={deleteSeason.isPending}
          >
            {deleteSeason.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 