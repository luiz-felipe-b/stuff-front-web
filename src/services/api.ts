import { createApiClient as createAuthApiClient } from "@/api/generated/auth";
import { createApiClient as createUserApiClient } from "@/api/generated/user";
import { createApiClient as createOrganizationsApiClient } from "@/api/generated/organizations";
import { createApiClient as createAssetsApiClient } from "@/api/generated/assets";
import { createApiClient as createAttributesApiClient } from "@/api/generated/attributes";
import { createApiClient as createReportsApiClient } from "@/api/generated/reports";



const BASE_URL = process.env.NEXT_PUBLIC_STUFF_API!;

// Create API clients
export const authApi = createAuthApiClient(BASE_URL);
export const userApi = createUserApiClient(BASE_URL);
export const organizationsApi = createOrganizationsApiClient(BASE_URL);
export const assetsApi = createAssetsApiClient(BASE_URL);
export const attributesApi = createAttributesApiClient(BASE_URL);
export const reportsApi = createReportsApiClient(BASE_URL);

// Set withCredentials: true for all clients by default
[authApi, userApi, organizationsApi, assetsApi, attributesApi, reportsApi].forEach((client) => {
	if (client.axios) {
		client.axios.defaults.withCredentials = true;
	}
});

// Add Axios interceptor for token refresh
const clients = [authApi, userApi, organizationsApi, assetsApi, attributesApi, reportsApi];

clients.forEach((client) => {
	client.axios.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;
			if (error.response && error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const refreshResp = await authApi.postAuthrefreshToken(undefined);
					const newAccessToken = refreshResp.accessToken;
					if (newAccessToken) {
						localStorage.setItem("token", newAccessToken);
						// Update Authorization header and retry
						originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
						return client.axios(originalRequest);
					}
				} catch (refreshErr) {
					// On refresh fail, log out user
					localStorage.removeItem("token");
					window.location.href = "/login";
					return Promise.reject(refreshErr);
				}
			}
			return Promise.reject(error);
		}
	);
});