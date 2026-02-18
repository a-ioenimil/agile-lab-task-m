import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/lib/api'

interface HealthResponse {
  status: string
}

async function fetchHealthStatus(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>('/health')
  return response.data
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: fetchHealthStatus,
    refetchInterval: 30000,
  })
}
