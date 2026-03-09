/**
 * Tech Nest SDK — TypeScript Client
 * ───────────────────────────────────
 * Official client library for the Tech Nest Intelligence Platform.
 *
 * Usage:
 *   import { TechNest } from '@technest/sdk';
 *   const tn = new TechNest({ apiKey: 'tn_live_...' });
 *   const score = await tn.devices.score('device-uuid');
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface TechNestConfig {
  apiKey: string;
  baseUrl?: string;          // Default: https://api.technest.app
  agentId?: string;          // For AI agent identification
  timeout?: number;          // Request timeout in ms (default: 10000)
}

export interface DeviceScore {
  device_id: string;
  name: string;
  brand: string;
  tech_nest_score: number;
  category_scores: {
    display: number;
    performance: number;
    camera: number;
    battery: number;
    design: number;
    software: number;
  };
  verdict: 'FLAGSHIP' | 'HIGH' | 'MID' | 'ENTRY';
  trend_momentum: 'rising' | 'declining' | 'stable' | null;
  price_usd: number | null;
}

export interface DeviceListResponse {
  devices: DeviceScore[];
  total: number;
  page: number;
  limit: number;
}

export interface RecommendationRequest {
  preferences: {
    budget_usd?: number;
    priority?: ('camera' | 'battery' | 'performance' | 'display' | 'value')[];
    brand?: string;
    use_case?: string;
  };
  limit?: number;
  explain?: boolean;
}

export interface DeviceRecommendation {
  device_id: string;
  name: string;
  brand: string;
  score: number;
  verdict: string;
  match_reasons: string[];
  price_usd: number | null;
}

export interface RecommendationResponse {
  recommendations: DeviceRecommendation[];
  total_considered: number;
  methodology: string;
}

export interface AgentQuery {
  action: 'recommend' | 'score' | 'compare' | 'trend';
  params: Record<string, unknown>;
  context?: string;
}

export interface AgentResponse {
  action: string;
  success: boolean;
  data: unknown;
  metadata: Record<string, unknown>;
}

// ── Error Types ──────────────────────────────────────────────────────────────

export class TechNestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'TechNestError';
    this.status = status;
    this.code = code;
  }
}

export class RateLimitError extends TechNestError {
  retryAfter: number;

  constructor(message: string, retryAfter: number = 60) {
    super(429, 'rate_limit_exceeded', message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

// ── Core Client ──────────────────────────────────────────────────────────────

export class TechNest {
  private apiKey: string;
  private baseUrl: string;
  private agentId?: string;
  private timeout: number;

  public devices: DevicesAPI;
  public decision: DecisionAPI;
  public agent: AgentAPI;

  constructor(config: TechNestConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.technest.app').replace(/\/$/, '');
    this.agentId = config.agentId;
    this.timeout = config.timeout || 10000;

    this.devices = new DevicesAPI(this);
    this.decision = new DecisionAPI(this);
    this.agent = new AgentAPI(this);
  }

  /**
   * Core HTTP request method.
   * Handles auth headers, error mapping, and timeout.
   */
  async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json',
    };

    if (this.agentId) {
      headers['X-Agent-Id'] = this.agentId;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));

        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10);
          throw new RateLimitError(
            errorBody.message || 'Rate limit exceeded',
            retryAfter,
          );
        }

        throw new TechNestError(
          response.status,
          errorBody.error || 'unknown_error',
          errorBody.message || `HTTP ${response.status}`,
        );
      }

      return await response.json() as T;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof TechNestError) throw error;
      throw new TechNestError(0, 'network_error', String(error));
    }
  }
}

// ── Devices API ──────────────────────────────────────────────────────────────

class DevicesAPI {
  constructor(private client: TechNest) {}

  /** Get the intelligence score for a specific device. */
  async score(deviceId: string): Promise<DeviceScore> {
    return this.client.request('GET', `/platform/v1/devices/${deviceId}/score`);
  }

  /** List scored devices with optional filters. */
  async list(params?: {
    page?: number;
    limit?: number;
    brand?: string;
    min_score?: number;
  }): Promise<DeviceListResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.brand) query.set('brand', params.brand);
    if (params?.min_score) query.set('min_score', String(params.min_score));

    const qs = query.toString();
    return this.client.request('GET', `/platform/v1/devices/${qs ? '?' + qs : ''}`);
  }
}

// ── Decision API ─────────────────────────────────────────────────────────────

class DecisionAPI {
  constructor(private client: TechNest) {}

  /** Get device recommendations based on user preferences. */
  async recommend(request: RecommendationRequest): Promise<RecommendationResponse> {
    return this.client.request('POST', '/platform/v1/decision/recommend', request);
  }
}

// ── Agent API ────────────────────────────────────────────────────────────────

class AgentAPI {
  constructor(private client: TechNest) {}

  /** Execute a structured query (designed for AI agents). */
  async query(request: AgentQuery): Promise<AgentResponse> {
    return this.client.request('POST', '/platform/v1/agent/query', request);
  }

  /** Discover available agent capabilities. */
  async capabilities(): Promise<Record<string, unknown>> {
    return this.client.request('GET', '/platform/v1/agent/capabilities');
  }
}

// ── Default Export ────────────────────────────────────────────────────────────

export default TechNest;
