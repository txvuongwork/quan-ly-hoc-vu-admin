import { FormField, TextAreaField } from "@/components/form";
import { Button, LoaderButton } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { createMajorSchema, type CreateMajorSchemaType } from "@/schemas";
import type { TMajor } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface MajorFormProps {
  isLoading: boolean;
  onSubmit: (data: CreateMajorSchemaType) => void;
  major?: TMajor;
}

const getDefaultValue = (major?: TMajor): CreateMajorSchemaType => {
  if (!major)
    return {
      majorName: "",
      majorCode: "",
      description: "",
    };

  return {
    majorName: major.majorName,
    majorCode: major.majorCode,
    description: major.description,
  };
};

export const MajorForm: FunctionComponent<MajorFormProps> = ({
  isLoading,
  onSubmit,
  major,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
  } = useForm<CreateMajorSchemaType>({
    resolver: zodResolver(createMajorSchema),
    mode: "onChange",
    defaultValues: getDefaultValue(major),
  });

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.ADMIN.MAJOR.ROOT)}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-button-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-button-primary" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {major ? "Chỉnh sửa ngành học" : "Tạo ngành học mới"}
            </h1>
          </div>
        </div>

        <form
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6">
            <FormField
              label="Tên ngành học"
              name="majorName"
              type="text"
              placeholder="Ví dụ: Công nghệ thông tin, Điện tử viễn thông..."
              register={register}
              error={errors.majorName}
            />

            <FormField
              label="Mã ngành học"
              name="majorCode"
              type="text"
              placeholder="Ví dụ: CNTT, DTVT, KTPM..."
              register={register}
              error={errors.majorCode}
            />

            <TextAreaField
              label="Mô tả"
              name="description"
              placeholder="Ví dụ: Ngành học về công nghệ thông tin..."
              register={register}
              error={errors.description}
              required={false}
            />

            <Button
              type="submit"
              disabled={isLoading || !isValid || !isDirty}
              variant="primary"
              className="w-full"
            >
              {isLoading ? (
                <LoaderButton title="Đang tạo..." />
              ) : (
                "Tạo ngành học"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
