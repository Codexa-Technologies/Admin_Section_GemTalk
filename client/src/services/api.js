const API_BASE_URL = 'http://localhost:5000/api';

const getContentBasePath = (contentType = 'article') => {
  if (contentType === 'news') return 'news';
  if (contentType === 'research') return 'research';
  return 'articles';
};

// Admin Auth Services
export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export const getCurrentAdmin = async (token) => {
  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

// Article Services
export const getDashboardStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/articles/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) { const error = await response.json(); throw error; }
  return await response.json();
};

export const getArticles = async (token, page = 1, limit = 10, search = '', sortField = 'createdAt', sortOrder = 'desc', dateFrom = '', dateTo = '', typeFilter = 'article') => {
  const basePath = getContentBasePath(typeFilter || 'article');
  let url = `${API_BASE_URL}/${basePath}?page=${page}&limit=${limit}`;
  if (search)     url += `&search=${encodeURIComponent(search)}`;
  if (sortField)  url += `&sortField=${sortField}&sortOrder=${sortOrder}`;
  if (dateFrom)   url += `&dateFrom=${dateFrom}`;
  if (dateTo)     url += `&dateTo=${dateTo}`;

  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) { const error = await response.json(); throw error; }
  return await response.json();
};

export const bulkDeleteArticles = async (token, ids, contentType = 'article') => {
  const basePath = getContentBasePath(contentType);
  const response = await fetch(`${API_BASE_URL}/${basePath}/bulk`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) { const error = await response.json(); throw error; }
  return await response.json();
};

export const getArticle = async (token, id, contentType = 'article') => {
  const basePath = getContentBasePath(contentType);
  const response = await fetch(`${API_BASE_URL}/${basePath}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export const createArticle = async (token, formData, contentType = 'article') => {
  const basePath = getContentBasePath(contentType);
  const response = await fetch(`${API_BASE_URL}/${basePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export const updateArticle = async (token, id, formData, contentType = 'article') => {
  const basePath = getContentBasePath(contentType);
  const response = await fetch(`${API_BASE_URL}/${basePath}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export const deleteArticle = async (token, id, contentType = 'article') => {
  const basePath = getContentBasePath(contentType);
  const response = await fetch(`${API_BASE_URL}/${basePath}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

// Q&A Admin Services
export const getAdminQuestions = async (token, page = 1, limit = 50) => {
  const response = await fetch(`${API_BASE_URL}/questions/admin?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};

export const deleteAdminQuestion = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/questions/admin/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
};
