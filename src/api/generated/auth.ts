import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAuthlogin_Body = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const postAuthresetPassword_Body = z.object({
  token: z.string(),
  newPassword: z.string().min(8),
});

export const schemas = {
  postAuthlogin_Body,
  postAuthresetPassword_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/auth/login",
    alias: "postAuthlogin",
    description: `Login with an account`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAuthlogin_Body,
      },
    ],
    response: z.object({ accessToken: z.string() }),
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
        status: 403,
        description: `Forbidden`,
        schema: z.object({
          error: z.string().optional().default("Forbidden"),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
          message: z.string(),
        }),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.object({
          error: z.string().optional().default("Conflict"),
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
  {
    method: "post",
    path: "/auth/logout",
    alias: "postAuthlogout",
    description: `Logout from an account`,
    requestFormat: "json",
    response: z.object({ message: z.string(), data: z.unknown().optional() }),
    errors: [
      {
        status: 400,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
      {
        status: 401,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
      {
        status: 500,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/refresh-token",
    alias: "postAuthrefreshToken",
    description: `Refresh the access token`,
    requestFormat: "json",
    response: z.object({ accessToken: z.string() }),
    errors: [
      {
        status: 400,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
      {
        status: 401,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
      {
        status: 404,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
      {
        status: 500,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/forgot-password",
    alias: "postAuthforgotPassword",
    description: `Request a password reset`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ email: z.string().email() }),
      },
    ],
    response: z.object({ message: z.string(), data: z.unknown().optional() }),
    errors: [
      {
        status: 500,
        description: `Default Response`,
        schema: z.object({ error: z.string(), message: z.string() }),
      },
    ],
  },
  {
    method: "post",
    path: "/auth/reset-password",
    alias: "postAuthresetPassword",
    description: `Reset password using a reset password token`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postAuthresetPassword_Body,
      },
    ],
    response: z.object({ message: z.string(), data: z.unknown().optional() }),
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
        status: 403,
        description: `Forbidden`,
        schema: z.object({
          error: z.string().optional().default("Forbidden"),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: `Not Found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
          message: z.string(),
        }),
      },
      {
        status: 409,
        description: `Conflict`,
        schema: z.object({
          error: z.string().optional().default("Conflict"),
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

export const AuthApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
