import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
