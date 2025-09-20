import { QueryClient } from '@tanstack/react-query';

/**
 * Helper functions for debugging TanStack Query state
 */
export const QueryDebugging = {
  /**
   * Print all active queries in the console
   * @param queryClient The QueryClient instance
   */
  logActiveQueries: (queryClient: QueryClient) => {
    console.group('Active Queries');
    
    const queries = queryClient.getQueryCache().getAll();
    
    if (queries.length === 0) {
      console.log('No active queries');
    } else {
      queries.forEach(query => {
        console.group(`Query: ${query.queryKey.join(', ')}`);
        console.log('Data:', query.state.data);
        console.log('Status:', query.state.status);
        console.log('Fetching:', query.state.fetchStatus);
        console.log('Last Updated:', new Date(query.state.dataUpdatedAt).toLocaleTimeString());
        console.groupEnd();
      });
    }
    
    console.groupEnd();
  },
  
  /**
   * Print specifics about a query by its key
   * @param queryClient The QueryClient instance
   * @param queryKey The query key to look up
   */
  logQueryDetails: (queryClient: QueryClient, queryKey: unknown[]) => {
    const query = queryClient.getQueryCache().find({ queryKey });
    
    if (!query) {
      console.log(`No query found with key: ${queryKey.join(', ')}`);
      return;
    }
    
    console.group(`Query Details: ${queryKey.join(', ')}`);
    console.log('Data:', query.state.data);
    console.log('Status:', query.state.status);
    console.log('Fetching:', query.state.fetchStatus);
    console.log('Error:', query.state.error);
    console.log('Last Updated:', new Date(query.state.dataUpdatedAt).toLocaleTimeString());
    console.log('Is Stale:', query.isStale());
    console.groupEnd();
  },
  
  /**
   * Manually refetch a query by its key
   * @param queryClient The QueryClient instance
   * @param queryKey The query key to refetch
   */
  refetchQuery: async (queryClient: QueryClient, queryKey: unknown[]) => {
    console.log(`Refetching query: ${queryKey.join(', ')}`);
    await queryClient.refetchQueries({ queryKey });
    console.log('Refetch complete');
  }
}; 