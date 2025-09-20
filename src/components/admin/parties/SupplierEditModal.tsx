import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

export interface SupplierFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  is_active?: boolean;
  store_id?: string;
}

export interface SupplierEditModalProps {
  open: boolean;
  onClose: () => void;
  supplier?: SupplierFormData;
  onSave: (supplier: SupplierFormData) => void;
}

const initialFormState: SupplierFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  is_active: true,
};

const SupplierEditModal: React.FC<SupplierEditModalProps> = ({ open, onClose, supplier, onSave }) => {
  const [formState, setFormState] = React.useState<SupplierFormData>(initialFormState);
  const [errors, setErrors] = React.useState<Partial<Record<keyof SupplierFormData, string>>>({});

  // Reset form when modal opens or supplier changes
  React.useEffect(() => {
    if (open) {
      setFormState(supplier ? { ...supplier } : { ...initialFormState });
      setErrors({});
    }
  }, [open, supplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormState((prev) => ({ ...prev, [name]: value }));
      // Clear error when field is edited
      if (errors[name as keyof SupplierFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    if (name) {
      setFormState((prev) => ({ ...prev, [name]: value === 'true' }));
      if (errors[name as keyof SupplierFormData]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof SupplierFormData, string>> = {};

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!formState.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formState);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">{supplier?.id ? 'Edit Supplier' : 'Add New Supplier'}</Typography>
        <IconButton aria-label="close" onClick={onClose} size="small">
          <XIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="name"
              label="Supplier Name"
              fullWidth
              value={formState.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formState.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="phone"
              label="Phone"
              fullWidth
              value={formState.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Address
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              value={formState.address || ''}
              onChange={handleChange}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="is_active-label">Status</InputLabel>
              <Select
                labelId="is_active-label"
                name="is_active"
                value={formState.is_active === undefined ? 'true' : formState.is_active.toString()}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="true">Active</MenuItem>
                <MenuItem value="false">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: 'rgba(0, 0, 0, 0.23)', color: 'text.primary' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {supplier?.id ? 'Update Supplier' : 'Save Supplier'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierEditModal;
