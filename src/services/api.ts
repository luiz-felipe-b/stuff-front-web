import { createApiClient as createAuthApiClient } from "@/api/generated/auth";
import { createApiClient as createUserApiClient } from "@/api/generated/user";
import { createApiClient as createOrganizationsApiClient } from "@/api/generated/organizations";

const BASE_URL = process.env.NEXT_PUBLIC_STUFF_API!;

export const authApi = createAuthApiClient(BASE_URL);
export const userApi = createUserApiClient(BASE_URL);
export const organizationsApi = createOrganizationsApiClient(BASE_URL);