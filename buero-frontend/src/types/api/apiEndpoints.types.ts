import { API_ENDPOINTS, PUBLIC_ENDPOINT_PREFIXE } from '@/api/apiEndpoints';

type ApiEndpoints = typeof API_ENDPOINTS;

type PublicApiEndpoints = (typeof PUBLIC_ENDPOINT_PREFIXE)[number];

export type { ApiEndpoints, PublicApiEndpoints };
