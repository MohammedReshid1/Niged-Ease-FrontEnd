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
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import { TShirt as TShirtIcon } from '@phosphor-icons/react/dist/ssr/TShirt';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import MaterialEditModal from '@/components/admin/product-manager/MaterialEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

export default function ClothingMaterialsPage(): React.JSX.Element {
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [qualityFilter, setQualityFilter] = React.useState<number[]>([1, 5]);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentMaterial, setCurrentMaterial] = React.useState<{ id?: string; name: string; description: string; quality: number; source?: string } | null>(null);
  const [materialToDelete, setMaterialToDelete] = React.useState<string | null>(null);
  
  // Mock materials data
  const materials = [
    { id: '1', name: 'Cotton', description: '100% natural cotton fiber', quality: 5, productsCount: 52, source: 'Natural plants' },
    { id: '2', name: 'Polyester', description: 'Synthetic polymer-based fiber', quality: 3, productsCount: 38, source: 'Synthetic' },
    { id: '3', name: 'Silk', description: 'Natural protein fiber produced by silkworms', quality: 5, productsCount: 15, source: 'Silkworms' },
    { id: '4', name: 'Wool', description: 'Natural fiber from sheep and other animals', quality: 4, productsCount: 27, source: 'Sheep' },
    { id: '5', name: 'Linen', description: 'Made from the fibers of the flax plant', quality: 4, productsCount: 21, source: 'Flax plant' },
    { id: '6', name: 'Denim', description: 'Sturdy cotton twill textile', quality: 4, productsCount: 0, source: 'Cotton' },
    { id: '7', name: 'Nylon', description: 'Synthetic thermoplastic material', quality: 3, productsCount: 0, source: 'Synthetic' },
    { id: '8', name: 'Spandex', description: 'Synthetic fiber known for elasticity', quality: 3, productsCount: 0, source: 'Synthetic' },
    { id: '9', name: 'Rayon', description: 'Semi-synthetic fiber made from cellulose', quality: 3, productsCount: 0, source: 'Semi-synthetic' },
    { id: '10', name: 'Cashmere', description: 'Soft fiber from cashmere goats', quality: 5, productsCount: 0, source: 'Cashmere goats' },
  ];

  // Filter materials based on search term and quality filter
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = material.quality >= qualityFilter[0] && material.quality <= qualityFilter[1];
    return matchesSearch && matchesQuality;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedMaterials(filteredMaterials.map(material => material.id));
    } else {
      setSelectedMaterials([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedMaterials.includes(id)) {
      setSelectedMaterials(selectedMaterials.filter(materialId => materialId !== id));
    } else {
      setSelectedMaterials([...selectedMaterials, id]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleQualityFilterChange = (event: Event, newValue: number | number[]) => {
    setQualityFilter(newValue as number[]);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setQualityFilter([1, 5]);
  };

  const handleDelete = (id: string) => {
    // Check if material exists and has products (disabled button should prevent this)
    const materialToRemove = materials.find(material => material.id === id);
    if (materialToRemove && materialToRemove.productsCount > 0) {
      return; // Don't allow deletion if products are using this material
    }
    
    setMaterialToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      // In a real application, this would call an API to delete the material
      console.log(`Deleted material with ID: ${materialToDelete}`);
      setIsDeleteModalOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    const materialToEdit = materials.find(material => material.id === id);
    if (materialToEdit) {
      setCurrentMaterial({
        id: materialToEdit.id,
        name: materialToEdit.name,
        description: materialToEdit.description,
        quality: materialToEdit.quality,
        source: materialToEdit.source || ''
      });
      setIsMaterialModalOpen(true);
    }
  };

  const handleAddMaterial = () => {
    setCurrentMaterial({
      name: '',
      description: '',
      quality: 3,
      source: ''
    });
    setIsMaterialModalOpen(true);
  };

  const handleSaveMaterial = (materialData: { id?: string; name: string; description: string; quality: number; source?: string }) => {
    if (materialData.id) {
      // Update existing material
      console.log(`Updated material: ${JSON.stringify(materialData)}`);
    } else {
      // Add new material
      console.log(`Added new material: ${JSON.stringify(materialData)}`);
    }
    setIsMaterialModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Clothings', url: paths.admin.clothing },
    { label: 'Materials', url: paths.admin.clothingMaterials },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TShirtIcon size={28} weight="bold" style={{ marginRight: '8px', color: '#0ea5e9' }} />
            <Typography variant="h4">Clothing Materials</Typography>
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
          onClick={handleAddMaterial}
        >
          Add Material
        </Button>
      </Box>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <OutlinedInput
              placeholder="Search materials..."
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={20} />
                </InputAdornment>
              }
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Quality Rating Filter
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={qualityFilter}
                  onChange={handleQualityFilterChange}
                  valueLabelDisplay="auto"
                  min={1}
                  max={5}
                  step={1}
                  marks
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button 
                  size="small" 
                  variant="text"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Materials Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredMaterials.length > 0 && selectedMaterials.length === filteredMaterials.length}
                  indeterminate={selectedMaterials.length > 0 && selectedMaterials.length < filteredMaterials.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Material Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Products Using</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow key={material.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMaterials.includes(material.id)}
                    onChange={() => handleSelectOne(material.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {material.name}
                  </Typography>
                </TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell>
                  <Rating
                    value={material.quality}
                    readOnly
                    size="small"
                  />
                </TableCell>
                <TableCell>{material.productsCount}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: '#0ea5e9',
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }
                      }}
                      onClick={() => handleEdit(material.id)}
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
                      disabled={material.productsCount > 0}
                      onClick={() => handleDelete(material.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No materials found matching your search and filters
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
      {isMaterialModalOpen && currentMaterial && (
        <MaterialEditModal
          open={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          onSave={handleSaveMaterial}
          material={currentMaterial}
          isNew={!currentMaterial.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this material?`}
      />
    </Box>
  );
} 