const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

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

export const getQuestions = async () => {
  const response = await fetch(buildUrl("/questions"));
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

export const deleteQuestion = async ({ id }) => {
  const response = await fetch(buildUrl(`/questions/${id}`), {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  return handleResponse(response, "Failed to delete question");
};
