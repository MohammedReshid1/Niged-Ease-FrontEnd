import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

/**
 * Upload a file to Supabase Storage
 * @param file File to upload
 * @param bucket Bucket name
 * @param folder Folder path inside the bucket (optional)
 * @returns URL of the uploaded file or null if upload failed
 */
export async function uploadFile(file: File, bucket: string, folder: string = ''): Promise<string | null> {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    // For public usage, we'll try direct upload without authentication
    // You need to set a policy that allows public uploads
    // This works when using the anon key
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath Full path of the file to delete
 * @param bucket Bucket name
 * @returns true if successful, false otherwise
 */
export async function deleteFile(filePath: string, bucket: string): Promise<boolean> {
  try {
    // Extract just the filename from a full URL if needed
    const path = filePath.includes('/')
      ? filePath.split('/').slice(-1)[0]
      : filePath;
      
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in delete process:', error);
    return false;
  }
} 