import { createApiClient as createAuthApiClient } from "@/api/generated/auth";
import { createApiClient as createUserApiClient } from "@/api/generated/user";
import { createApiClient as createOrganizationsApiClient } from "@/api/generated/organizations";
import { createApiClient as createAssetsApiClient } from "@/api/generated/assets";
import { createApiClient as createAttributesApiClient } from "@/api/generated/attributes";


const BASE_URL = process.env.NEXT_PUBLIC_STUFF_API!;

export const authApi = createAuthApiClient(BASE_URL);
export const userApi = createUserApiClient(BASE_URL);
export const organizationsApi = createOrganizationsApiClient(BASE_URL);
export const assetsApi = createAssetsApiClient(BASE_URL);
export const attributesApi = createAttributesApiClient(BASE_URL);