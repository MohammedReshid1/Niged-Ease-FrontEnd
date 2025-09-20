import { apiCall } from '@/utils/api-call';
import { Subscription } from '@/types/subscription';

/**
 * Get a company's subscription details
 * @param companyId - The ID of the company
 * @returns Promise with subscription details
 */
export async function getCompanySubscription(companyId: string): Promise<Subscription> {
  try {
    console.log(`Fetching subscription for company: ${companyId}`);
    const response = await apiCall({
      url: `/companies/companies/${companyId}/subscription/check/`,
      method: 'GET',
      removeApiPrefix: true, // Use the base URL without /api prefix
    });
    console.log('Company subscription response:', response);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching subscription for company ${companyId}:`, error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
}

/**
 * Renew a company's subscription
 * @param companyId - The ID of the company
 * @param planId - The ID of the subscription plan
 * @returns Promise with the updated subscription
 */
export async function renewCompanySubscription(companyId: string, planId: string): Promise<Subscription> {
  try {
    console.log(`Renewing subscription for company: ${companyId}, plan: ${planId}`);
    const response = await apiCall({
      url: `/companies/companies/${companyId}/subscription/renew/`,
      method: 'POST',
      data: { plan_id: planId },
      removeApiPrefix: true, // Use the base URL without /api prefix
    });
    console.log('Subscription renewal response:', response);
    return response.data;
  } catch (error: any) {
    console.error(`Error renewing subscription for company ${companyId}:`, error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    throw error;
  }
}

/**
 * Cancel a company's subscription
 * @param companyId - The ID of the company
 * @returns Promise with the result of the cancellation
 */
export async function cancelCompanySubscription(companyId: string): Promise<{ success: boolean }> {
  try {
    console.log(`Canceling subscription for company: ${companyId}`);
    const response = await apiCall({
      url: `/api/companies/${companyId}/subscription/cancel`,
      method: 'POST',
    });
    console.log('Subscription cancellation response:', response);
    return response.data;
  } catch (error: any) {
    console.error(`Error canceling subscription for company ${companyId}:`, error);
    throw error;
  }
}

/**
 * Change a company's subscription plan
 * @param companyId - The ID of the company
 * @param planId - The ID of the new subscription plan
 * @returns Promise with the updated subscription
 */
export async function changeCompanySubscriptionPlan(
  companyId: string, 
  planId: string
): Promise<Subscription> {
  try {
    console.log(`Changing subscription plan for company: ${companyId}, new plan: ${planId}`);
    const response = await apiCall({
      url: `/api/companies/${companyId}/subscription/change-plan`,
      method: 'POST',
      data: { plan_id: planId },
    });
    console.log('Subscription plan change response:', response);
    return response.data;
  } catch (error: any) {
    console.error(`Error changing subscription plan for company ${companyId}:`, error);
    throw error;
  }
} 