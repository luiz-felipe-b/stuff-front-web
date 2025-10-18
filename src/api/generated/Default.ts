import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const endpoints = makeApi([
  {
    method: "get",
    path: "/test-s3",
    alias: "getTestS3",
    requestFormat: "json",
    response: z.void(),
  },
]);

export const DefaultApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
