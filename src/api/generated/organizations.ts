import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postOrganizations_Body = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  password: z.string().optional(),
});
const patchOrganizationsId_Body = z
  .object({
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    password: z.string().nullable(),
    active: z.boolean().default(true),
  })
  .partial();
const postOrganizationsIdmembers_Body = z.object({
  userId: z.string().min(1),
  role: z.enum(["admin", "moderator", "user"]).optional().default("user"),
});
const patchOrganizationsIdmembersUserId_Body = z
  .object({ role: z.enum(["admin", "moderator", "user"]).default("user") })
  .partial();

export const schemas = {
  postOrganizations_Body,
  patchOrganizationsId_Body,
  postOrganizationsIdmembers_Body,
  patchOrganizationsIdmembersUserId_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/organizations/",
    alias: "getOrganizations",
    description: `Get all organizations`,
    requestFormat: "json",
    response: z.object({
      message: z.string().optional().default("Organizations found"),
      data: z.array(
        z.object({
          id: z.string(),
          ownerId: z.string(),
          name: z.string(),
          slug: z.string(),
          description: z.string().nullish(),
          password: z.string().nullish(),
          active: z.boolean().optional().default(true),
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
        status: 403,
        description: `Forbidden`,
        schema: z.object({
          error: z.string().optional().default("Forbidden"),
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
    path: "/organizations/",
    alias: "postOrganizations",
    description: `Create organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postOrganizations_Body,
      },
    ],
    response: z.object({
      message: z.string().optional().default("Organization created"),
      data: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullish(),
        active: z.boolean().optional().default(true),
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
    path: "/organizations/:identifier",
    alias: "getOrganizationsIdentifier",
    description: `Get organization by an identifier, could be the organization ID or slug`,
    requestFormat: "json",
    parameters: [
      {
        name: "identifier",
        type: "Path",
        schema: z.string().min(1),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Organization found"),
      data: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullish(),
        active: z.boolean().optional().default(true),
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
    path: "/organizations/:id",
    alias: "patchOrganizationsId",
    description: `Update organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchOrganizationsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z
        .string()
        .optional()
        .default("Organization updated successfully"),
      data: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullish(),
        active: z.boolean().optional().default(true),
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
    method: "delete",
    path: "/organizations/:id",
    alias: "deleteOrganizationsId",
    description: `Delete organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        message: z.string().default("Organization deleted successfully"),
        data: z.string(),
      })
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
    path: "/organizations/:id/members",
    alias: "getOrganizationsIdmembers",
    description: `Get organization members`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Organization members found"),
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
    path: "/organizations/:id/members",
    alias: "postOrganizationsIdmembers",
    description: `Add member to organization`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postOrganizationsIdmembers_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Member added to organization"),
      data: z.object({
        userId: z.string(),
        role: z.enum(["admin", "moderator", "user"]),
        organizationId: z.string(),
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
    path: "/organizations/:id/members/:userId",
    alias: "patchOrganizationsIdmembersUserId",
    description: `Update organization member role`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchOrganizationsIdmembersUserId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().min(1),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().min(1),
      },
    ],
    response: z.object({
      message: z
        .string()
        .optional()
        .default("Organization member role updated"),
      data: z.object({
        userId: z.string(),
        organizationId: z.string(),
        role: z.enum(["admin", "moderator", "user"]),
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
    method: "delete",
    path: "/organizations/:id/members/:userId",
    alias: "deleteOrganizationsIdmembersUserId",
    description: `Delete organization member`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().min(1),
      },
      {
        name: "userId",
        type: "Path",
        schema: z.string().min(1),
      },
    ],
    response: z
      .object({
        message: z.string().default("Organization member deleted successfully"),
        data: z.unknown(),
      })
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
    path: "/organizations/:id/assets",
    alias: "getOrganizationsIdassets",
    description: `Get organization assets`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Organization assets found"),
      data: z.array(
        z.object({
          id: z.string().uuid(),
          type: z.enum(["unique", "replicable"]),
          quantity: z.number().int().nullable(),
          organizationId: z.string().uuid().nullish(),
          creatorUserId: z.string().uuid(),
          name: z.string(),
          description: z.string().nullish(),
          trashBin: z.boolean().optional().default(false),
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

export const OrganizationsApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
