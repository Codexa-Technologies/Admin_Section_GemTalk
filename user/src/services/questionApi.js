const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://adminsectiongemtalk-production-9414.up.railway.app/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("userToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: fallbackMessage }));
    throw error;
  }
  return response.json();
};

export const getQuestions = async ({ page = 1, limit = 50, search = "" } = {}) => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);

  const response = await fetch(buildUrl(`/questions?${params.toString()}`));
  return handleResponse(response, "Failed to load questions");
};

export const createQuestion = async ({ question }) => {
  const response = await fetch(buildUrl("/questions"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ question }),
  });

  return handleResponse(response, "Failed to add question");
};

export const addAnswer = async ({ id, text }) => {
  const response = await fetch(buildUrl(`/questions/${id}/answers`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ text }),
  });

  return handleResponse(response, "Failed to add answer");
};

export const deleteAnswer = async ({ id, answerId }) => {
  const response = await fetch(buildUrl(`/questions/${id}/answers/${answerId}`), {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response, "Failed to delete answer");
};

export const deleteQuestion = async ({ id }) => {
  const response = await fetch(buildUrl(`/questions/${id}`), {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response, "Failed to delete question");
};
