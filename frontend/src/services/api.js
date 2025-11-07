const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

class ApiService {
  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  getHeaders(includeAuth = true) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  onUnauthorized = null;

  setUnauthorizedHandler(handler) {
    this.onUnauthorized = handler;
  }

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        if (this.onUnauthorized) {
          this.onUnauthorized();
        }
      }

      const error = await response.json().catch(() => ({
        detail: `HTTP error ${response.status}`,
        status: response.status,
      }));

      const apiError = new Error(error.detail || "Request failed");
      apiError.status = response.status;
      apiError.details = error;
      throw apiError;
    }

    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {};
    }

    return response.json();
  }

  async get(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(requiresAuth),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(requiresAuth),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint, data, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(requiresAuth),
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint, requiresAuth = false) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(requiresAuth),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async uploadFile(endpoint, file, extraData = {}, requiresAuth = true) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      Object.keys(extraData).forEach((key) => {
        formData.append(key, extraData[key]);
      });

      const headers = {};
      if (requiresAuth) {
        const token = this.getToken();
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`File upload ${endpoint} failed:`, error);
      throw error;
    }
  }

  async register(email, username, password) {
    const response = await this.post("/api/auth/register", {
      email,
      username,
      password,
    });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async login(email, password) {
    const response = await this.post("/api/auth/login", { email, password });
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    return response;
  }

  async logout() {
    await this.delete("/api/auth/logout", true);
    this.removeToken();
  }

  async getCurrentUser() {
    return await this.get("/api/auth/me", true);
  }
}

export default new ApiService();
