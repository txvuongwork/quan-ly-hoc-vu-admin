import { z } from "zod";

export const createSubjectSchema = z.object({
  subjectName: z
    .string()
    .trim()
    .min(1, "Tên môn học là bắt buộc")
    .min(2, "Tên môn học phải có ít nhất 2 ký tự")
    .max(100, "Tên môn học không được quá 100 ký tự"),
  subjectCode: z
    .string()
    .trim()
    .min(1, "Mã môn học là bắt buộc")
    .min(4, "Mã môn học phải có ít nhất 4 ký tự")
    .max(10, "Mã môn học không được quá 10 ký tự"),
  description: z.string().trim().optional(),
  majorId: z.string().min(1, "Ngành học là bắt buộc"),
  credits: z
    .string()
    .min(1, "Số tín chỉ là bắt buộc")
    .regex(/^[1-4]$/, "Số tín chỉ phải từ 1-4"),
});

export type CreateSubjectSchemaType = z.infer<typeof createSubjectSchema>;
