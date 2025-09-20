import { userManagementApiClient } from './client';

export interface ActivityLog {
  id: string;
  user: string;
  user_email: string;
  action: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogCreateData {
  action: string;
  description: string;
}

export const activityLogsApi = {
  // Get all activity logs
  getActivityLogs: async (): Promise<ActivityLog[]> => {
    const response = await userManagementApiClient.get<ActivityLog[]>('/activity-logs/');
    return response.data;
  },

  // Get activity logs for a specific company
  getCompanyActivityLogs: async (companyId: string): Promise<ActivityLog[]> => {
    const response = await userManagementApiClient.get<ActivityLog[]>(`/activity-logs/company/${companyId}/`);
    return response.data;
  },

  // Create a new activity log
  createActivityLog: async (data: ActivityLogCreateData): Promise<ActivityLog> => {
    const response = await userManagementApiClient.post<ActivityLog>('/activity-logs/', data);
    return response.data;
  }
}; 