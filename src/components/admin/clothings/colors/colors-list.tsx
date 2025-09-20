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
  Switch,
  FormControlLabel,
} from '@mui/material';
import { PlusCircle, PencilSimple, Trash, X } from '@phosphor-icons/react';
import { useColors, useCreateColor, useUpdateColor, useDeleteColor } from '@/hooks/use-clothings';
import { ColorCreateData, ColorUpdateData } from '@/services/api/clothings';

interface ColorFormData {
  name: string;
  color_code: string;
  is_active: boolean;
}

export const ColorsList = ({ storeId }: { storeId: string }) => {
  const { data: colors, isLoading } = useColors(storeId);
  const createColor = useCreateColor();
  const updateColor = useUpdateColor();
  const deleteColor = useDeleteColor();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ColorFormData>({
    name: '',
    color_code: '#000000',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedColor = colors?.find((color) => color.id === selectedColorId);

  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      color_code: '#000000',
      is_active: true,
    });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  const handleOpenEditDialog = (colorId: string) => {
    const color = colors?.find((c) => c.id === colorId);
    if (color) {
      setSelectedColorId(colorId);
      setFormData({
        name: color.name,
        color_code: color.color_code,
        is_active: color.is_active,
      });
      setFormErrors({});
      setIsEditDialogOpen(true);
    }
  };

  const handleOpenDeleteDialog = (colorId: string) => {
    setSelectedColorId(colorId);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedColorId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
    
    if (!formData.color_code.trim()) {
      errors.color_code = 'Color code is required';
    } else if (!formData.color_code.match(/^#([0-9A-F]{3}){1,2}$/i)) {
      errors.color_code = 'Invalid color code format (e.g. #FF0000)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddColor = async () => {
    if (!validateForm()) return;
    
    const data: ColorCreateData = {
      name: formData.name,
      color_code: formData.color_code,
      is_active: formData.is_active,
      store_id: storeId
    };
    
    await createColor.mutateAsync({ storeId, data });
    handleCloseDialog();
  };

  const handleUpdateColor = async () => {
    if (!validateForm() || !selectedColorId) return;
    
    const data: ColorUpdateData = {
      name: formData.name,
      color_code: formData.color_code,
      is_active: formData.is_active,
      store_id: storeId
    };
    
    await updateColor.mutateAsync({ storeId, id: selectedColorId, data });
    handleCloseDialog();
  };

  const handleDeleteColor = async () => {
    if (selectedColorId) {
      await deleteColor.mutateAsync({ storeId, id: selectedColorId });
      handleCloseDialog();
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader 
          title="Colors Management" 
          action={
            <Button
              startIcon={<PlusCircle weight="bold" />}
              variant="contained"
              onClick={handleOpenAddDialog}
            >
              Add Color
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
                    <TableCell>Color Sample</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Color Code</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colors && colors.length > 0 ? (
                    colors.map((color) => (
                      <TableRow key={color.id}>
                        <TableCell>
                          <Box 
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              backgroundColor: color.color_code,
                              borderRadius: '4px',
                              border: '1px solid rgba(0, 0, 0, 0.12)'
                            }} 
                          />
                        </TableCell>
                        <TableCell>{color.name}</TableCell>
                        <TableCell>{color.color_code}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              backgroundColor: color.is_active ? 'success.light' : 'error.light',
                              color: color.is_active ? 'success.dark' : 'error.dark',
                              borderRadius: '16px',
                              px: 1,
                              py: 0.5,
                              display: 'inline-block'
                            }}
                          >
                            {color.is_active ? 'Active' : 'Inactive'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenEditDialog(color.id)}
                              size="small"
                            >
                              <PencilSimple />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(color.id)}
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
                        <Typography variant="body1">No colors found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Color Dialog */}
      <Dialog open={isAddDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Add New Color
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
              label="Color Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name="color_code"
              label="Color Code"
              fullWidth
              value={formData.color_code}
              onChange={handleInputChange}
              margin="normal"
              type="color"
              error={!!formErrors.color_code}
              helperText={formErrors.color_code}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1 }}>
                    <Typography variant="body2">{formData.color_code}</Typography>
                  </Box>
                )
              }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.is_active} 
                  onChange={handleInputChange}
                  name="is_active"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddColor} 
            variant="contained" 
            disabled={createColor.isPending}
          >
            {createColor.isPending ? <CircularProgress size={24} /> : 'Add Color'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Color Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Color
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
              label="Color Name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              error={!!formErrors.name}
              helperText={formErrors.name}
            />
            <TextField
              name="color_code"
              label="Color Code"
              fullWidth
              value={formData.color_code}
              onChange={handleInputChange}
              margin="normal"
              type="color"
              error={!!formErrors.color_code}
              helperText={formErrors.color_code}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1 }}>
                    <Typography variant="body2">{formData.color_code}</Typography>
                  </Box>
                )
              }}
            />
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.is_active} 
                  onChange={handleInputChange}
                  name="is_active"
                />
              }
              label="Active"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateColor} 
            variant="contained" 
            disabled={updateColor.isPending}
          >
            {updateColor.isPending ? <CircularProgress size={24} /> : 'Update Color'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Color Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Delete Color</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the color &quot;{selectedColor?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteColor} 
            color="error"
            disabled={deleteColor.isPending}
          >
            {deleteColor.isPending ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 