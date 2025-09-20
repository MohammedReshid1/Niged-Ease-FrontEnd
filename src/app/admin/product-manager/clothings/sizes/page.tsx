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
import Chip from '@mui/material/Chip';
import { Ruler as RulerIcon } from '@phosphor-icons/react/dist/ssr/Ruler';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { paths } from '@/paths';
import SizeEditModal from '@/components/admin/product-manager/SizeEditModal';
import DeleteConfirmationModal from '@/components/admin/product-manager/DeleteConfirmationModal';

export default function ClothingSizesPage(): React.JSX.Element {
  const [selectedSizes, setSelectedSizes] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const [isSizeModalOpen, setIsSizeModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [currentSize, setCurrentSize] = React.useState<{ id?: string; name: string; description: string; category: string } | null>(null);
  const [sizeToDelete, setSizeToDelete] = React.useState<string | null>(null);
  
  // Mock sizes data
  const sizes = [
    { id: '1', name: 'XS', description: 'Extra Small', category: 'Adult', productsCount: 18 },
    { id: '2', name: 'S', description: 'Small', category: 'Adult', productsCount: 32 },
    { id: '3', name: 'M', description: 'Medium', category: 'Adult', productsCount: 45 },
    { id: '4', name: 'L', description: 'Large', category: 'Adult', productsCount: 38 },
    { id: '5', name: 'XL', description: 'Extra Large', category: 'Adult', productsCount: 25 },
    { id: '6', name: 'XXL', description: 'Double Extra Large', category: 'Adult', productsCount: 0 },
    { id: '7', name: '3-4Y', description: '3-4 Years', category: 'Kids', productsCount: 0 },
    { id: '8', name: '5-6Y', description: '5-6 Years', category: 'Kids', productsCount: 0 },
    { id: '9', name: '7-8Y', description: '7-8 Years', category: 'Kids', productsCount: 0 },
    { id: '10', name: '9-10Y', description: '9-10 Years', category: 'Kids', productsCount: 0 },
  ];

  // Get unique categories for filter chips
  const categories = Array.from(new Set(sizes.map(size => size.category)));

  // Filter sizes based on search term and active category
  const filteredSizes = sizes.filter(size => {
    const matchesSearch = size.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        size.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || size.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedSizes(filteredSizes.map(size => size.id));
    } else {
      setSelectedSizes([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSizes.includes(id)) {
      setSelectedSizes(selectedSizes.filter(sizeId => sizeId !== id));
    } else {
      setSelectedSizes([...selectedSizes, id]);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleDelete = (id: string) => {
    // Check if size exists and has products (disabled button should prevent this)
    const sizeToRemove = sizes.find(size => size.id === id);
    if (sizeToRemove && sizeToRemove.productsCount > 0) {
      return; // Don't allow deletion if products are using this size
    }
    
    setSizeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sizeToDelete) {
      // In a real application, this would call an API to delete the size
      console.log(`Deleted size with ID: ${sizeToDelete}`);
      setIsDeleteModalOpen(false);
      setSizeToDelete(null);
    }
  };

  const handleEdit = (id: string) => {
    const sizeToEdit = sizes.find(size => size.id === id);
    if (sizeToEdit) {
      setCurrentSize({
        id: sizeToEdit.id,
        name: sizeToEdit.name,
        description: sizeToEdit.description,
        category: sizeToEdit.category
      });
      setIsSizeModalOpen(true);
    }
  };

  const handleAddSize = () => {
    setCurrentSize({
      name: '',
      description: '',
      category: categories[0] || 'Adult'
    });
    setIsSizeModalOpen(true);
  };

  const handleSaveSize = (sizeData: { id?: string; name: string; description: string; category: string }) => {
    if (sizeData.id) {
      // Update existing size
      console.log(`Updated size: ${JSON.stringify(sizeData)}`);
    } else {
      // Add new size
      console.log(`Added new size: ${JSON.stringify(sizeData)}`);
    }
    setIsSizeModalOpen(false);
  };

  // Generate breadcrumb path links
  const breadcrumbItems = [
    { label: 'Dashboard', url: paths.admin.dashboard },
    { label: 'Product Manager', url: paths.admin.productManager },
    { label: 'Clothings', url: paths.admin.clothing },
    { label: 'Sizes', url: paths.admin.clothingSizes },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
      {/* Header and Breadcrumbs */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <RulerIcon size={28} weight="bold" style={{ marginRight: '8px', color: '#0ea5e9' }} />
            <Typography variant="h4">Clothing Sizes</Typography>
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
          onClick={handleAddSize}
        >
          Add Size
        </Button>
      </Box>

      {/* Search Field */}
      <Box sx={{ mb: 3 }}>
        <OutlinedInput
          placeholder="Search sizes..."
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

      {/* Category Filter */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            onClick={() => handleCategoryFilter(category)}
            sx={{
              bgcolor: activeCategory === category ? '#0ea5e9' : 'transparent',
              color: activeCategory === category ? 'white' : 'inherit',
              border: '1px solid',
              borderColor: activeCategory === category ? '#0ea5e9' : '#e0e0e0',
              '&:hover': {
                bgcolor: activeCategory === category ? '#0284c7' : 'rgba(0, 0, 0, 0.04)',
              }
            }}
          />
        ))}
        {activeCategory && (
          <Button 
            variant="text" 
            size="small" 
            onClick={() => setActiveCategory(null)}
          >
            Clear Filter
          </Button>
        )}
      </Box>

      {/* Sizes Table */}
      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={filteredSizes.length > 0 && selectedSizes.length === filteredSizes.length}
                  indeterminate={selectedSizes.length > 0 && selectedSizes.length < filteredSizes.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Size Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Products Using</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSizes.map((size) => (
              <TableRow key={size.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSizes.includes(size.id)}
                    onChange={() => handleSelectOne(size.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label={size.name}
                      size="small"
                      sx={{
                        mr: 2,
                        bgcolor: '#e0f2fe',
                        color: '#0284c7',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>{size.description}</TableCell>
                <TableCell>
                  <Chip
                    label={size.category}
                    size="small"
                    sx={{
                      bgcolor: size.category === 'Adult' ? '#f0fdf4' : '#fff7ed',
                      color: size.category === 'Adult' ? '#16a34a' : '#ea580c',
                    }}
                  />
                </TableCell>
                <TableCell>{size.productsCount}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      sx={{
                        bgcolor: '#0ea5e9',
                        color: 'white',
                        '&:hover': { bgcolor: '#0284c7' }
                      }}
                      onClick={() => handleEdit(size.id)}
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
                      disabled={size.productsCount > 0}
                      onClick={() => handleDelete(size.id)}
                    >
                      <TrashIcon size={18} />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredSizes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No sizes found matching your search
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
      {isSizeModalOpen && currentSize && (
        <SizeEditModal
          open={isSizeModalOpen}
          onClose={() => setIsSizeModalOpen(false)}
          onSave={handleSaveSize}
          size={currentSize}
          isNew={!currentSize.id}
        />
      )}
      
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this size?`}
      />
    </Box>
  );
} 