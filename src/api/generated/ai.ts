import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const endpoints = makeApi([
  {
    method: "post",
    path: "/ai/invoke",
    alias: "postAiinvoke",
    description: `Send a prompt to Amazon Bedrock Nova Lite and get a response.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ prompt: z.string().min(1) }),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Nova response received"),
      data: z.string(),
    }),
    errors: [
      {
        status: 400,
        description: `Bad Request`,
        schema: z.object({
          error: z.string().optional().default("Bad Request"),
          message: z.string(),
        }),
      },
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.object({
          error: z.string().optional().default("Unauthorized"),
          message: z.string(),
        }),
      },
      {
        status: 500,
        description: `Internal Server Error`,
        schema: z.object({
          error: z.string().optional().default("Internal Server Error"),
          message: z.string(),
        }),
      },
    ],
  },
]);

export const AiApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
