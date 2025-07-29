import { FormField, SelectField, TextAreaField } from "@/components/form";
import { Button, LoaderButton } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { createSubjectSchema, type CreateSubjectSchemaType } from "@/schemas";
import type { TMajor, TSelectOption, TSubject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useMemo, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface SubjectFormProps {
  majors: TMajor[];
  isLoading: boolean;
  onSubmit: (data: CreateSubjectSchemaType) => void;
  subject?: TSubject;
}

const getDefaultValue = (subject?: TSubject): CreateSubjectSchemaType => {
  if (!subject)
    return {
      subjectName: "",
      subjectCode: "",
      description: "",
      credits: "1",
      majorId: "",
    };

  return {
    subjectName: subject.subjectName,
    subjectCode: subject.subjectCode,
    description: subject.description,
    credits: subject.credits.toString(),
    majorId: subject.major.id.toString(),
  };
};

export const SubjectForm: FunctionComponent<SubjectFormProps> = ({
  majors,
  isLoading,
  onSubmit,
  subject,
}) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors, isDirty },
    control,
  } = useForm<CreateSubjectSchemaType>({
    resolver: zodResolver(createSubjectSchema),
    mode: "onChange",
    defaultValues: getDefaultValue(subject),
  });

  const majorOptions = useMemo<TSelectOption[]>(
    () =>
      majors.map((major) => ({
        label: major.majorName,
        value: major.id.toString(),
      })),
    [majors]
  );

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.ADMIN.SUBJECTS.ROOT)}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-button-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-button-primary" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {subject ? "Chỉnh sửa môn học" : "Tạo môn học mới"}
            </h1>
          </div>
        </div>

        <form
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6">
            <SelectField
              label="Ngành học"
              name="majorId"
              placeholder="Chọn ngành học..."
              options={majorOptions}
              control={control}
              error={errors.majorId}
              description="Chọn ngành học của bạn"
            />

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
              label="Tín chỉ"
              name="credits"
              type="text"
              numericOnly={true}
              placeholder="Ví dụ: 1, 2, 3, ..."
              register={register}
              error={errors.credits}
            />

            <TextAreaField
              label="Mô tả"
              name="description"
              placeholder="Ví dụ: Môn học về toán học..."
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
              {isLoading ? <LoaderButton title="Đang tạo..." /> : "Tạo môn học"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
