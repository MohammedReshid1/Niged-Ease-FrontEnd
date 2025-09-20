import { useQuery } from '@tanstack/react-query';
import { storesApi } from '@/services/api/stores';
import { useCurrentUser } from './use-auth';

export const useStores = () => {
  const { userInfo } = useCurrentUser();
  
  return useQuery({
    queryKey: ['stores', userInfo?.id],
    queryFn: () => storesApi.getStores(),
    enabled: !!userInfo?.id
  });
}; 