import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse} from 'axios';

interface RefreshResponse {
  accessToken: string;
}

interface DecodedToken {
  exp: number;
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
        .join(''),
    );

    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    return null;
  }
}

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      const decodedToken = parseJwt(accessToken);

      if (decodedToken) {
        const tokenExpiry = decodedToken.exp * 1000;
        const now = Date.now();
        const bufferTime = 60000;

        if (tokenExpiry - now < bufferTime && !isRefreshing) {
          isRefreshing = true;

          try {
            const response =
              await axios.post<RefreshResponse>('http://localhost:3000/auth/refresh', {}, {withCredentials: true});
            // eslint-disable-next-line no-shadow
            const { accessToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
            isRefreshing = false;
            onRefreshed(accessToken);
          } catch (error) {
            isRefreshing = false;

            return Promise.reject(error);
          }
        }
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async error => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const response =
            await axios.post<RefreshResponse>('http://localhost:3000/auth/refresh', {}, {withCredentials: true});
          const {accessToken} = response.data;

          localStorage.setItem('accessToken', accessToken);
          isRefreshing = false;
          onRefreshed(accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;

          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        addRefreshSubscriber(token => {
          if (!token) {
            reject(error);
          } else {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          }
        });
      });
    }

    return Promise.reject(error);
  },
);

export default api;
