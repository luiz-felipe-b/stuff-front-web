import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const postReports_Body = z.object({
  authorId: z.string().uuid().optional(),
  organizationId: z.string().uuid(),
  title: z.string().min(1),
  key: z.string().min(1),
});
const patchReportsId_Body = z
  .object({ title: z.string().min(1), fileUrl: z.string().url() })
  .partial();

export const schemas = {
  postReports_Body,
  patchReportsId_Body,
};

const endpoints = makeApi([
  {
    method: "post",
    path: "/reports/",
    alias: "postReports",
    description: `O cliente deve enviar apenas a chave S3 do arquivo (key), não a URL. O backend monta a URL final.`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: postReports_Body,
      },
    ],
    response: z.object({
      message: z.string(),
      data: z.union([
        z.union([
          z.object({
            id: z.string().uuid(),
            authorId: z.string().uuid().nullable(),
            organizationId: z.string().uuid(),
            title: z.string(),
            file_url: z.string().url().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          }),
          z.array(
            z.object({
              id: z.string().uuid(),
              authorId: z.string().uuid().nullable(),
              organizationId: z.string().uuid(),
              title: z.string(),
              file_url: z.string().url().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          ),
        ]),
        z.unknown(),
      ]),
    }),
  },
  {
    method: "get",
    path: "/reports/",
    alias: "getReports",
    requestFormat: "json",
    response: z.object({
      message: z.string(),
      data: z.array(
        z.object({
          id: z.string().uuid(),
          authorId: z.string().uuid().nullable(),
          organizationId: z.string().uuid(),
          title: z.string(),
          file_url: z.string().url().nullable(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      ),
    }),
  },
  {
    method: "get",
    path: "/reports/:id",
    alias: "getReportsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string(),
      data: z.union([
        z.union([
          z.object({
            id: z.string().uuid(),
            authorId: z.string().uuid().nullable(),
            organizationId: z.string().uuid(),
            title: z.string(),
            file_url: z.string().url().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          }),
          z.array(
            z.object({
              id: z.string().uuid(),
              authorId: z.string().uuid().nullable(),
              organizationId: z.string().uuid(),
              title: z.string(),
              file_url: z.string().url().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          ),
        ]),
        z.unknown(),
      ]),
    }),
  },
  {
    method: "patch",
    path: "/reports/:id",
    alias: "patchReportsId",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: patchReportsId_Body,
      },
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({
      message: z.string(),
      data: z.union([
        z.union([
          z.object({
            id: z.string().uuid(),
            authorId: z.string().uuid().nullable(),
            organizationId: z.string().uuid(),
            title: z.string(),
            file_url: z.string().url().nullable(),
            createdAt: z.string(),
            updatedAt: z.string(),
          }),
          z.array(
            z.object({
              id: z.string().uuid(),
              authorId: z.string().uuid().nullable(),
              organizationId: z.string().uuid(),
              title: z.string(),
              file_url: z.string().url().nullable(),
              createdAt: z.string(),
              updatedAt: z.string(),
            })
          ),
        ]),
        z.unknown(),
      ]),
    }),
  },
  {
    method: "delete",
    path: "/reports/:id",
    alias: "deleteReportsId",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ message: z.string(), data: z.unknown().nullable() }),
  },
  {
    method: "post",
    path: "/reports/presigned-url",
    alias: "postReportspresignedUrl",
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({ filename: z.string().min(1) }),
      },
    ],
    response: z.object({
      message: z.string(),
      data: z.object({ url: z.string().url(), key: z.string() }),
    }),
    errors: [
      {
        status: 400,
        description: `Default Response`,
        schema: z.object({ message: z.string(), data: z.unknown().nullable() }),
      },
    ],
  },
]);

export const ReportsApi = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
