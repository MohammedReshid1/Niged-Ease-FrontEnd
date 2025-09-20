'use client';

import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
// @ts-ignore - Bypassing type check for react-colorful
import { HexColorPicker } from 'react-colorful';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface ColorData {
  id?: string;
  name: string;
  description: string;
  hexCode: string;
}

interface ColorEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ColorData) => void;
  color?: ColorData;
  isNew?: boolean;
}

export default function ColorEditModal({
  open,
  onClose,
  onSave,
  color = { name: '', description: '', hexCode: '#3B82F6' },
  isNew = true
}: ColorEditModalProps): React.JSX.Element {
  const { t } = useTranslation('admin');
  const [formData, setFormData] = React.useState<ColorData>({ name: '', description: '', hexCode: '#3B82F6' });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  // Reset form data when modal opens with new color data
  React.useEffect(() => {
    if (open) {
      setFormData(color);
      setErrors({});
    }
  }, [color, open]);

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

  const handleColorChange = (hexCode: string) => {
    setFormData(prev => ({ ...prev, hexCode }));
    
    // Clear error if it exists
    if (errors.hexCode) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.hexCode;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('clothing.colors.color_name_required');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = t('clothing.colors.description_required');
    }
    
    // Validate hex color code using regex
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.hexCode)) {
      newErrors.hexCode = t('clothing.colors.valid_hex_required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    console.log('Validating color data:', formData);
    if (validateForm()) {
      console.log('Color data validation passed');
      
      // Create a copy of the data to ensure we don't have any issues with reactivity
      const colorData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        hexCode: formData.hexCode.toUpperCase() // Normalize hex code
      };
      
      // Add ID if we're editing
      if (color.id) {
        colorData.id = color.id;
      }
      
      console.log('Submitting color data:', colorData);
      onSave(colorData);
    } else {
      console.log('Color validation failed with errors:', errors);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isNew ? t('clothing.colors.add_color') : t('clothing.colors.edit_color')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label={t('clothing.colors.color_name')}
              type="text"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              margin="dense"
              name="description"
              label={t('common.description')}
              type="text"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="subtitle1">{t('clothing.colors.title')}</Typography>
              <TextField
                margin="dense"
                name="hexCode"
                label={t('clothing.colors.color_code')}
                type="text"
                value={formData.hexCode}
                onChange={handleChange}
                error={!!errors.hexCode}
                helperText={errors.hexCode}
                sx={{ mb: 2 }}
              />
              <FormControl error={!!errors.hexCode} fullWidth>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <HexColorPicker color={formData.hexCode} onChange={handleColorChange} />
                </Box>
              </FormControl>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              borderRadius: 1, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 60,
              bgcolor: formData.hexCode
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: getContrastText(formData.hexCode),
                  fontWeight: 'bold'
                }}
              >
                {formData.name || t('clothing.colors.color_preview')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common.cancel')}</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          sx={{ bgcolor: '#0ea5e9', '&:hover': { bgcolor: '#0284c7' } }}
        >
          {isNew ? t('clothing.colors.add_color') : t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// Helper function to determine text color based on background color brightness
function getContrastText(hexColor: string): string {
  // Remove the leading # if it exists
  const hex = hexColor.replace('#', '');
  
  // Parse the hex values to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate the brightness (using a simplified formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return white for dark colors, black for light colors
  return brightness > 128 ? '#000000' : '#FFFFFF';
} 