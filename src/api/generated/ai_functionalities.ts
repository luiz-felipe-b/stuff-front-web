import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAiFunctionalitiesdescribeImage_Body = z.object({
  imageBase64: z.string().min(1),
  prompt: z.string().optional(),
});

export const schemas = {
  postAiFunctionalitiesdescribeImage_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/ai-functionalities/describe-image",
    alias: "postAiFunctionalitiesdescribeImage",
    description: `Send an image (base64) and prompt to Bedrock Nova Lite/Claude 3 and get a description.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAiFunctionalitiesdescribeImage_Body,
      },
    ],
    response: z.object({
      message: z.string().optional().default("Image description received"),
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

export const Ai_functionalitiesApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
