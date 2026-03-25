// Prefer explicit env override. If missing, use current origin (works when frontend and backend share host),
// otherwise fallback to production URL.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://adminsectiongemtalk-production-9414.up.railway.app') + '/api';

const buildPublicUrl = (path) => `${API_BASE_URL}${path}`;
const buildFileUrl = (path) => {
  if (!path) return "";
  return `${API_BASE_URL.replace(/\/api$/, "")}${path}`;
};

export const getPublicArticles = async ({
  page = 1,
  limit = 12,
  search = "",
  type = "article",
  dateFrom = "",
  dateTo = "",
} = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (type) params.set("type", type);
  if (dateFrom) params.set("dateFrom", dateFrom);
  if (dateTo) params.set("dateTo", dateTo);

  const response = await fetch(buildPublicUrl(`/public/articles?${params.toString()}`));
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to load articles" }));
    throw error;
  }

  return await response.json();
};

export const getPublicArticleById = async (id, type = "article") => {
  const params = new URLSearchParams();
  if (type) params.set("type", type);

  const response = await fetch(buildPublicUrl(`/public/articles/${id}?${params.toString()}`));
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to load article" }));
    throw error;
  }

  return await response.json();
};

export const getPublicFileUrl = (path) => {
  if (!path) return '';
  // If path is already an absolute URL, use server proxy to control headers
  const fileUrl = path;
  const filename = (() => {
    try { const parts = (new URL(fileUrl)).pathname.split('/'); return parts.pop() || 'file'; } catch (e) { const p = fileUrl.split('/'); return p.pop() || 'file'; }
  })();
  const proxyRoot = API_BASE_URL.replace(/\/api$/, '');
  return `${proxyRoot}/api/public/file?url=${encodeURIComponent(fileUrl)}&filename=${encodeURIComponent(filename)}`;
};

export const getHero = async () => {
  const response = await fetch(buildPublicUrl(`/hero`));
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to load hero' }));
    throw error;
  }
  return await response.json();
};
