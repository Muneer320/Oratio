const API_BASE_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : "";

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

  async get(endpoint, requiresAuth = false, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(requiresAuth),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`GET ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint, data, requiresAuth = false, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(requiresAuth),
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`POST ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint, data, requiresAuth = false, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(requiresAuth),
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`PUT ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint, requiresAuth = false, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(requiresAuth),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`DELETE ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async uploadFile(endpoint, file, extraData = {}, requiresAuth = true, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`File upload ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`File upload ${endpoint} failed:`, error);
      throw error;
    }
  }

  async postFormData(endpoint, formData, requiresAuth = true, timeout = 60000) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout - please try again');
        timeoutError.isTimeout = true;
        console.error(`POST FormData ${endpoint} timed out`);
        throw timeoutError;
      }
      console.error(`POST FormData ${endpoint} failed:`, error);
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

  async getRoomByCode(roomCode) {
    return await this.get(`/api/rooms/code/${roomCode}`, true);
  }
}

export default new ApiService();
