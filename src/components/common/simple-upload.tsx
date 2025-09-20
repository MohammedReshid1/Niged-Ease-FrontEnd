'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Alert, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import ErrorMessage from './error-message';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SimpleUploadProps {
  initialImage?: string;
  onImageChange: (url: string) => void;
  bucketName: string;
  folderPath?: string;
  label?: string;
  width?: number;
  height?: number;
  allowRemove?: boolean;
  readOnly?: boolean;
}

export const SimpleUpload: React.FC<SimpleUploadProps> = ({
  initialImage,
  onImageChange,
  bucketName,
  folderPath = '',
  label = 'Upload Image',
  width = 200,
  height = 200,
  allowRemove = true,
  readOnly = false,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(initialImage);
  }, [initialImage]);

  // Reset the file input when image is removed
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!imageUrl && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [imageUrl]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setIsUploading(true);
    setError(null);

    try {
      // Validate file is an image
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      // Upload to Supabase
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      setImageUrl(publicUrl);
      onImageChange(publicUrl);

    } catch (err: any) {
      console.error('Error uploading image:', err);
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the file input click
    setImageUrl(undefined);
    onImageChange('');
  };

  return (
    <Box>
      <input
        accept="image/*"
        type="file"
        id="upload-image"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
        disabled={isUploading || readOnly}
      />
      
      <label htmlFor="upload-image">
        <Box
          sx={{
            width,
            height,
            border: '2px dashed #ccc',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: readOnly ? 'default' : (isUploading ? 'wait' : 'pointer'),
            position: 'relative',
            overflow: 'hidden',
            '&:hover': readOnly ? {} : {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {imageUrl ? (
            <>
              <Box
                component="img"
                src={imageUrl}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={() => {
                  setError('Failed to load image');
                  setImageUrl(undefined);
                }}
                alt="Uploaded"
              />
              {allowRemove && !readOnly && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 5,
                    right: 5,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    zIndex: 2,
                  }}
                  onClick={handleRemoveImage}
                  size="small"
                  color="error"
                  aria-label="remove image"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </>
          ) : (
            <>
              <AddPhotoAlternateIcon fontSize="large" color="action" />
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                {readOnly ? 'No image available' : label}
              </Typography>
            </>
          )}
          
          {isUploading && (
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <CircularProgress size={40} />
            </Box>
          )}
        </Box>
      </label>
      
      {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}
    </Box>
  );
}; 