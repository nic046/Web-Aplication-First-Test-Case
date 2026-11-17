import type { APIRequestContext, APIResponse } from '@playwright/test';

type LoginResponse = {
  success: boolean;
  token: string;
};

const requiredEnvironmentValue = (name: string): string => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const getApiBaseUrl = (): string => {
  const configuredUrl = new URL(requiredEnvironmentValue('API_URL'));
  const configuredPath = configuredUrl.pathname
    .replace(/\/api\/docs(?:\/.*)?$/, '/api')
    .replace(/\/+$/, '');
  const apiPath = configuredPath.endsWith('/api')
    ? configuredPath
    : `${configuredPath}/api`;

  return `${configuredUrl.origin}${apiPath}`;
};

export class EventHubApi {
  private constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string,
    private readonly token: string,
  ) {}

  static async authenticate(request: APIRequestContext): Promise<EventHubApi> {
    const response = await request.post(`${getApiBaseUrl()}/auth/login`, {
      data: {
        email: requiredEnvironmentValue('EMAIL'),
        password: requiredEnvironmentValue('PASSWORD'),
      },
    });

    if (!response.ok()) {
      throw new Error(`API login failed with HTTP ${response.status()}`);
    }

    const body = (await response.json()) as LoginResponse;
    if (!body.success || !body.token) {
      throw new Error('API login response did not contain a bearer token');
    }

    return new EventHubApi(request, getApiBaseUrl(), body.token);
  }

  get(path: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${path}`, {
      headers: this.authorizationHeaders,
    });
  }

  post(path: string, data: object): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${path}`, {
      data,
      headers: this.authorizationHeaders,
    });
  }

  delete(path: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${path}`, {
      headers: this.authorizationHeaders,
    });
  }

  private get authorizationHeaders(): Record<string, string> {
    return { Authorization: `Bearer ${this.token}` };
  }
}
