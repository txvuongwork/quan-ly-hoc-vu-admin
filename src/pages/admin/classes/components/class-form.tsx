import { useUpdateStatus } from "@/api/classApi";
import { ControlledFormField, SelectField } from "@/components/form";
import { Button, Form, LoaderButton } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/constants";
import { EClassStatus, ESemesterStatus } from "@/enums";
import { cn } from "@/lib/utils";
import { ClassMapper } from "@/mapper/class";
import { createClassSchema, type CreateClassSchemaType } from "@/schemas";
import { translate } from "@/translate/helpers";
import type {
  TClass,
  TClassSchedule,
  TSemester,
  TSubject,
  TUser,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useMemo, useState, type FunctionComponent } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClassStatusVariantMapper } from "../mapper";
import { ChangeStatusModal } from "./change-status-modal";

// Constants for schedules
const DAYS_OF_WEEK = [
  { value: "2", label: "Thứ 2" },
  { value: "3", label: "Thứ 3" },
  { value: "4", label: "Thứ 4" },
  { value: "5", label: "Thứ 5" },
  { value: "6", label: "Thứ 6" },
  { value: "7", label: "Thứ 7" },
];

const PERIODS = [
  { value: "1", label: "Tiết 1 (7:00 - 7:50)" },
  { value: "2", label: "Tiết 2 (8:00 - 8:50)" },
  { value: "3", label: "Tiết 3 (9:00 - 9:50)" },
  { value: "4", label: "Tiết 4 (10:00 - 10:50)" },
  { value: "5", label: "Tiết 5 (11:00 - 11:50)" },
  { value: "6", label: "Tiết 6 (13:00 - 13:50)" },
  { value: "7", label: "Tiết 7 (14:00 - 14:50)" },
  { value: "8", label: "Tiết 8 (15:00 - 15:50)" },
  { value: "9", label: "Tiết 9 (16:00 - 16:50)" },
  { value: "10", label: "Tiết 10 (17:00 - 17:50)" },
];

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
  classData?: TClass & { schedules?: TClassSchedule[] };
  refetch: () => void;
}

const getDefaultValue = (
  classData?: TClass & { schedules?: TClassSchedule[] }
): CreateClassSchemaType => {
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
      schedules: [
        {
          dayOfWeek: 2,
          startPeriod: 1,
          endPeriod: 1,
        },
      ],
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
    schedules:
      classData.schedules && classData.schedules.length > 0
        ? classData.schedules.map((schedule) => ({
            dayOfWeek: schedule.dayOfWeekValue,
            startPeriod: schedule.startPeriod,
            endPeriod: schedule.endPeriod,
          }))
        : [
            {
              dayOfWeek: 2,
              startPeriod: 1,
              endPeriod: 1,
            },
          ],
  };
};

type TChangeStatusModal =
  | {
      open: true;
      type: "open" | "cancel";
    }
  | {
      open: false;
    };

