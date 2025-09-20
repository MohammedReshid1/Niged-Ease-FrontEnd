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
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { TrashSimple as DeleteIcon } from '@phosphor-icons/react/dist/ssr/TrashSimple';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

interface Material {
  id: string;
  name: string;
  description: string;
  composition: string;
}

interface PageHeadingProps {
  title: string;
  actions?: React.ReactNode;
}

const PageHeading = ({ title, actions }: PageHeadingProps) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
    <Typography variant="h4">{title}</Typography>
    {actions}
  </Stack>
);

export default function MaterialsPage(): React.JSX.Element {
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', name: 'Cotton', description: 'Soft and breathable natural fabric', composition: '100% Cotton' },
    { id: '2', name: 'Polyester', description: 'Durable synthetic fabric', composition: '100% Polyester' },
    { id: '3', name: 'Cotton-Polyester Blend', description: 'Blend of cotton and polyester', composition: '60% Cotton, 40% Polyester' },
    { id: '4', name: 'Wool', description: 'Natural fabric from sheep wool', composition: '100% Wool' },
    { id: '5', name: 'Linen', description: 'Light and breathable natural fabric', composition: '100% Linen' },
    { id: '6', name: 'Silk', description: 'Luxurious natural fabric', composition: '100% Silk' },
    { id: '7', name: 'Nylon', description: 'Strong synthetic fabric', composition: '100% Nylon' },
    { id: '8', name: 'Spandex', description: 'Stretchy synthetic fabric', composition: '100% Spandex' },
  ]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({ 
    name: '', 
    description: '', 
    composition: '' 
  });
  const [error, setError] = useState<string | null>(null);

  const handleOpenAddDialog = () => {
    setNewMaterial({ name: '', description: '', composition: '' });
    setOpenAddDialog(true);
    setError(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (material: Material) => {
    setCurrentMaterial(material);
    setNewMaterial({ 
      name: material.name, 
      description: material.description,
      composition: material.composition
    });
    setOpenEditDialog(true);
    setError(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (material: Material) => {
    setCurrentMaterial(material);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleAddMaterial = () => {
    if (!newMaterial.name) {
      setError('Material name is required');
      return;
    }

    const id = (Math.max(...materials.map(m => parseInt(m.id)), 0) + 1).toString();
    setMaterials([...materials, { 
      id, 
      name: newMaterial.name, 
      description: newMaterial.description || '',
      composition: newMaterial.composition || ''
    }]);
    handleCloseAddDialog();
  };

  const handleEditMaterial = () => {
    if (!newMaterial.name) {
      setError('Material name is required');
      return;
    }

    if (!currentMaterial) return;

    setMaterials(materials.map(material => 
      material.id === currentMaterial.id 
        ? { 
            ...material, 
            name: newMaterial.name!, 
            description: newMaterial.description || '',
            composition: newMaterial.composition || ''
          } 
        : material
    ));
    handleCloseEditDialog();
  };

  const handleDeleteMaterial = () => {
    if (!currentMaterial) return;
    setMaterials(materials.filter(material => material.id !== currentMaterial.id));
    handleCloseDeleteDialog();
  };

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title="Clothing Materials Management" 
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                >
                  Add Material
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title="Materials" />
              <CardContent>
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Composition</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materials.map((material) => (
                        <TableRow
                          key={material.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {material.id}
                          </TableCell>
                          <TableCell>{material.name}</TableCell>
                          <TableCell>{material.description}</TableCell>
                          <TableCell>{material.composition}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenEditDialog(material)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(material)}
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
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* Add Material Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Material</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Material Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
            />
            <TextField
              margin="dense"
              id="composition"
              label="Composition"
              type="text"
              fullWidth
              variant="outlined"
              helperText="E.g., '100% Cotton' or '60% Cotton, 40% Polyester'"
              value={newMaterial.composition}
              onChange={(e) => setNewMaterial({ ...newMaterial, composition: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddMaterial} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Material</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="editName"
              label="Material Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newMaterial.name}
              onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="editDescription"
              label="Description"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
            />
            <TextField
              margin="dense"
              id="editComposition"
              label="Composition"
              type="text"
              fullWidth
              variant="outlined"
              helperText="E.g., '100% Cotton' or '60% Cotton, 40% Polyester'"
              value={newMaterial.composition}
              onChange={(e) => setNewMaterial({ ...newMaterial, composition: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditMaterial} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Material Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Material</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the material "{currentMaterial?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteMaterial} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 