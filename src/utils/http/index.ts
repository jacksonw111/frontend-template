import { router } from "@/router";
import { useGlobalStore } from "@/stores/useGlobalStore";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { auth_service } from "../auth";
import { settings } from "./config";
const config: AxiosRequestConfig = {
  baseURL: import.meta.env.BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
};

const api = axios.create(config);

const authRequest = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (!config.url) return config;

  const url = new URL(config.url);
  if (!settings.whitelist.includes(url.pathname)) {
    const { access_token } = useGlobalStore.getState();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
  }

  return config;
};

api.interceptors.request.use(authRequest);

export interface HttpResponse<T = unknown> {
  data: T;
}

export interface ErrorResponse<T = unknown> {
  response: {
    data: T;
  };
}

const responseSuccess = (response: AxiosResponse<HttpResponse>) => {
  return response;
};
const responseFailedThenRefresh = (error: AxiosError<ErrorResponse>) => {
  console.error(error);
  const { config, status } = error?.response || {};
  if (status === 401) {
    const { access_token, refresh_token, setToken, setRefreshToken, clean } =
      useGlobalStore.getState();
    if (refresh_token && access_token) {
      auth_service
        .get_refresh_token(refresh_token, access_token)
        .then((res) => {
          setRefreshToken(res.refresh_token);
          setToken(res.access_token);
          api(config!);
        })
        .catch(() => {
          clean();
          router.navigate("/login", { replace: true });
        });
    }
  }

  return Promise.reject([true, error?.response?.data]);
};

const responseFailed = (error: AxiosError<ErrorResponse>) => {
  console.error(error);

  return Promise.reject([true, error?.response?.data]);
};

api.interceptors.response.use(
  responseSuccess,
  settings.auth_type === "TOKEN" ? responseFailedThenRefresh : responseFailed
);

export default api;
