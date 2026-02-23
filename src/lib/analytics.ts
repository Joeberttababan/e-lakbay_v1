import { supabase } from './supabaseClient';

const SESSION_STORAGE_KEY = 'elakbay-analytics-session-id';
const LANDING_STORAGE_KEY = 'elakbay-analytics-landing-path';

type BaseAnalyticsPayload = {
  userId?: string | null;
  pagePath?: string | null;
};

type SearchPayload = BaseAnalyticsPayload & {
  query: string;
  scope: 'products' | 'destinations' | 'global';
  resultCount?: number | null;
  filters?: Record<string, unknown>;
};

type FilterPayload = BaseAnalyticsPayload & {
  scope: 'products' | 'destinations' | 'global';
  filterName: string;
  filterValue?: string | number | boolean | null;
  filters?: Record<string, unknown>;
};

type ContentViewPayload = {
  contentType: 'destination' | 'product' | 'profile';
  contentId: string;
  ownerId?: string | null;
  userId?: string | null;
  pagePath?: string | null;
};

let lastPageViewEventKey = '';
let lastSearchEventKey = '';
let lastFilterEventKey = '';
let lastContentEventKey = '';

function shouldTrackPageView(path: string, userId?: string | null) {
  const cleanPath = path.split('?')[0]?.split('#')[0] ?? path;

  if (cleanPath.startsWith('/dashboard') || cleanPath.startsWith('/admin')) {
    return false;
  }

  const profileMatch = cleanPath.match(/^\/profile\/([^/]+)$/);
  if (profileMatch && userId && profileMatch[1] === userId) {
    return false;
  }

  return true;
}

function isOwnerView(ownerId?: string | null, userId?: string | null) {
  return Boolean(ownerId && userId && ownerId === userId);
}

function getSessionId(): string {
  if (typeof window === 'undefined') return crypto.randomUUID();
  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
  return generated;
}

function getLandingPath(currentPath: string): string {
  if (typeof window === 'undefined') return currentPath;
  const existing = window.localStorage.getItem(LANDING_STORAGE_KEY);
  if (existing) return existing;
  window.localStorage.setItem(LANDING_STORAGE_KEY, currentPath);
  return currentPath;
}

function getSourceAndMedium() {
  if (typeof window === 'undefined') {
    return { source: 'direct', medium: 'none' };
  }

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source')?.trim();
  const utmMedium = params.get('utm_medium')?.trim();

  if (utmSource || utmMedium) {
    return {
      source: utmSource || 'campaign',
      medium: utmMedium || 'unknown',
    };
  }

  const referrer = document.referrer;
  if (!referrer) return { source: 'direct', medium: 'none' };

  try {
    const referrerHost = new URL(referrer).hostname;
    const currentHost = window.location.hostname;
    if (!referrerHost || referrerHost === currentHost) {
      return { source: 'direct', medium: 'none' };
    }

    return {
      source: referrerHost,
      medium: 'referral',
    };
  } catch {
    return { source: 'direct', medium: 'none' };
  }
}

async function insertEvent(payload: Record<string, unknown>) {
  const { error } = await supabase.from('analytics_events').insert(payload);
  if (error) {
    console.error('Failed to insert analytics event:', error);
  }
}

export async function trackPageView({ userId, pagePath }: BaseAnalyticsPayload = {}) {
  const path = pagePath ?? (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');
  if (!shouldTrackPageView(path, userId)) return;
  const landingPath = getLandingPath(path);
  const { source, medium } = getSourceAndMedium();
  const eventKey = `${path}|${source}|${medium}`;
  if (lastPageViewEventKey === eventKey) return;
  lastPageViewEventKey = eventKey;

  await insertEvent({
    session_id: getSessionId(),
    user_id: userId ?? null,
    event_name: 'page_view',
    page_path: path,
    source,
    medium,
    landing_path: landingPath,
  });
}

export async function trackSearchPerformed({
  query,
  scope,
  resultCount,
  userId,
  pagePath,
  filters,
}: SearchPayload) {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return;
  const eventKey = `${scope}|${normalizedQuery.toLowerCase()}|${resultCount ?? ''}|${pagePath ?? ''}`;
  if (lastSearchEventKey === eventKey) return;
  lastSearchEventKey = eventKey;

  await insertEvent({
    session_id: getSessionId(),
    user_id: userId ?? null,
    event_name: 'search_performed',
    page_path: pagePath ?? null,
    search_query: normalizedQuery,
    search_scope: scope,
    search_result_count: typeof resultCount === 'number' ? resultCount : null,
    filters: filters ?? {},
  });
}

export async function trackFilterUsage({
  scope,
  filterName,
  filterValue,
  userId,
  pagePath,
  filters,
}: FilterPayload) {
  const eventKey = `${scope}|${filterName}|${String(filterValue ?? '')}|${pagePath ?? ''}`;
  if (lastFilterEventKey === eventKey) return;
  lastFilterEventKey = eventKey;

  await insertEvent({
    session_id: getSessionId(),
    user_id: userId ?? null,
    event_name: 'filter_used',
    page_path: pagePath ?? null,
    search_scope: scope,
    filters: {
      filter_name: filterName,
      filter_value: filterValue ?? null,
      ...(filters ?? {}),
    },
  });
}

export async function trackContentView({
  contentType,
  contentId,
  ownerId,
  userId,
  pagePath,
}: ContentViewPayload) {
  if (isOwnerView(ownerId, userId)) return;
  const eventKey = `${contentType}|${contentId}|${userId ?? 'anon'}`;
  if (lastContentEventKey === eventKey) return;
  lastContentEventKey = eventKey;

  await insertEvent({
    session_id: getSessionId(),
    user_id: userId ?? null,
    event_name: 'page_view',
    page_path: pagePath ?? `modal:${contentType}:${contentId}`,
    landing_path: pagePath ?? null,
    metadata: {
      content_type: contentType,
      content_id: contentId,
      owner_id: ownerId ?? null,
    },
  });
}

export async function trackProfileView({
  profileId,
  userId,
}: { profileId: string; userId?: string | null }) {
  if (isOwnerView(profileId, userId)) return;
  const eventKey = `profile|${profileId}|${userId ?? 'anon'}`;
  if (lastContentEventKey === eventKey) return;
  lastContentEventKey = eventKey;

  await insertEvent({
    session_id: getSessionId(),
    user_id: userId ?? null,
    event_name: 'page_view',
    page_path: `/profile/${profileId}`,
    landing_path: `/profile/${profileId}`,
    metadata: {
      content_type: 'profile',
      content_id: profileId,
      owner_id: profileId,
    },
  });
}
