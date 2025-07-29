import { z } from "zod";

export const createClassSchema = z
  .object({
    classCode: z
      .string()
      .trim()
      .min(1, "Mã lớp học là bắt buộc")
      .min(4, "Mã lớp học phải có ít nhất 4 ký tự")
      .max(20, "Mã lớp học không được quá 20 ký tự"),
    subjectId: z.string().min(1, "Môn học là bắt buộc"),
    semesterId: z.string().min(1, "Học kỳ là bắt buộc"),
    teacherId: z.string().min(1, "Giáo viên là bắt buộc"),
    maxStudents: z
      .string()
      .min(1, "Số học sinh tối đa là bắt buộc")
      .regex(/^[1-9]\d*$/, "Số học sinh tối đa phải là số nguyên dương"),
    minStudents: z
      .string()
      .min(1, "Số học sinh tối thiểu là bắt buộc")
      .regex(/^[1-9]\d*$/, "Số học sinh tối thiểu phải là số nguyên dương"),
    processPercent: z
      .string()
      .min(1, "Phần trăm quá trình là bắt buộc")
      .regex(/^(100|[1-9]?\d)$/, "Phần trăm quá trình phải từ 0-100"),
    midtermPercent: z
      .string()
      .min(1, "Phần trăm giữa kỳ là bắt buộc")
      .regex(/^(100|[1-9]?\d)$/, "Phần trăm giữa kỳ phải từ 0-100"),
    finalPercent: z
      .string()
      .min(1, "Phần trăm cuối kỳ là bắt buộc")
      .regex(/^(100|[1-9]?\d)$/, "Phần trăm cuối kỳ phải từ 0-100"),
    status: z.string().optional(),
  })
  .refine(
    (data) => {
      const min = parseInt(data.minStudents);
      const max = parseInt(data.maxStudents);
      return isNaN(min) || isNaN(max) || min <= max;
    },
    {
      message:
        "Số học sinh tối thiểu phải nhỏ hơn hoặc bằng số học sinh tối đa",
      path: ["maxStudents"],
    }
  )
  .refine(
    (data) => {
      const finalPercent = parseInt(data.finalPercent);
      return isNaN(finalPercent) || finalPercent >= 50;
    },
    {
      message: "Điểm cuối kỳ phải lớn hơn hoặc bằng 50%",
      path: ["finalPercent"],
    }
  )
  .refine(
    (data) => {
      const processPercent = parseInt(data.processPercent);
      const midtermPercent = parseInt(data.midtermPercent);
      const finalPercent = parseInt(data.finalPercent);

      // Only validate if all have valid values
      if (
        isNaN(processPercent) ||
        isNaN(midtermPercent) ||
        isNaN(finalPercent)
      ) {
        return true;
      }

      const total = processPercent + midtermPercent + finalPercent;
      return total === 100;
    },
    {
      message: "Tổng phần trăm điểm phải bằng 100%",
      path: ["finalPercent"],
    }
  );

export type CreateClassSchemaType = z.infer<typeof createClassSchema>;
