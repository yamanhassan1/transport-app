export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getErrorMessage(error) {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error?.message) return error.message;
  return "Something went wrong. Please try again.";
}

async function request(path, { body, ...options } = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...options,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = extractError(data, response.status);
    throw new ApiError(message, { status: response.status, data });
  }

  return data;
}

function extractError(data, status) {
  if (!data) return `Request failed (${status}). Please try again.`;

  if (data.message) return data.message;

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.map((e) => e.msg || e.message).filter(Boolean).join(" ");
  }

  return `Request failed (${status}). Please try again.`;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
};

export default api;