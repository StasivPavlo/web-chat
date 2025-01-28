import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

interface DecodedToken {
  exp: number;
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string): void {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

function parseJwt(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch {
    return null;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      const decodedToken = parseJwt(accessToken);
      if (decodedToken) {
        const tokenExpiry = decodedToken.exp * 1000;
        const now = Date.now();
        const bufferTime = 60000; // 1 хвилина

        if (tokenExpiry - now < bufferTime && refreshToken && !isRefreshing) {
          isRefreshing = true;

          try {
            const response = await api.post('/auth/refresh', { refreshToken })
            const { newAccessToken } = response.data;

            localStorage.setItem('accessToken', newAccessToken);
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            isRefreshing = false;
            onRefreshed(newAccessToken);
          } catch (error) {
            isRefreshing = false;
            return Promise.reject(error);
          }
        }
      }

      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await api.post('/auth/refresh', { refreshToken });
            const { newAccessToken } = response.data;

            localStorage.setItem('accessToken', newAccessToken);
            isRefreshing = false;
            onRefreshed(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            isRefreshing = false;
            return Promise.reject(refreshError);
          }
        }
      }

      return new Promise(resolve => {
        addRefreshSubscriber(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
