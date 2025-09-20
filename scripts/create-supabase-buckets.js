#!/usr/bin/env node

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mokfxuyqncysxmwivwfj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va2Z4dXlxbmN5c3htd2l2d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDEyNTIsImV4cCI6MjA2MzUxNzI1Mn0.8OQdFWEH9b7tLIER9uHUB7yffBb28y5LnITaB9uHdM0';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Buckets to create
const buckets = [
  {
    id: 'avatars',
    public: true,
    description: 'User profile images'
  },
  {
    id: 'products',
    public: true,
    description: 'Product images'
  },
  {
    id: 'companies',
    public: true,
    description: 'Company logos and images'
  },
  {
    id: 'documents',
    public: false,
    description: 'Private documents and files'
  }
];

// Create buckets
async function createBuckets() {
  console.log('Creating Supabase storage buckets...');
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: existingBuckets } = await supabase.storage.listBuckets();
      const bucketExists = existingBuckets.some(b => b.name === bucket.id);
      
      if (bucketExists) {
        console.log(`Bucket '${bucket.id}' already exists.`);
        continue;
      }
      
      // Create bucket
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      });
      
      if (error) {
        console.error(`Error creating bucket '${bucket.id}':`, error.message);
      } else {
        console.log(`Created bucket '${bucket.id}' successfully.`);
        
        // Update bucket if needed
        if (bucket.public) {
          const { error: updateError } = await supabase.storage.updateBucket(bucket.id, {
            public: true
          });
          
          if (updateError) {
            console.error(`Error making bucket '${bucket.id}' public:`, updateError.message);
          } else {
            console.log(`Made bucket '${bucket.id}' publicly accessible.`);
          }
        }
      }
    } catch (err) {
      console.error(`Unexpected error with bucket '${bucket.id}':`, err);
    }
  }
  
  console.log('Bucket creation process completed.');
}

// Run the script
createBuckets()
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  }); 