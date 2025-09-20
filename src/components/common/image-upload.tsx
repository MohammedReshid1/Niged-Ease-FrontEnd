import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, CircularProgress, Alert, Typography, IconButton } from '@mui/material';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';

import { uploadFile, deleteFile } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import ErrorMessage from './error-message';

interface ImageUploadProps {
  initialImage?: string;
  onImageChange: (url: string | null) => void;
  bucket: string;
  folder?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  initialImage,
  onImageChange,
  bucket,
  folder = '',
  label = 'Upload Image',
  width = 200,
  height = 200
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update imageUrl when initialImage changes
  useEffect(() => {
    setImageUrl(initialImage || null);
  }, [initialImage]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }
      
      // Use the API route instead of direct Supabase upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);
      formData.append('folder', folder || '');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }
      
      const { url } = await response.json();
      
      if (!url) {
        throw new Error('No URL returned from upload');
      }
      
      // Delete previous image if exists
      if (imageUrl) {
        try {
          // Extract the file path from the URL
          const path = imageUrl.split('/').slice(-1)[0];
          await deleteFile(path, bucket);
        } catch (deleteErr) {
          console.warn('Could not delete previous image', deleteErr);
          // Continue even if delete fails
        }
      }
      
      setImageUrl(url);
      onImageChange(url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Extract the file path from the URL
      const path = imageUrl.split('/').slice(-1)[0];
      const success = await deleteFile(path, bucket);
      
      if (!success) {
        throw new Error('Failed to delete image');
      }
      
      setImageUrl(null);
      onImageChange(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept="image/*"
        aria-label={`Upload ${label}`}
        title="Select image file to upload"
      />
      
      {/* Image Preview */}
      <Box
        sx={{
          width,
          height,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px dashed',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isUploading ? (
          <CircularProgress />
        ) : imageUrl ? (
          <>
            <Box 
              component="img" 
              src={imageUrl} 
              alt="Uploaded preview" 
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'action.hover' },
                boxShadow: 1,
              }}
              size="small"
              onClick={handleRemoveImage}
              aria-label="Remove image"
            >
              <XIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
            <ImageIcon size={48} weight="thin" />
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
              No image selected
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Upload Button */}
      <Button
        variant="outlined"
        startIcon={<UploadIcon />}
        onClick={handleUploadClick}
        disabled={isUploading}
        size="small"
      >
        {label}
      </Button>
      
      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error} 
          title="Upload Failed"
          onRetry={handleUploadClick}
        />
      )}
    </Box>
  );
}; 