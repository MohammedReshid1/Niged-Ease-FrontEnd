import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Use environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mokfxuyqncysxmwivwfj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va2Z4dXlxbmN5c3htd2l2d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDEyNTIsImV4cCI6MjA2MzUxNzI1Mn0.8OQdFWEH9b7tLIER9uHUB7yffBb28y5LnITaB9uHdM0';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to sleep (for troubleshooting timing issues)
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bucket name is required'
      }, { status: 400 });
    }
    
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      return NextResponse.json({ 
        success: false, 
        error: `Error listing buckets: ${listError.message}`,
        details: { url: supabaseUrl }
      }, { status: 500 });
    }
    
    const bucketExists = buckets.some(b => b.name === name);
    if (bucketExists) {
      return NextResponse.json({
        success: true,
        message: `Bucket '${name}' already exists`,
        isNew: false
      });
    }
    
    console.log(`Creating bucket: ${name}...`);
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket(name, {
      public: true
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create bucket: ${error.message}`,
        details: { url: supabaseUrl }
      }, { status: 500 });
    }
    
    // Sleep a bit to ensure bucket creation propagates
    await sleep(1000);
    
    // Set up bucket policies for public access
    try {
      // Try to add policies manually since setPublic doesn't exist
      const { error: policyError } = await supabase.rpc('create_bucket_public_policy', {
        bucket_name: name
      });
      
      if (policyError) {
        console.log('Note: Custom RPC for policies failed, this is expected if the RPC doesn\'t exist');
      }
      
      console.log(`Successfully created bucket '${name}'`);
      
      return NextResponse.json({
        success: true,
        message: `Bucket '${name}' created successfully. You may need to set it as public manually in the Supabase dashboard.`,
        isNew: true
      });
    } catch (policyError: any) {
      console.error('Error setting bucket policies:', policyError);
      return NextResponse.json({
        success: true,
        message: `Bucket '${name}' created but failed to set policies. Please set them manually in the Supabase dashboard.`,
        isNew: true,
        policyError: true
      });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Unexpected error: ${error.message || 'Unknown error'}`
    }, { status: 500 });
  }
} 