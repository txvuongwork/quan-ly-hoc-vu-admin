import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { createSubjectSchema, type CreateSubjectSchemaType } from "@/schemas";
import { ROUTES } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export const CreateSubjectPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm<CreateSubjectSchemaType>({
    resolver: zodResolver(createSubjectSchema),
    mode: "onChange",
    defaultValues: {
      subjectName: "",
      subjectCode: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateSubjectSchemaType) => {
    try {
      // Simulate API call
      console.log("Creating subject:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Here you would call your API
      // await createSubject(data);

      alert(`Tạo môn học "${data.subjectName}" thành công!`);
      reset();
    } catch (error) {
      console.error("Error creating subject:", error);
      alert("Có lỗi xảy ra khi tạo môn học");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.ADMIN.SUBJECTS.ROOT)}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Tạo môn học mới
            </h1>
          </div>
        </div>

        <form
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6">
            <FormField
              label="Tên môn học"
              name="subjectName"
              type="text"
              placeholder="Ví dụ: Toán học, Vật lý, Hóa học..."
              register={register}
              error={errors.subjectName}
            />

            <FormField
              label="Mã môn học"
              name="subjectCode"
              type="text"
              placeholder="Ví dụ: TOAN, LY, HOA..."
              register={register}
              error={errors.subjectCode}
            />

            <FormField
              label="Mô tả"
              name="description"
              type="text"
              placeholder="Ví dụ: Môn học về toán học..."
              register={register}
              error={errors.description}
              required={false}
            />

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              variant="primary"
              className="w-full"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tạo...</span>
                </div>
              ) : (
                "Tạo môn học"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
