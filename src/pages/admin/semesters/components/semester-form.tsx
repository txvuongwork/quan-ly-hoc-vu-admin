import { DatePickerField, FormField } from "@/components/form";
import { Button, LoaderButton } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { createSemesterSchema, type CreateSemesterSchemaType } from "@/schemas";
import type { TSemester } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useState, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { StatusBadgeText, StatusBadgeVariant } from "./semester-table";
import { Badge } from "@/components/ui/badge";
import { UpdateStatusModal } from "./update-status-modal";
import { useUpdateSemesterStatus } from "@/api/semesterApi";
import { ESemesterStatus } from "@/enums";
import { toast } from "sonner";
import { translate } from "@/translate/helpers";

interface SemesterFormProps {
  isLoading: boolean;
  onSubmit: (data: CreateSemesterSchemaType) => void;
  semester?: TSemester;
  refetch?: () => void;
}

const getDefaultValue = (semester?: TSemester): CreateSemesterSchemaType => {
  if (!semester)
    return {
      semesterName: "",
      semesterCode: "",
      startDate: "",
      endDate: "",
    };

  return {
    semesterName: semester.semesterName,
    semesterCode: semester.semesterCode,
    startDate: semester.startDate,
    endDate: semester.endDate,
  };
};

const NextStatus: Record<ESemesterStatus, ESemesterStatus> = {
  [ESemesterStatus.DRAFT]: ESemesterStatus.REGISTRATION_OPEN,
  [ESemesterStatus.REGISTRATION_OPEN]: ESemesterStatus.REGISTRATION_CLOSED,
  [ESemesterStatus.REGISTRATION_CLOSED]: ESemesterStatus.IN_PROGRESS,
  [ESemesterStatus.IN_PROGRESS]: ESemesterStatus.COMPLETED,
  [ESemesterStatus.COMPLETED]: ESemesterStatus.DRAFT,
};

export const SemesterForm: FunctionComponent<SemesterFormProps> = ({
  isLoading,
  onSubmit,
  semester,
  refetch,
}) => {
  const navigate = useNavigate();

  const { mutateAsync: updateSemesterStatus, isPending: isUpdating } =
    useUpdateSemesterStatus();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { isValid, errors, isDirty },
  } = useForm<CreateSemesterSchemaType>({
    resolver: zodResolver(createSemesterSchema),
    mode: "onChange",
    defaultValues: getDefaultValue(semester),
  });

  const [updateStatusModal, setUpdateStatusModal] = useState<boolean>(false);

  const startDate = watch("startDate");

  const today = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  // Tính minDate cho endDate (4 tháng sau startDate)
  const getMinEndDate = () => {
    if (!startDate) return today;

    const start = new Date(startDate);
    const minEnd = new Date(start);
    minEnd.setMonth(minEnd.getMonth() + 4);

    return minEnd > today ? minEnd : today;
  };

  const handleUpdateStatus = async () => {
    if (!semester) return;
    await updateSemesterStatus(
      {
        id: semester.id,
        status: NextStatus[semester.status],
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật trạng thái thành công");
            setUpdateStatusModal(false);
            if (refetch) {
              refetch();
            }
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(ROUTES.ADMIN.SEMESTERS.ROOT)}
              className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:border-button-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-button-primary" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {semester ? "Chỉnh sửa học kỳ" : "Tạo học kỳ mới"}
            </h1>
          </div>

          {semester && (
            <Button
              disabled={semester.status === ESemesterStatus.COMPLETED}
              variant="primary"
              onClick={() => setUpdateStatusModal(true)}
            >
              Cập nhật trạng thái
            </Button>
          )}
        </div>

        {semester && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <label className="text-base font-medium text-gray-700">
              Trạng thái hiện tại
            </label>
            <div className="flex items-center">
              <Badge size="lg" variant={StatusBadgeVariant[semester.status]}>
                {StatusBadgeText[semester.status]}
              </Badge>
            </div>
          </div>
        )}

        <form
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-6">
            <FormField
              label="Tên học kỳ"
              name="semesterName"
              type="text"
              placeholder="Ví dụ: Học kỳ 1 năm 2024-2025, Học kỳ hè 2024..."
              register={register}
              error={errors.semesterName}
              disabled={semester && semester.status !== ESemesterStatus.DRAFT}
            />

            <FormField
              label="Mã học kỳ"
              name="semesterCode"
              type="text"
              placeholder="Ví dụ: HK1-2024, HKH-2024, 20241..."
              register={register}
              error={errors.semesterCode}
              disabled={semester && semester.status !== ESemesterStatus.DRAFT}
            />

            <DatePickerField
              label="Ngày bắt đầu"
              name="startDate"
              placeholder="Chọn ngày bắt đầu học kỳ"
              control={control}
              error={errors.startDate}
              minDate={today}
              maxDate={oneYearFromNow}
              showYearMonthDropdown={true}
              disabled={semester && semester.status !== ESemesterStatus.DRAFT}
            />

            <DatePickerField
              label="Ngày kết thúc"
              name="endDate"
              placeholder="Chọn ngày kết thúc học kỳ"
              control={control}
              error={errors.endDate}
              minDate={getMinEndDate()}
              maxDate={oneYearFromNow}
              showYearMonthDropdown={true}
              description="Ngày kết thúc phải cách ngày bắt đầu ít nhất 4 tháng"
              disabled={semester && semester.status !== ESemesterStatus.DRAFT}
            />

            <Button
              type="submit"
              disabled={
                isLoading ||
                !isValid ||
                !isDirty ||
                (semester && semester.status !== ESemesterStatus.DRAFT)
              }
              variant="primary"
              className="w-full"
            >
              {isLoading ? (
                <LoaderButton
                  title={semester ? "Đang cập nhật..." : "Đang tạo..."}
                />
              ) : semester ? (
                "Cập nhật học kỳ"
              ) : (
                "Tạo học kỳ"
              )}
            </Button>
          </div>
        </form>
      </div>

      <UpdateStatusModal
        isOpen={updateStatusModal}
        onClose={() => setUpdateStatusModal(false)}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdating}
      />
    </div>
  );
};
