'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import Typography from '@mui/material/Typography';

interface MaterialData {
  id?: string;
  name: string;
  description: string;
  quality: number;
  source?: string;
}

interface MaterialEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: MaterialData) => void;
  material?: MaterialData;
  isNew?: boolean;
}

export default function MaterialEditModal({
  open,
  onClose,
  onSave,
  material = { name: '', description: '', quality: 3, source: '' },
  isNew = true
}: MaterialEditModalProps): React.JSX.Element {
  const [formData, setFormData] = React.useState<MaterialData>({ name: '', description: '', quality: 3, source: '' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Reset form data when modal opens with new material data
  React.useEffect(() => {
    if (open) {
      setFormData(material);
      setErrors({});
    }
  }, [material, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRatingChange = (_: React.SyntheticEvent, value: number | null) => {
    setFormData(prev => ({ ...prev, quality: value || 0 }));
    
    // Clear error if it exists
    if (errors.quality) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.quality;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Material name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.quality <= 0) {
      newErrors.quality = 'Please select a quality rating';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? 'Add New Material' : 'Edit Material'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Material Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          name="description"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="dense"
          name="source"
          label="Source (optional)"
          type="text"
          fullWidth
          value={formData.source || ''}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth error={!!errors.quality} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography component="legend">Quality Rating:</Typography>
            <Rating
              name="quality"
              value={formData.quality}
              onChange={handleRatingChange}
              precision={0.5}
            />
          </Stack>
          {errors.quality && <FormHelperText>{errors.quality}</FormHelperText>}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {isNew ? 'Add Material' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 