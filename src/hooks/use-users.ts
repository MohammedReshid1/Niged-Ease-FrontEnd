import { useCreateUser as useCreateUserFromAuth } from './use-auth-queries';

// Re-export for use in the UI components
export const useCreateUser = useCreateUserFromAuth; 