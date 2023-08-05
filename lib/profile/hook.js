import useSWR from 'swr';
import { fetcher } from '@/lib/fetch';

export function useProfile() {
  return useSWR(`/api/profile/`, fetcher);
}
