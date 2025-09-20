'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Paper
} from '@mui/material';

export default function StorageTestPage() {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newBucketName, setNewBucketName] = useState('');
  const [createResult, setCreateResult] = useState<string | null>(null);
  const [createStatus, setCreateStatus] = useState<'success' | 'error' | null>(null);

  // Fetch list of buckets
  const fetchBuckets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to fetch buckets');
        setBuckets([]);
        return;
      }
      
      if (typeof data.buckets === 'string') {
        if (data.buckets.includes(',')) {
          setBuckets(data.buckets.split(',').map((b: string) => b.trim()));
        } else if (data.buckets === 'No buckets found in this project') {
          setBuckets([]);
        } else {
          setBuckets([data.buckets]);
        }
      } else {
        setBuckets([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to API');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new bucket
  const createBucket = async () => {
    if (!newBucketName.trim()) {
      setCreateStatus('error');
      setCreateResult('Bucket name is required');
      return;
    }
    
    setIsLoading(true);
    setCreateResult(null);
    setCreateStatus(null);
    
    try {
      const response = await fetch('/api/storage/create-bucket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newBucketName })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCreateStatus('success');
        setCreateResult(`Bucket '${newBucketName}' created successfully`);
        setNewBucketName('');
        // Refresh bucket list
        fetchBuckets();
      } else {
        setCreateStatus('error');
        setCreateResult(data.error || 'Failed to create bucket');
      }
    } catch (err: any) {
      setCreateStatus('error');
      setCreateResult(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load buckets on page load
  useEffect(() => {
    fetchBuckets();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Supabase Storage Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4 }}>
        This page helps diagnose issues with Supabase storage buckets and permissions.
      </Typography>
      
      <Stack spacing={3}>
        {/* Available Buckets */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Available Buckets</Typography>
              <Button 
                variant="outlined" 
                onClick={fetchBuckets}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </Box>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : buckets.length === 0 ? (
              <Alert severity="info">No buckets found in this Supabase project</Alert>
            ) : (
              <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
                <List dense>
                  {buckets.map((bucket, index) => (
                    <div key={bucket}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        <ListItemText primary={bucket} />
                      </ListItem>
                    </div>
                  ))}
                </List>
              </Paper>
            )}
          </CardContent>
        </Card>
        
        {/* Create New Bucket */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Create New Bucket
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
              <TextField
                fullWidth
                label="Bucket Name"
                value={newBucketName}
                onChange={(e) => setNewBucketName(e.target.value)}
                disabled={isLoading}
                helperText="Bucket names can only contain lowercase letters, numbers, and hyphens"
              />
              <Button
                variant="contained"
                onClick={createBucket}
                disabled={isLoading || !newBucketName.trim()}
                sx={{ height: 56 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Create'}
              </Button>
            </Box>
            
            {createResult && (
              <Alert severity={createStatus || 'info'}>
                {createResult}
              </Alert>
            )}
          </CardContent>
        </Card>
        
        {/* Supabase Info */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Supabase Configuration
            </Typography>
            
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              <strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mokfxuyqncysxmwivwfj.supabase.co'}
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              Make sure you have created the buckets in the correct Supabase project.
            </Alert>
            
            <Typography variant="body2" gutterBottom>
              If you're seeing bucket access issues:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="1. Check that the bucket exists in the Supabase dashboard" />
              </ListItem>
              <ListItem>
                <ListItemText primary="2. Ensure RLS policies allow bucket operations (INSERT, SELECT, etc.)" />
              </ListItem>
              <ListItem>
                <ListItemText primary="3. Verify that the anon key has the necessary permissions" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
} 