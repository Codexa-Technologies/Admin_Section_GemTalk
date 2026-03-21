const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://adminsectiongemtalk-production-9414.up.railway.app/api";

const buildUrl = (path) => `${API_BASE_URL}${path}`;

const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: fallbackMessage }));
    throw error;
  }

  return await response.json();
};

export const loginUser = async ({ email, password }) => {
  const response = await fetch(buildUrl("/users/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response, "Login failed");
};

export const registerUser = async ({ name, email, password }) => {
  const response = await fetch(buildUrl("/users/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(response, "Signup failed");
};