export const ClassForm: FunctionComponent<ClassFormProps> = ({
  subjects,
  semesters,
  teachers,
  isLoading,
  onSubmit,
  classData,
  refetch,
}) => {
  const navigate = useNavigate();

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateStatus();

  const [changeStatusModal, setChangeStatusModal] =
    useState<TChangeStatusModal>({
      open: false,
    });

  const form = useForm<CreateClassSchemaType>({
    resolver: zodResolver(createClassSchema),
    mode: "onChange",
    defaultValues: getDefaultValue(classData),
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty, errors },
    control,
    watch,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  // Watch schedules to get real-time values for filtering available days
  const watchedSchedules = watch("schedules");

  const handleOpenChangeStatusModal = (type: "open" | "cancel") => {
    setChangeStatusModal({ open: true, type });
  };

  const onSubmitStatus = async () => {
    if (!classData || !changeStatusModal.open) return;

    await updateStatus(
      {
        id: classData.id,
        data: {
          status:
            changeStatusModal.type === "open"
              ? EClassStatus.CONFIRMED
              : EClassStatus.CANCELLED,
        },
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
  };

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
        .filter((s) =>
          [ESemesterStatus.DRAFT, ESemesterStatus.REGISTRATION_OPEN].includes(
            s.status
          )
        )
        .map((semester) => ({
          label: `${semester.semesterName}`,
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

  const isDisableEdit = useMemo(() => {
    if (!classData) return false;

    return [
      EClassStatus.OPEN_FOR_REGISTRATION,
      EClassStatus.CANCELLED,
      EClassStatus.COMPLETED,
      EClassStatus.CONFIRMED,
      EClassStatus.IN_PROGRESS,
    ].includes(classData.status);
  }, [classData]);

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

  const handleScheduleChange = (
    index: number,
    field: "dayOfWeek" | "startPeriod" | "endPeriod"
  ) => {
    setTimeout(() => {
      if (field === "dayOfWeek") {
        // When day changes, validate the entire schedules array for conflicts
        form.trigger("schedules");
      } else {
        // When period changes, validate both startPeriod and endPeriod of the same schedule
        form.trigger(`schedules.${index}.startPeriod`);
        form.trigger(`schedules.${index}.endPeriod`);
        // Also trigger validation for the entire schedules array to check conflicts
        form.trigger("schedules");
      }
    }, 50);
  };

  // Get available days for a specific schedule index
  const getAvailableDays = (currentIndex: number) => {
    if (!watchedSchedules) return DAYS_OF_WEEK;

    // Get all selected days from other schedules
    const selectedDays = watchedSchedules
      .map((schedule, index) =>
        index !== currentIndex ? schedule?.dayOfWeek : null
      )
      .filter((day): day is number => day !== null && day !== undefined);

    // Filter out selected days from available options
    return DAYS_OF_WEEK.filter(
      (day) => !selectedDays.includes(parseInt(day.value))
    );
  };

  const addSchedule = () => {
    // Find first available day
    const usedDays =
      watchedSchedules?.map((s) => s?.dayOfWeek).filter(Boolean) || [];
    const availableDay = DAYS_OF_WEEK.find(
      (day) => !usedDays.includes(parseInt(day.value))
    );

    append({
      dayOfWeek: availableDay ? parseInt(availableDay.value) : 1,
      startPeriod: 1,
      endPeriod: 1,
    });
  };

  const removeSchedule = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() =>
                navigate(ROUTES.ADMIN.CLASSES?.ROOT || "/admin/classes")
              }
              className="cursor-pointer flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 hover:border-button-primary hover:bg-blue-50 transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-button-primary" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {classData ? "Chỉnh sửa lớp học" : "Tạo lớp học mới"}
            </h1>
          </div>

          <div
            className={cn("flex items-center space-x-4", {
              hidden:
                !classData ||
                classData.status !== EClassStatus.OPEN_FOR_REGISTRATION,
            })}
          >
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenChangeStatusModal("open")}
            >
              Mở lớp
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleOpenChangeStatusModal("cancel")}
            >
              Hủy lớp
            </Button>
          </div>
        </div>

        {classData && (
          <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <label className="text-base font-medium text-gray-700">
              Trạng thái hiện tại
            </label>
            <div className="flex items-center">
              <Badge
                size="lg"
                variant={ClassStatusVariantMapper[classData.status]}
              >
                {ClassMapper.status[classData.status]}
              </Badge>
            </div>
          </div>
        )}

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
                disabled={isDisableEdit}
              />

              <SelectField
                label="Môn học"
                name="subjectId"
                placeholder="Chọn môn học..."
                options={subjectOptions}
                control={control}
                description="Chọn môn học cho lớp"
                disabled={isDisableEdit}
              />

              <SelectField
                label="Học kỳ"
                name="semesterId"
                placeholder="Chọn học kỳ..."
                options={semesterOptions}
                control={control}
                description="Chọn học kỳ diễn ra"
                disabled={isDisableEdit}
              />

              <SelectField
                label="Giáo viên"
                name="teacherId"
                placeholder="Chọn giáo viên..."
                options={teacherOptions}
                control={control}
                description="Chọn giáo viên phụ trách"
                disabled={isDisableEdit}
              />

              <div className="grid grid-cols-2 gap-4">
                <ControlledFormField
                  label="Số học sinh tối thiểu"
                  name="minStudents"
                  type="text"
                  numericOnly={true}
                  placeholder="Ví dụ: 10, 15, 20..."
                  control={control}
                  disabled={isDisableEdit}
                />

                <ControlledFormField
                  label="Số học sinh tối đa"
                  name="maxStudents"
                  type="text"
                  numericOnly={true}
                  placeholder="Ví dụ: 30, 40, 50..."
                  control={control}
                  disabled={isDisableEdit}
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
                  disabled={isDisableEdit}
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
                  disabled={isDisableEdit}
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
                  disabled={isDisableEdit}
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>* Tổng phần trăm điểm phải bằng 100%</p>
              </div>

              {/* Schedules Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-900">
                    Lịch học <span className="text-red-500">*</span>
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSchedule}
                    disabled={fields.length >= 7} // Max 7 days in a week
                    className={cn("flex items-center space-x-2", {
                      hidden: isDisableEdit,
                    })}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm lịch học</span>
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="space-y-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Ngày <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`schedules.${index}.dayOfWeek` as const}
                              control={control}
                              render={({ field }) => {
                                const availableDays = getAvailableDays(index);
                                return (
                                  <Select
                                    value={field.value?.toString() || ""}
                                    onValueChange={(value) => {
                                      field.onChange(parseInt(value));
                                      handleScheduleChange(index, "dayOfWeek");
                                    }}
                                    disabled={isDisableEdit}
                                  >
                                    <SelectTrigger className="transition-all duration-200 w-full">
                                      <SelectValue placeholder="Chọn ngày..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableDays.length > 0 ? (
                                        availableDays.map((option) => (
                                          <SelectItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </SelectItem>
                                        ))
                                      ) : (
                                        <SelectItem
                                          value="no-available"
                                          disabled
                                        >
                                          Không còn ngày nào khả dụng
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                );
                              }}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Tiết bắt đầu{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`schedules.${index}.startPeriod` as const}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value?.toString() || ""}
                                  onValueChange={(value) => {
                                    field.onChange(parseInt(value));
                                    handleScheduleChange(index, "startPeriod");
                                  }}
                                  disabled={isDisableEdit}
                                >
                                  <SelectTrigger className="transition-all duration-200 w-full">
                                    <SelectValue placeholder="Chọn tiết..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PERIODS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                              Tiết kết thúc{" "}
                              <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                              name={`schedules.${index}.endPeriod` as const}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value?.toString() || ""}
                                  onValueChange={(value) => {
                                    field.onChange(parseInt(value));
                                    handleScheduleChange(index, "endPeriod");
                                  }}
                                  disabled={isDisableEdit}
                                >
                                  <SelectTrigger className="transition-all duration-200 w-full">
                                    <SelectValue placeholder="Chọn tiết..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {PERIODS.map((option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </div>

                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSchedule(index)}
                            className={cn(
                              "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200",
                              {
                                hidden: isDisableEdit,
                              }
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      {/* Error message span across 3 columns */}
                      {(() => {
                        const dayError = errors.schedules?.[index]?.dayOfWeek;
                        const startError =
                          errors.schedules?.[index]?.startPeriod;
                        const endError = errors.schedules?.[index]?.endPeriod;
                        const errorMessage =
                          dayError?.message ||
                          startError?.message ||
                          endError?.message;

                        if (errorMessage) {
                          return (
                            <div className="flex items-center space-x-2 text-sm col-span-3">
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <span className="text-red-600">
                                {errorMessage}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  ))}
                </div>

                {errors.schedules && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.schedules.message || "Lịch học không hợp lệ"}
                  </p>
                )}

                <div className="mt-2 text-sm text-gray-600">
                  <p>* Lịch học không được trùng nhau</p>
                  <p>* Tiết bắt đầu phải nhỏ hơn hoặc bằng tiết kết thúc</p>
                  <p>* Mỗi ngày trong tuần chỉ có thể có một lịch học</p>
                  {fields.length >= 7 && (
                    <p className="text-amber-600">
                      * Đã chọn đủ 7 ngày trong tuần
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                variant="primary"
                className={cn("w-full", {
                  hidden: isDisableEdit,
                })}
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

      <ChangeStatusModal
        open={changeStatusModal.open}
        onClose={() => setChangeStatusModal({ open: false })}
        onSubmit={onSubmitStatus}
        classData={classData}
        isLoading={isUpdatingStatus}
        type={changeStatusModal.open ? changeStatusModal.type : undefined}
      />
    </div>
  );
};
