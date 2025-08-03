import { z } from "zod";

export const createSemesterSchema = z
  .object({
    semesterCode: z
      .string()
      .trim()
      .min(1, "Mã học kỳ là bắt buộc")
      .min(2, "Mã học kỳ phải có ít nhất 2 ký tự")
      .max(20, "Mã học kỳ không được quá 20 ký tự"),
    semesterName: z
      .string()
      .trim()
      .min(1, "Tên học kỳ là bắt buộc")
      .min(2, "Tên học kỳ phải có ít nhất 2 ký tự")
      .max(100, "Tên học kỳ không được quá 100 ký tự"),
    startDate: z.string().min(1, "Ngày bắt đầu là bắt buộc"),
    endDate: z.string().min(1, "Ngày kết thúc là bắt buộc"),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate > startDate;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      const minEndDate = new Date(startDate);
      minEndDate.setMonth(minEndDate.getMonth() + 3);

      return endDate >= minEndDate;
    },
    {
      message: "Ngày kết thúc phải cách ngày bắt đầu ít nhất 4 tháng",
      path: ["endDate"],
    }
  );

export type CreateSemesterSchemaType = z.infer<typeof createSemesterSchema>;
