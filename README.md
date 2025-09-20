# Frontend Application

This is the frontend application for our project. It's built with Next.js, Material UI, and uses Supabase for storage.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd front
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mokfxuyqncysxmwivwfj.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va2Z4dXlxbmN5c3htd2l2d2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDEyNTIsImV4cCI6MjA2MzUxNzI1Mn0.8OQdFWEH9b7tLIER9uHUB7yffBb28y5LnITaB9uHdM0
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Supabase Storage Setup

For image uploads and storage, we use Supabase Storage. Follow these steps to set up the required buckets:

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to "Storage" in the left sidebar
4. Create the following buckets:

### Required Buckets

1. **avatars**
   - Description: User profile images
   - Public access: Yes

2. **products**
   - Description: Product images
   - Public access: Yes

3. **companies**
   - Description: Company logos and images
   - Public access: Yes

4. **documents**
   - Description: Private documents and files
   - Public access: No

### Bucket Permissions

For public buckets (avatars, products, companies), set the following policies:

1. Create a policy for anonymous users to view files:
   - Policy name: "Anyone can view"
   - Policy definition: `bucket_id = '<bucket-name>' AND auth.role() = 'anon'`
   - Operation: SELECT

2. Create a policy for authenticated users to upload files:
   - Policy name: "Authenticated users can upload"
   - Policy definition: `bucket_id = '<bucket-name>' AND auth.role() = 'authenticated'`
   - Operation: INSERT

3. Create a policy for authenticated users to update their own files:
   - Policy name: "Users can update own files"
   - Policy definition: `bucket_id = '<bucket-name>' AND auth.role() = 'authenticated'`
   - Operation: UPDATE

4. Create a policy for authenticated users to delete their own files:
   - Policy name: "Users can delete own files"
   - Policy definition: `bucket_id = '<bucket-name>' AND auth.role() = 'authenticated'`
   - Operation: DELETE

## Features

- User authentication and management
- Company and store management
- Image upload with Supabase storage
- Error handling with custom ErrorMessage component
- Responsive design with Material UI

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: Reusable React components
- `/src/hooks`: Custom React hooks
- `/src/services`: API services
- `/src/lib`: Utility libraries
- `/src/utils`: Helper functions 