import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postUsers_Body = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  userName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "moderator", "user"]).optional().default("user"),
  tier: z
    .enum(["free", "plus", "pro", "enterprise"])
    .optional()
    .default("free"),
});
const patchUsersId_Body = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    role: z.enum(["admin", "moderator", "user"]),
    tier: z.enum(["free", "plus", "pro", "enterprise"]),
  })
  .partial();
const postUsersmepassword_Body = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
});

export const schemas = {
  postUsers_Body,
  patchUsersId_Body,
  postUsersmepassword_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/users/",
    alias: "getUsers",
    description: `Get all users`,
    requestFormat: "json",
    response: z.object({
      message: z.string().optional().default("Users found"),
      data: z.array(
        z.object({
          id: z.string(),
          firstName: z.string(),
          lastName: z.string(),
          userName: z.string(),
          email: z.string().email(),
          role: z.enum(["admin", "moderator", "user"]),
          tier: z.enum(["free", "plus", "pro", "enterprise"]),
          active: z.boolean(),
          authenticated: z.boolean(),
          createdAt: z.string().datetime({ offset: true }),
          updatedAt: z.string().datetime({ offset: true }),
        })
      ),
    }),
    errors: [
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
  {
    method: "post",
    path: "/users/",
    alias: "postUsers",
    description: `Create a new user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postUsers_Body,
      },
    ],
    response: z.object({
      message: z.string().optional().default("User created"),
      data: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        userName: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "moderator", "user"]),
        tier: z.enum(["free", "plus", "pro", "enterprise"]),
        active: z.boolean(),
        authenticated: z.boolean(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      }),
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
        status: 409,
        description: `User already exists`,
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
    method: "get",
    path: "/users/:id",
    alias: "getUsersId",
    description: `Get user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("User found"),
      data: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        userName: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "moderator", "user"]),
        tier: z.enum(["free", "plus", "pro", "enterprise"]),
        active: z.boolean(),
        authenticated: z.boolean(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      }),
    }),
    errors: [
      {
        status: 401,
        description: `Unauthorized`,
        schema: z.object({
          error: z.string().optional().default("Unauthorized"),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
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
    method: "patch",
    path: "/users/:id",
    alias: "patchUsersId",
    description: `Update a user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchUsersId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ message: z.string().default("User updated") })
      .partial(),
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
        status: 404,
        description: `User not found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "delete",
    path: "/users/:id",
    alias: "deleteUsersId",
    description: `Delete a user by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string(),
      },
    ],
    response: z
      .object({ message: z.string().default("User deleted") })
      .partial(),
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
    method: "get",
    path: "/users/by-email",
    alias: "getUsersbyEmail",
    description: `Get user by their email`,
    requestFormat: "json",
    parameters: [
      {
        name: "email",
        type: "Query",
        schema: z.string().email(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("User found"),
      data: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        userName: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "moderator", "user"]),
        tier: z.enum(["free", "plus", "pro", "enterprise"]),
        active: z.boolean(),
        authenticated: z.boolean(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      }),
    }),
    errors: [
      {
        status: 400,
        description: `Invalid email`,
        schema: z.object({
          error: z.string().optional().default("Invalid email"),
          message: z.string(),
        }),
      },
      {
        status: 404,
        description: `User not found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
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
    method: "get",
    path: "/users/me",
    alias: "getUsersme",
    description: `Get current authenticated user`,
    requestFormat: "json",
    response: z.object({
      message: z.string().optional().default("User found"),
      data: z.object({
        id: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        userName: z.string(),
        email: z.string().email(),
        role: z.enum(["admin", "moderator", "user"]),
        tier: z.enum(["free", "plus", "pro", "enterprise"]),
        active: z.boolean(),
        authenticated: z.boolean(),
        createdAt: z.string().datetime({ offset: true }),
        updatedAt: z.string().datetime({ offset: true }),
      }),
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
        status: 404,
        description: `User not found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "patch",
    path: "/users/me",
    alias: "patchUsersme",
    description: `Update current authenticated user`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchUsersId_Body,
      },
    ],
    response: z
      .object({ message: z.string().default("User updated") })
      .partial(),
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
        status: 404,
        description: `User not found`,
        schema: z.object({
          error: z.string().optional().default("Not Found"),
          message: z.string(),
        }),
      },
    ],
  },
  {
    method: "post",
    path: "/users/me/password",
    alias: "postUsersmepassword",
    description: `Update current authenticated user password`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postUsersmepassword_Body,
      },
    ],
    response: z
      .object({ message: z.string().default("User updated") })
      .partial(),
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

export const UserApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
