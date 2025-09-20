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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

interface Size {
  id: string;
  name: string;
  code: string;
  type: 'numeric' | 'letter' | 'international';
  order: number;
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

export default function SizesPage(): React.JSX.Element {
  const sizeTypes = [
    { value: 'numeric', label: 'Numeric' },
    { value: 'letter', label: 'Letter' },
    { value: 'international', label: 'International' },
  ];

  const [sizes, setSizes] = useState<Size[]>([
    { id: '1', name: 'Extra Small', code: 'XS', type: 'letter', order: 1 },
    { id: '2', name: 'Small', code: 'S', type: 'letter', order: 2 },
    { id: '3', name: 'Medium', code: 'M', type: 'letter', order: 3 },
    { id: '4', name: 'Large', code: 'L', type: 'letter', order: 4 },
    { id: '5', name: 'Extra Large', code: 'XL', type: 'letter', order: 5 },
    { id: '6', name: 'Size 36', code: '36', type: 'numeric', order: 1 },
    { id: '7', name: 'Size 38', code: '38', type: 'numeric', order: 2 },
    { id: '8', name: 'Size 40', code: '40', type: 'numeric', order: 3 },
    { id: '9', name: 'Size 42', code: '42', type: 'numeric', order: 4 },
  ]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentSize, setCurrentSize] = useState<Size | null>(null);
  const [newSize, setNewSize] = useState<Partial<Size>>({ 
    name: '', 
    code: '', 
    type: 'letter', 
    order: 0 
  });
  const [error, setError] = useState<string | null>(null);

  const handleOpenAddDialog = () => {
    setNewSize({ name: '', code: '', type: 'letter', order: sizes.length + 1 });
    setOpenAddDialog(true);
    setError(null);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (size: Size) => {
    setCurrentSize(size);
    setNewSize({ 
      name: size.name, 
      code: size.code,
      type: size.type,
      order: size.order
    });
    setOpenEditDialog(true);
    setError(null);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenDeleteDialog = (size: Size) => {
    setCurrentSize(size);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleAddSize = () => {
    if (!newSize.name || !newSize.code) {
      setError('Name and Code are required');
      return;
    }

    const id = (Math.max(...sizes.map(s => parseInt(s.id)), 0) + 1).toString();
    setSizes([...sizes, { 
      id, 
      name: newSize.name, 
      code: newSize.code,
      type: newSize.type as 'numeric' | 'letter' | 'international',
      order: newSize.order || sizes.length + 1
    }]);
    handleCloseAddDialog();
  };

  const handleEditSize = () => {
    if (!newSize.name || !newSize.code) {
      setError('Name and Code are required');
      return;
    }

    if (!currentSize) return;

    setSizes(sizes.map(size => 
      size.id === currentSize.id 
        ? { 
            ...size, 
            name: newSize.name!, 
            code: newSize.code!,
            type: newSize.type as 'numeric' | 'letter' | 'international',
            order: newSize.order || size.order
          } 
        : size
    ));
    handleCloseEditDialog();
  };

  const handleDeleteSize = () => {
    if (!currentSize) return;
    setSizes(sizes.filter(size => size.id !== currentSize.id));
    handleCloseDeleteDialog();
  };

  const getSizeTypeName = (type: string) => {
    const sizeType = sizeTypes.find(t => t.value === type);
    return sizeType ? sizeType.label : type;
  };

  // Sort sizes by type and then by order
  const sortedSizes = [...sizes].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    return a.order - b.order;
  });

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <PageHeading 
              title="Clothing Sizes Management" 
              actions={
                <Button
                  startIcon={<PlusIcon />}
                  variant="contained"
                  onClick={handleOpenAddDialog}
                >
                  Add Size
                </Button>
              }
            />
            <Card sx={{ boxShadow: 2, borderRadius: 2 }}>
              <CardHeader title="Sizes" />
              <CardContent>
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Order</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedSizes.map((size) => (
                        <TableRow
                          key={size.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {size.id}
                          </TableCell>
                          <TableCell>{size.name}</TableCell>
                          <TableCell>{size.code}</TableCell>
                          <TableCell>{getSizeTypeName(size.type)}</TableCell>
                          <TableCell>{size.order}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenEditDialog(size)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(size)}
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

      {/* Add Size Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Size</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Size Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newSize.name}
              onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="code"
              label="Size Code"
              type="text"
              fullWidth
              variant="outlined"
              value={newSize.code}
              onChange={(e) => setNewSize({ ...newSize, code: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="type-label">Size Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={newSize.type}
                label="Size Type"
                onChange={(e) => setNewSize({ ...newSize, type: e.target.value as 'numeric' | 'letter' | 'international' })}
              >
                {sizeTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="order"
              label="Display Order"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ min: 1 }}
              value={newSize.order}
              onChange={(e) => setNewSize({ ...newSize, order: parseInt(e.target.value) })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddSize} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Size Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Size</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="editName"
              label="Size Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newSize.name}
              onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
            />
            <TextField
              margin="dense"
              id="editCode"
              label="Size Code"
              type="text"
              fullWidth
              variant="outlined"
              value={newSize.code}
              onChange={(e) => setNewSize({ ...newSize, code: e.target.value })}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="edit-type-label">Size Type</InputLabel>
              <Select
                labelId="edit-type-label"
                id="editType"
                value={newSize.type}
                label="Size Type"
                onChange={(e) => setNewSize({ ...newSize, type: e.target.value as 'numeric' | 'letter' | 'international' })}
              >
                {sizeTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              id="editOrder"
              label="Display Order"
              type="number"
              fullWidth
              variant="outlined"
              inputProps={{ min: 1 }}
              value={newSize.order}
              onChange={(e) => setNewSize({ ...newSize, order: parseInt(e.target.value) })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleEditSize} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Size Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Size</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the size "{currentSize?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteSize} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 