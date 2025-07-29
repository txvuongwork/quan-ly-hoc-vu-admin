import { z } from "zod";

export const createMajorSchema = z.object({
  majorName: z
    .string()
    .trim()
    .min(1, "Tên ngành học là bắt buộc")
    .min(2, "Tên ngành học phải có ít nhất 2 ký tự")
    .max(100, "Tên ngành học không được quá 100 ký tự"),
  majorCode: z
    .string()
    .trim()
    .min(1, "Mã ngành học là bắt buộc")
    .min(2, "Mã ngành học phải có ít nhất 2 ký tự")
    .max(10, "Mã ngành học không được quá 10 ký tự"),
  description: z.string().trim().optional(),
});

export type CreateMajorSchemaType = z.infer<typeof createMajorSchema>;
