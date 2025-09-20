'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { Palette as PaletteIcon } from '@phosphor-icons/react/dist/ssr/Palette';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import ColorEditModal from '@/components/admin/product-manager/ColorEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

export default function ClothingColorsPage(): React.JSX.Element {
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [isColorModalOpen, setIsColorModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState<{ id?: string; name: string; description: string; hexCode: string } | null>(null);
  const [colorToDelete, setColorToDelete] = React.useState<string | null>(null);
  
  // Mock colors data
  const colors = [
    { id: '1', name: 'Black', description: 'Deep black color', hex: '#000000', productsCount: 42 },
    { id: '2', name: 'White', description: 'Pure white color', hex: '#FFFFFF', productsCount: 38 },
    { id: '3', name: 'Red', description: 'Vibrant red color', hex: '#FF0000', productsCount: 24 },
    { id: '4', name: 'Blue', description: 'Classic blue color', hex: '#0000FF', productsCount: 31 },
    { id: '5', name: 'Green', description: 'Rich green color', hex: '#008000', productsCount: 19 },
    { id: '6', name: 'Yellow', description: 'Bright yellow color', hex: '#FFFF00', productsCount: 15 },
    { id: '7', name: 'Purple', description: 'Deep purple color', hex: '#800080', productsCount: 0 },
    { id: '8', name: 'Pink', description: 'Soft pink color', hex: '#FFC0CB', productsCount: 0 },
    { id: '9', name: 'Orange', description: 'Warm orange color', hex: '#FFA500', productsCount: 0 },
    { id: '10', name: 'Brown', description: 'Earthy brown color', hex: '#A52A2A', productsCount: 0 },
  ];

  // Filter colors based on search term
  const filteredColors = colors.filter(color => 
    color.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    color.hex.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedColors(filteredColors.map(color => color.id));
    } else {
      setSelectedColors([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedColors.includes(id)) {
      setSelectedColors(selectedColors.filter(colorId => colorId !== id));
    } else {
      setSelectedColors([...selectedColors, id]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = (id: string) => {
    // Check if color exists and has products (disabled button should prevent this)
    const colorToRemove = colors.find(color => color.id === id);
    if (colorToRemove && colorToRemove.productsCount > 0) {
      return; // Don't allow deletion if products are using this color
    }
    
    setColorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (colorToDelete) {
      // In a real application, this would call an API to delete the color
      console.log(`Deleted color with ID: ${colorToDelete}`);
      setIsDeleteModalOpen(false);
      setColorToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    const colorToEdit = colors.find(color => color.id === id);
    if (colorToEdit) {
      setCurrentColor({
        id: colorToEdit.id,
        name: colorToEdit.name,
        description: colorToEdit.description,
        hexCode: colorToEdit.hex
      });
      setIsColorModalOpen(true);
    }
  };

  const handleAddColor = () => {
    setCurrentColor({
      name: '',
      description: '',
      hexCode: '#3B82F6'
    });
    setIsColorModalOpen(true);
  };

  const handleSaveColor = (colorData: { id?: string; name: string; description: string; hexCode: string }) => {
    if (colorData.id) {
      // Update existing color
      console.log(`Updated color: ${JSON.stringify(colorData)}`);
    } else {
      // Add new color
      console.log(`Added new color: ${JSON.stringify(colorData)}`);
    }
    setIsColorModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Clothings', url: paths.admin.clothing },
    { label: 'Colors', url: paths.admin.clothingColors },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PaletteIcon size={28} weight="bold" style={{ marginRight: '8px', color: '#0ea5e9' }} />
            <Typography variant="h4">Clothing Colors</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <Box component="span" sx={{ mx: 0.5 }}>-</Box>}
                <Typography 
                  component="a" 
                  href={item.url} 
                  variant="body2" 
                  color={index === breadcrumbItems.length - 1 ? 'text.primary' : 'inherit'}
                  sx={{ textDecoration: 'none' }}
                >
                  {item.label}
                </Typography>
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PlusIcon weight="bold" />}
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
          onClick={handleAddColor}
        >
          Add Color
        </Button>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <OutlinedInput
          placeholder="Search colors..."
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon size={20} />
            </InputAdornment>
          }
        />
      </Box>

      {/* Colors Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredColors.length > 0 && selectedColors.length === filteredColors.length}
                  indeterminate={selectedColors.length > 0 && selectedColors.length < filteredColors.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Hex Code</TableCell>
              <TableCell>Products Using</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredColors.map((color) => (
              <TableRow key={color.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedColors.includes(color.id)}
                    onChange={() => handleSelectOne(color.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        bgcolor: color.hex,
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        mr: 2,
                      }}
                    />
                    {color.name}
                  </Box>
                </TableCell>
                <TableCell>{color.hex}</TableCell>
                <TableCell>{color.productsCount}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: '#0ea5e9',
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }
                      }}
                      onClick={() => handleEdit(color.id)}
                    >
                      <PencilSimpleIcon size={18} />
                    </IconButton>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: '#ef4444',
                        color: 'white',
                        '&:hover': { bgcolor: '#dc2626' }
                      }}
                      disabled={color.productsCount > 0}
                      onClick={() => handleDelete(color.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredColors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No colors found matching your search
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&lt;</Button>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 24, 
                  height: 24, 
                  p: 0, 
                  mx: 0.5, 
                  border: '1px solid #0ea5e9', 
                  borderRadius: 1,
                  color: '#0ea5e9' 
                }}
              >
                1
              </Button>
              <Button size="small" sx={{ minWidth: 'auto', p: 0 }}>&gt;</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              10 / page <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>▼</Box>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Modals */}
      {isColorModalOpen && currentColor && (
        <ColorEditModal
          open={isColorModalOpen}
          onClose={() => setIsColorModalOpen(false)}
          onSave={handleSaveColor}
          color={currentColor}
          isNew={!currentColor.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${colorToDelete ? colors.find(c => c.id === colorToDelete)?.name || '' : ''}?`}
      />
    </Box>
  );
} 