# Supabase Storage Setup Guide

Follow these steps to properly set up Supabase Storage for your application.

## Step 1: Create Buckets in Supabase Dashboard

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to "Storage" in the left sidebar
4. Click "New Bucket" and create a bucket named `app-images`
   - Enable "Public bucket" option
   - Click "Create bucket"

## Step 2: Set Up RLS Policies

For the `app-images` bucket, add the following policies:

### SELECT policy (viewing files)
1. Click on the bucket, then click "Policies" tab
2. Click "Add policy" button next to SELECT
3. For policy name, enter: "Allow public file access"
4. For policy definition, enter:
   ```sql
   true
   ```
5. Click "Save policy"

### INSERT policy (uploading files)
1. Click "Add policy" button next to INSERT
2. For policy name, enter: "Allow anon uploads"
3. For policy definition, enter:
   ```sql
   true
   ```
   (Note: For production, you'd want to restrict this more)
4. Click "Save policy"

### UPDATE policy
1. Click "Add policy" button next to UPDATE
2. For policy name, enter: "Allow anon updates"
3. For policy definition, enter:
   ```sql
   true
   ```
4. Click "Save policy"

### DELETE policy
1. Click "Add policy" button next to DELETE
2. For policy name, enter: "Allow anon deletes"
3. For policy definition, enter:
   ```sql
   true
   ```
4. Click "Save policy"

## Step 3: Verify Setup

After applying these settings:
1. Go to the "Explorer" tab for your `app-images` bucket
2. Try uploading a test image using the "Upload file" button
3. If successful, you should see your file in the bucket

## Using in the App

Your app has been configured to use the `app-images` bucket. The ImageUpload component is set to:
- Upload to the `app-images` bucket
- Store files in folders based on usage (e.g., `profiles` folder)
- Return public URLs to your application

## Troubleshooting

If you continue to see permissions errors:
1. Double-check that all four policies (SELECT, INSERT, UPDATE, DELETE) are set correctly
2. Check that the bucket is marked as "Public"
3. Try logging out and back in to your Supabase dashboard
4. Try using a different browser for testing
5. Verify that your app is using the correct project URL and anon key

## Better Security for Production

For production environments, you should tighten these policies. For example:
- Restrict uploads to authenticated users only
- Limit file sizes
- Validate file types
- Add user-specific restrictions 