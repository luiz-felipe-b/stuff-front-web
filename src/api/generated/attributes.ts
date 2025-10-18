import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postAttributes_Body = z.object({
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
});
const patchAttributesAttributeId_Body = z
  .object({
    organizationId: z.string().uuid().nullable(),
    authorId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable(),
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
    unit: z.string().nullable(),
    timeUnit: z.string().nullable(),
    options: z.string().nullable(),
    required: z.boolean().default(false),
  })
  .partial();
const postAttributesAttributeIdvalue_Body = z.object({
  assetId: z.string().uuid(),
  value: z.string(),
});
const patchAttributesvalueAttributeValueId_Body = z
  .object({ value: z.unknown(), metricUnit: z.string(), timeUnit: z.string() })
  .partial();

export const schemas = {
  postAttributes_Body,
  patchAttributesAttributeId_Body,
  postAttributesAttributeIdvalue_Body,
  patchAttributesvalueAttributeValueId_Body,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/attributes/",
    alias: "getAttributes",
    description: `Retrieve all attributes with their values.`,
    requestFormat: "json",
    response: z.object({
      message: z.string().optional().default("Attributes found"),
      data: z.array(
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
                createdAt: z.string().datetime({ offset: true }),
                updatedAt: z.string().datetime({ offset: true }),
              })
            )
            .optional()
            .default([]),
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
    path: "/attributes/",
    alias: "postAttributes",
    description: `Create a new attribute.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Attribute creation schema`,
        type: "Body",
        schema: postAttributes_Body,
      },
    ],
    response: z.object({
      message: z.string().optional().default("Attribute created successfully"),
      data: z.object({
        id: z.string().uuid(),
        organizationId: z.string().uuid().nullish(),
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
    method: "get",
    path: "/attributes/:attributeId",
    alias: "getAttributesAttributeId",
    description: `Get a single attribute by ID, including its values.`,
    requestFormat: "json",
    parameters: [
      {
        name: "attributeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Attribute found"),
      data: z.object({
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
              createdAt: z.string().datetime({ offset: true }),
              updatedAt: z.string().datetime({ offset: true }),
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
    path: "/attributes/:attributeId",
    alias: "patchAttributesAttributeId",
    description: `Update an attribute by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Partial attribute update schema`,
        type: "Body",
        schema: patchAttributesAttributeId_Body,
      },
      {
        name: "attributeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Attribute updated successfully"),
      data: z.object({
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
    method: "delete",
    path: "/attributes/:attributeId",
    alias: "deleteAttributesAttributeId",
    description: `Delete an attribute by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "attributeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string().optional().default("Attribute deleted successfully"),
      data: z.object({
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
    path: "/attributes/:attributeId/value",
    alias: "postAttributesAttributeIdvalue",
    description: `Create a value for an attribute.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Attribute value creation schema`,
        type: "Body",
        schema: postAttributesAttributeIdvalue_Body,
      },
      {
        name: "attributeId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z
        .string()
        .optional()
        .default("Attribute value created successfully"),
      data: z.object({ attributeValue: z.unknown() }).partial(),
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
    method: "patch",
    path: "/attributes/value/:attributeValueId",
    alias: "patchAttributesvalueAttributeValueId",
    description: `Update an attribute value by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `Partial attribute value update schema`,
        type: "Body",
        schema: patchAttributesvalueAttributeValueId_Body,
      },
      {
        name: "attributeValueId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        message: z.string().default("Attribute value updated successfully"),
        data: z.unknown(),
      })
      .partial(),
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
    method: "delete",
    path: "/attributes/value/:attributeValueId",
    alias: "deleteAttributesvalueAttributeValueId",
    description: `Delete an attribute value by ID.`,
    requestFormat: "json",
    parameters: [
      {
        name: "attributeValueId",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({
        message: z.string().default("Attribute value deleted successfully"),
        data: z.unknown(),
      })
      .partial(),
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
]);

export const AttributesApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
