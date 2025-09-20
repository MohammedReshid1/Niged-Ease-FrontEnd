'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import { SimpleUpload } from '@/components/common/simple-upload';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mokfxuyqncysxmwivwfj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va2Z4dXlxbmN5c3htd2l2d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDEyNTIsImV4cCI6MjA2MzUxNzI1Mn0.8OQdFWEH9b7tLIER9uHUB7yffBb28y5LnITaB9uHdM0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TestBucketPage() {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState('default');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(undefined);
  const [createBucketName, setCreateBucketName] = useState('');
  const [creatingBucket, setCreatingBucket] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Fetch available buckets
  const fetchBuckets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        throw new Error(`Failed to list buckets: ${error.message}`);
      }
      
      setBuckets(data.map(bucket => bucket.name));
      
      if (data.length > 0 && !bucketName) {
        setBucketName(data[0].name);
      }
      
    } catch (err: any) {
      console.error('Error fetching buckets:', err);
      setError(err.message || 'Failed to fetch buckets');
    } finally {
      setLoading(false);
    }
  };

  // Create a new bucket
  const handleCreateBucket = async () => {
    if (!createBucketName) return;
    
    setCreatingBucket(true);
    setCreateError(null);
    
    try {
      const { data, error } = await supabase.storage.createBucket(createBucketName, {
        public: true
      });
      
      if (error) {
        throw new Error(`Failed to create bucket: ${error.message}`);
      }
      
      // Refresh the buckets list
      fetchBuckets();
      setCreateBucketName('');
      
    } catch (err: any) {
      console.error('Error creating bucket:', err);
      setCreateError(err.message || 'Failed to create bucket');
    } finally {
      setCreatingBucket(false);
    }
  };

  // Load buckets on mount
  useEffect(() => {
    fetchBuckets();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Supabase Storage Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        This page allows you to test Supabase Storage functionality directly.
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Buckets
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Button
                  variant="outlined"
                  onClick={fetchBuckets}
                  disabled={loading}
                  sx={{ mr: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Refresh Buckets'}
                </Button>
                
                <Typography color="text.secondary" variant="body2">
                  {buckets.length} bucket(s) found
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {buckets.length > 0 ? (
                <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <List dense>
                    {buckets.map((bucket, index) => (
                      <ListItem
                        key={bucket}
                        button
                        selected={bucketName === bucket}
                        onClick={() => setBucketName(bucket)}
                      >
                        <ListItemText primary={bucket} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Alert severity="info">
                  No buckets found. Create one below to get started.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Create New Bucket
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Bucket Name"
                  value={createBucketName}
                  onChange={(e) => setCreateBucketName(e.target.value)}
                  placeholder="my-bucket"
                  disabled={creatingBucket}
                  helperText="Use lowercase letters, numbers and hyphens only"
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="contained"
                  onClick={handleCreateBucket}
                  disabled={!createBucketName || creatingBucket}
                >
                  {creatingBucket ? <CircularProgress size={24} /> : 'Create'}
                </Button>
              </Box>
              
              {createError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {createError}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Bucket: {bucketName || 'No bucket selected'}
              </Typography>
              
              {!bucketName ? (
                <Alert severity="info">
                  Select a bucket from the list above to test uploads.
                </Alert>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="Bucket Name"
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    sx={{ mb: 3 }}
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Upload Test
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <SimpleUpload
                      initialImage={uploadedImageUrl}
                      onImageChange={setUploadedImageUrl}
                      bucketName={bucketName}
                      folderPath="test-uploads"
                      label="Test Upload"
                      width={150}
                      height={150}
                    />
                  </Box>
                  
                  {uploadedImageUrl && (
                    <Box mt={2}>
                      <Typography variant="body2" gutterBottom>
                        Uploaded Image URL:
                      </Typography>
                      <Paper variant="outlined" sx={{ p: 1 }}>
                        <Typography
                          variant="caption"
                          component="div"
                          sx={{
                            wordBreak: 'break-all',
                            fontFamily: 'monospace',
                            fontSize: '12px'
                          }}
                        >
                          {uploadedImageUrl}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 