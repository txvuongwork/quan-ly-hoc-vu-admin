import { ControlledFormField, SelectField } from "@/components/form";
import { Button, LoaderButton, Form } from "@/components/ui";
import { ROUTES } from "@/constants";
import { EClassStatus, ESemesterStatus } from "@/enums";
import { ClassMapper } from "@/mapper/class";
import { createClassSchema, type CreateClassSchemaType } from "@/schemas";
import type { TClass, TSemester, TSubject, TUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useMemo, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface TSelectOption {
  label: string;
  value: string;
}

interface ClassFormProps {
  subjects: TSubject[];
  semesters: TSemester[];
  teachers: TUser[];
  isLoading: boolean;
  onSubmit: (data: CreateClassSchemaType) => void;
  classData?: TClass;
}

const getDefaultValue = (classData?: TClass): CreateClassSchemaType => {
  if (!classData)
    return {
      classCode: "",
      subjectId: "",
      semesterId: "",
      teacherId: "",
      maxStudents: "",
      minStudents: "",
      processPercent: "",
      midtermPercent: "",
      finalPercent: "",
      status: EClassStatus.OPEN,
    };

  return {
    classCode: classData.classCode,
    subjectId: classData.subject.id.toString(),
    semesterId: classData.semester.id.toString(),
    teacherId: classData.teacher.id.toString(),
    maxStudents: classData.maxStudents.toString(),
    minStudents: classData.minStudents.toString(),
    processPercent: classData.processPercent.toString(),
    midtermPercent: classData.midtermPercent.toString(),
    finalPercent: classData.finalPercent.toString(),
    status: classData.status,
  };
};

export const ClassForm: FunctionComponent<ClassFormProps> = ({
  subjects,
  semesters,
  teachers,
  isLoading,
  onSubmit,
  classData,
}) => {
  const navigate = useNavigate();

  const form = useForm<CreateClassSchemaType>({
    resolver: zodResolver(createClassSchema),
    mode: "onChange",
    defaultValues: getDefaultValue(classData),
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    control,
  } = form;

  const subjectOptions = useMemo<TSelectOption[]>(
    () =>
      subjects.map((subject) => ({
        label: `${subject.subjectCode} - ${subject.subjectName}`,
        value: subject.id.toString(),
      })),
    [subjects]
  );

  const semesterOptions = useMemo<TSelectOption[]>(
    () =>
      semesters
        .filter((s) => s.status !== ESemesterStatus.COMPLETED)
        .map((semester) => ({
          label: `${semester.semesterName} - Năm ${semester.year}`,
          value: semester.id.toString(),
        })),
    [semesters]
  );

  const teacherOptions = useMemo<TSelectOption[]>(
    () =>
      teachers.map((teacher) => ({
        label: teacher.fullName,
        value: teacher.id.toString(),
      })),
    [teachers]
  );

  const handleInput = (
    field: "processPercent" | "midtermPercent" | "finalPercent"
  ) => {
    const fields = [
      "processPercent",
      "midtermPercent",
      "finalPercent",
    ] as const;

    setTimeout(() => {
      fields.forEach((f) => {
        if (f !== field) {
          form.trigger(f);
        }
      });
    }, 50);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate(ROUTES.ADMIN.CLASSES?.ROOT || "/admin/classes")
              }
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-button-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-button-primary" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {classData ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
            </h1>
          </div>
        </div>
        <Form {...form}>
          <form
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-6">
              <ControlledFormField
                label="Mã lớp học"
                name="classCode"
                type="text"
                placeholder="Ví dụ: TOAN101_01, LY102_02..."
                control={control}
              />

              <SelectField
                label="Môn học"
                name="subjectId"
                placeholder="Chọn môn học..."
                options={subjectOptions}
                control={control}
                description="Chọn môn học cho lớp"
              />

              <SelectField
                label="Học kỳ"
                name="semesterId"
                placeholder="Chọn học kỳ..."
                options={semesterOptions}
                control={control}
                description="Chọn học kỳ diễn ra"
              />

              <SelectField
                label="Giáo viên"
                name="teacherId"
                placeholder="Chọn giáo viên..."
                options={teacherOptions}
                control={control}
                description="Chọn giáo viên phụ trách"
              />

              <div className="grid grid-cols-2 gap-4">
                <ControlledFormField
                  label="Số học sinh tối thiểu"
                  name="minStudents"
                  type="text"
                  numericOnly={true}
                  placeholder="Ví dụ: 10, 15, 20..."
                  control={control}
                />

                <ControlledFormField
                  label="Số học sinh tối đa"
                  name="maxStudents"
                  type="text"
                  numericOnly={true}
                  placeholder="Ví dụ: 30, 40, 50..."
                  control={control}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <ControlledFormField
                  label="Điểm quá trình (%)"
                  name="processPercent"
                  type="text"
                  numericOnly={true}
                  placeholder="0-100"
                  control={control}
                  inputProps={{
                    onInput: () => handleInput("processPercent"),
                  }}
                />

                <ControlledFormField
                  label="Điểm giữa kỳ (%)"
                  name="midtermPercent"
                  type="text"
                  numericOnly={true}
                  placeholder="0-100"
                  control={control}
                  inputProps={{
                    onInput: () => handleInput("midtermPercent"),
                  }}
                />

                <ControlledFormField
                  label="Điểm cuối kỳ (%)"
                  name="finalPercent"
                  type="text"
                  numericOnly={true}
                  placeholder="0-100"
                  control={control}
                  inputProps={{
                    onInput: () => handleInput("finalPercent"),
                  }}
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>* Tổng phần trăm điểm phải bằng 100%</p>
              </div>

              <SelectField
                label="Trạng thái"
                name="status"
                placeholder="Chọn trạng thái..."
                options={Object.values(EClassStatus).map((status) => ({
                  label: ClassMapper.status[status],
                  value: status,
                }))}
                control={control}
                className={classData ? "" : "hidden"}
              />

              <Button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                variant="primary"
                className="w-full"
              >
                {isLoading ? (
                  <LoaderButton
                    title={classData ? "Đang cập nhật..." : "Đang tạo..."}
                  />
                ) : classData ? (
                  "Cập nhật lớp học"
                ) : (
                  "Tạo lớp học"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
