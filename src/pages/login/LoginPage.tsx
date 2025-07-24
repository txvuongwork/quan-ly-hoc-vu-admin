import React from "react";
import loginBg from "@/assets/login-bg.png";
import { Button, Input, Label, PasswordInput } from "@/components/ui";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/api/authenticationApi";

export const LoginPage: React.FunctionComponent = () => {
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    await login(data);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <div className="w-4/5 py-24 flex items-center justify-center bg-black/30 rounded-3xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-20 py-10 backdrop-blur-[2px] rounded-3xl space-y-6"
          style={{ background: "rgba(88, 130, 193, 0.28)" }}
        >
          <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>

          <div className="w-64 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium text-sm">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Nhập email"
                className="bg-white font-medium text-sm placeholder:text-input-placeholder"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-[#ffba08] text-sm">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-white font-medium text-sm"
              >
                Mật khẩu
              </Label>
              <PasswordInput
                id="password"
                placeholder="Nhập mật khẩu"
                className="bg-white font-medium text-sm placeholder:text-input-placeholder"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-[#ffba08] text-sm">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="primary"
            disabled={isPending}
          >
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};
