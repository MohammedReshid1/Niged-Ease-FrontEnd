'use client';

import React, { useState, useEffect } from 'react';
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
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
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
import { useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection, useSeasons } from '@/hooks/use-clothings';
import { CollectionCreateData, CollectionUpdateData } from '@/services/api/clothings';
import { useCurrentUser } from '@/hooks/use-auth';
import { format } from 'date-fns';

interface CollectionFormData {
  name: string;
  season_id: string;
  release_date: string;
  description: string;
}

export const CollectionsList = ({ storeId }: { storeId: string }) => {
  const { data: collections, isLoading } = useCollections(storeId);
  const { data: seasons } = useSeasons(storeId);
  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();
  const deleteCollection = useDeleteCollection();
  const { userInfo } = useCurrentUser();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    season_id: '',
    release_date: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedCollection = collections?.find((collection) => collection.id === selectedCollectionId);

  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      season_id: seasons && seasons.length > 0 ? seasons[0].id : '',
      release_date: '',
      description: '',
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (collectionId: string) => {
    const collection = collections?.find((c) => c.id === collectionId);
    if (collection) {
      setSelectedCollectionId(collectionId);
      setFormData({
        name: collection.name,
        season_id: collection.season_id,
        release_date: collection.release_date,
        description: collection.description,
      });
      setFormErrors({});
      setIsEditDialogOpen(true);
    }
  };

  const handleOpenDeleteDialog = (collectionId: string) => {
    setSelectedCollectionId(collectionId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedCollectionId(null);
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

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
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
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.season_id) {
      errors.season_id = 'Season is required';
    }
    
    if (!formData.release_date) {
      errors.release_date = 'Release date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCollection = async () => {
    if (!validateForm()) return;
    
    const data: CollectionCreateData = {
      store_id: storeId,
      season_id: formData.season_id,
      name: formData.name,
      release_date: formData.release_date,
      description: formData.description,
    };
    
    await createCollection.mutateAsync({ storeId, data });
    handleCloseDialog();
  };

  const handleUpdateCollection = async () => {
    if (!validateForm() || !selectedCollectionId) return;
    
    const data: CollectionUpdateData = {
      store_id: storeId,
      season_id: formData.season_id,
      name: formData.name,
      release_date: formData.release_date,
      description: formData.description,
    };
    
    await updateCollection.mutateAsync({ storeId, id: selectedCollectionId, data });
    handleCloseDialog();
  };

  const handleDeleteCollection = async () => {
    if (selectedCollectionId) {
      await deleteCollection.mutateAsync({ storeId, id: selectedCollectionId });
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

  const getSeasonName = (seasonId: string) => {
    const season = seasons?.find((s) => s.id === seasonId);
    return season ? season.name : 'Unknown Season';
  };

  return (
    <Box>
      <Card>
        <CardHeader 
          title="Collections Management" 
          action={
            <Button
              startIcon={<PlusCircle weight="bold" />}
              variant="contained"
              onClick={handleOpenAddDialog}
              disabled={!seasons || seasons.length === 0}
            >
              Add Collection
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
                    <TableCell>Season</TableCell>
                    <TableCell>Release Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collections && collections.length > 0 ? (
                    collections.map((collection) => (
                      <TableRow key={collection.id}>
                        <TableCell>{collection.name}</TableCell>
                        <TableCell>{getSeasonName(collection.season_id)}</TableCell>
                        <TableCell>{formatDate(collection.release_date)}</TableCell>
                        <TableCell>{collection.description}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenEditDialog(collection.id)}
                              size="small"
                            >
                              <PencilSimple />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(collection.id)}
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
                        <Typography variant="body1">No collections found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Collection Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Collection
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
              label="Collection Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            
            <FormControl fullWidth margin="normal" error={!!formErrors.season_id}>
              <InputLabel id="season-select-label">Season</InputLabel>
              <Select
                labelId="season-select-label"
                id="season-select"
                name="season_id"
                value={formData.season_id}
                label="Season"
                onChange={handleSelectChange}
              >
                {seasons?.length ? (
                  seasons.map((season) => (
                    <MenuItem key={season.id} value={season.id}>
                      {season.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No seasons available
                  </MenuItem>
                )}
              </Select>
              {formErrors.season_id && <FormHelperText>{formErrors.season_id}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="release_date"
              label="Release Date"
              type="date"
              fullWidth
              value={formData.release_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.release_date}
              helperText={formErrors.release_date}
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
            onClick={handleAddCollection} 
            variant="contained" 
            disabled={createCollection.isPending || !seasons?.length}
          >
            {createCollection.isPending ? <CircularProgress size={24} /> : 'Add Collection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Collection
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
              label="Collection Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            
            <FormControl fullWidth margin="normal" error={!!formErrors.season_id}>
              <InputLabel id="season-edit-label">Season</InputLabel>
              <Select
                labelId="season-edit-label"
                id="season-edit"
                name="season_id"
                value={formData.season_id}
                label="Season"
                onChange={handleSelectChange}
              >
                {seasons?.length ? (
                  seasons.map((season) => (
                    <MenuItem key={season.id} value={season.id}>
                      {season.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value="">
                    No seasons available
                  </MenuItem>
                )}
              </Select>
              {formErrors.season_id && <FormHelperText>{formErrors.season_id}</FormHelperText>}
            </FormControl>
            
            <TextField
              name="release_date"
              label="Release Date"
              type="date"
              fullWidth
              value={formData.release_date}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.release_date}
              helperText={formErrors.release_date}
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
            onClick={handleUpdateCollection} 
            variant="contained" 
            disabled={updateCollection.isPending}
          >
            {updateCollection.isPending ? <CircularProgress size={24} /> : 'Update Collection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the collection &quot;{selectedCollection?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteCollection} 
            color="error"
            disabled={deleteCollection.isPending}
          >
            {deleteCollection.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 