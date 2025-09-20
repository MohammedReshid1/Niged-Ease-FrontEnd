import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mokfxuyqncysxmwivwfj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va2Z4dXlxbmN5c3htd2l2d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDEyNTIsImV4cCI6MjA2MzUxNzI1Mn0.8OQdFWEH9b7tLIER9uHUB7yffBb28y5LnITaB9uHdM0';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to list all buckets (for debugging)
async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error);
    return `Error listing buckets: ${error.message}`;
  }
  
  if (!data || data.length === 0) {
    return 'No buckets found in this project';
  }
  
  return data.map(b => b.name).join(', ');
}

// API endpoint to simply list all buckets
export async function GET() {
  try {
    const bucketsInfo = await listBuckets();
    return NextResponse.json({ 
      success: true, 
      message: 'Available buckets',
      buckets: bucketsInfo
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: `Error listing buckets: ${error.message}` 
    }, { status: 500 });
  }
}

// Helper function to create a bucket if it doesn't exist
async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket '${bucketName}' already exists`);
      return true;
    }
    
    // Create bucket if it doesn't exist
    console.log(`Attempting to create bucket '${bucketName}'`);
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });
    
    if (error) {
      console.error(`Failed to create bucket '${bucketName}':`, error);
      return false;
    }
    
    console.log(`Successfully created bucket '${bucketName}'`);
    return true;
  } catch (error) {
    console.error('Error in ensureBucketExists:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Parse the formData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as string || 'products';
    const folder = formData.get('folder') as string || '';
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'File is required' 
      }, { status: 400 });
    }
    
    // Validate file type (optional)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Only image files are allowed' 
      }, { status: 400 });
    }
    
    // Always try to ensure the "products" bucket exists as a fallback
    await ensureBucketExists('products');
    
    // Then ensure the specified bucket exists
    if (bucket !== 'products') {
      await ensureBucketExists(bucket);
    }
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // Read file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    console.log(`Attempting to upload to bucket: ${bucket}, path: ${filePath}`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      
      // Get updated list of buckets after upload attempt
      const updatedBuckets = await listBuckets();
      
      return NextResponse.json({ 
        success: false, 
        error: `Upload failed: ${error.message}`,
        details: {
          bucket,
          path: filePath,
          errorMessage: error.message,
          availableBuckets: updatedBuckets,
          projectUrl: supabaseUrl
        }
      }, { status: 500 });
    }

    // Get public URL for the file
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl 
    });
    
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Internal server error: ${error.message || 'Unknown error'}`,
      supabaseUrl
    }, { status: 500 });
  }
} 