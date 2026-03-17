const API_BASE_URL = 'http://localhost:5000/api';

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

export const getArticles = async (token, page = 1, limit = 10, search = '', sortField = 'createdAt', sortOrder = 'desc', dateFrom = '', dateTo = '') => {
  let url = `${API_BASE_URL}/articles?page=${page}&limit=${limit}`;
  if (search)     url += `&search=${encodeURIComponent(search)}`;
  if (sortField)  url += `&sortField=${sortField}&sortOrder=${sortOrder}`;
  if (dateFrom)   url += `&dateFrom=${dateFrom}`;
  if (dateTo)     url += `&dateTo=${dateTo}`;

  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) { const error = await response.json(); throw error; }
  return await response.json();
};

export const bulkDeleteArticles = async (token, ids) => {
  const response = await fetch(`${API_BASE_URL}/articles/bulk`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!response.ok) { const error = await response.json(); throw error; }
  return await response.json();
};

export const getArticle = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
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

export const createArticle = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/articles`, {
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

export const updateArticle = async (token, id, formData) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
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

export const deleteArticle = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
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
