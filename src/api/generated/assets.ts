import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAssets_Body = z.object({
  type: z.enum(["unique", "replicable"]),
  quantity: z.number().int().optional(),
  organizationId: z.string().uuid().nullish(),
  name: z.string(),
  description: z.string().optional(),
  templateId: z.string().uuid().nullish(),
});
const patchAssetsId_Body = z
  .object({
    quantity: z.number().int(),
    name: z.string(),
    description: z.string(),
    templateId: z.string().uuid().nullable(),
  })
  .partial();

export const schemas = {
  postAssets_Body,
  patchAssetsId_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/assets/",
    alias: "getAssets",
    description: `Get all assets with their attributes and values`,
    requestFormat: "json",
    response: z.object({
      message: z.string().optional().default("Assets with attributes found"),
      data: z.object({
        assets: z.array(
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
            attributes: z
              .array(
                z.object({
                  id: z.string().uuid(),
                  organizationId: z.string().uuid().nullish(),
                  authorId: z.string().uuid(),
                  name: z.string().min(1),
                  description: z.string().nullish(),
                  type: z.enum([
                    "text",
                    "number",
                    "boolean",
                    "date",
                    "metric",
                    "select",
                    "multiselection",
                    "timemetric",
                    "file",
                    "rfid",
                  ]),
                  unit: z.string().nullish(),
                  timeUnit: z.string().nullish(),
                  options: z.string().nullish(),
                  required: z.boolean().optional().default(false),
                  trashBin: z.boolean().optional().default(false),
                  createdAt: z.string().datetime({ offset: true }),
                  updatedAt: z.string().datetime({ offset: true }),
                  values: z
                    .array(
                      z.object({
                        id: z.string().uuid(),
                        assetInstanceId: z.string().uuid(),
                        attributeId: z.string().uuid(),
                        value: z.string(),
                        createdAt: z
                          .string()
                          .datetime({ offset: true })
                          .optional()
                          .default({}),
                        updatedAt: z
                          .string()
                          .datetime({ offset: true })
                          .optional()
                          .default({}),
                      })
                    )
                    .optional()
                    .default([]),
                })
              )
              .optional()
              .default([]),
          })
        ),
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
    path: "/assets/",
    alias: "postAssets",
    description: `Create an asset instance`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Asset instance creation schema`,
        type: "Body",
        schema: postAssets_Body,
      },
    ],
    response: z.object({
      message: z.string().optional().default("Assets found"),
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
    path: "/assets/:id",
    alias: "getAssetsId",
    description: `Get asset by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().min(1),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Asset found"),
      data: z.object({
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
        attributes: z
          .array(
            z.object({
              id: z.string().uuid(),
              organizationId: z.string().uuid().nullish(),
              authorId: z.string().uuid(),
              name: z.string().min(1),
              description: z.string().nullish(),
              type: z.enum([
                "text",
                "number",
                "boolean",
                "date",
                "metric",
                "select",
                "multiselection",
                "timemetric",
                "file",
                "rfid",
              ]),
              unit: z.string().nullish(),
              timeUnit: z.string().nullish(),
              options: z.string().nullish(),
              required: z.boolean().optional().default(false),
              trashBin: z.boolean().optional().default(false),
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }),
              values: z
                .array(
                  z.object({
                    id: z.string().uuid(),
                    assetInstanceId: z.string().uuid(),
                    attributeId: z.string().uuid(),
                    value: z.string(),
                    createdAt: z
                      .string()
                      .datetime({ offset: true })
                      .optional()
                      .default({}),
                    updatedAt: z
                      .string()
                      .datetime({ offset: true })
                      .optional()
                      .default({}),
                  })
                )
                .optional()
                .default([]),
            })
          )
          .optional()
          .default([]),
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
    path: "/assets/:id",
    alias: "patchAssetsId",
    description: `Edit asset by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Asset edit schema`,
        type: "Body",
        schema: patchAssetsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Asset updated"),
      data: z.object({
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
    path: "/assets/:id",
    alias: "deleteAssetsId",
    description: `Delete asset by ID`,
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Asset deleted"),
      data: z.object({ id: z.string().uuid() }),
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
    path: "/assets/:id/trash-bin",
    alias: "patchAssetsIdtrashBin",
    description: `Set the trashBin field for an asset`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ trashBin: z.boolean() }),
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Asset trashBin set"),
      data: z.object({
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
]);

export const AssetsApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
