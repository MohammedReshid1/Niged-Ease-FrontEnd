import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityLogsApi, ActivityLog, ActivityLogCreateData } from '@/services/api/activity-logs';

// Hook to fetch all activity logs
export function useActivityLogs() {
  return useQuery({
    queryKey: ['activity-logs'],
    queryFn: () => activityLogsApi.getActivityLogs(),
  });
}

// Hook to fetch activity logs for a specific company
export function useCompanyActivityLogs(companyId: string | undefined) {
  return useQuery({
    queryKey: ['activity-logs', 'company', companyId],
    queryFn: () => companyId ? activityLogsApi.getCompanyActivityLogs(companyId) : Promise.resolve([]),
    enabled: !!companyId,
  });
}

// Hook to create a new activity log
export function useCreateActivityLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ActivityLogCreateData) => activityLogsApi.createActivityLog(data),
    onSuccess: () => {
      // Invalidate activity logs queries to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
    },
  });
} 