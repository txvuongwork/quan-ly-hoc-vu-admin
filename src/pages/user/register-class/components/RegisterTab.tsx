import { useGetAvailableForRegister, useRegisterClass } from "@/api/classApi";
import {
  Button,
  ConfirmDialog,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { DAYS_OF_WEEK, QUERY_KEYS } from "@/constants";
import { EClassStatus } from "@/enums";
import { LoadingPage } from "@/pages/LoadingPage";
import { translate } from "@/translate/helpers";
import type { TClass, TSemester } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FunctionComponent } from "react";
import { toast } from "sonner";

const getDayLabel = (dayOfWeek: number) => {
  return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label;
};

type TConfirmDialog =
  | {
      open: true;
      class: TClass;
    }
  | { open: false };

interface RegisterTabProps {
  semesters: TSemester[];
}

export const RegisterTab: FunctionComponent<RegisterTabProps> = ({
  semesters,
}) => {
  const queryClient = useQueryClient();
  const [selectedSemester, setSelectedSemester] = useState<string>(
    semesters.length > 0 ? semesters[0].id.toString() : ""
  );
  const { data: response, isFetching } =
    useGetAvailableForRegister(selectedSemester);
  const classes = response?.ok ? response.body : [];
  const { mutateAsync: registerClass, isPending } = useRegisterClass();

  const [openConfirmDialog, setOpenConfirmDialog] = useState<TConfirmDialog>({
    open: false,
  });

  const handleRegisterClass = (c: TClass) => {
    setOpenConfirmDialog({ open: true, class: c });
  };

  const handleConfirmRegisterClass = async () => {
    if (openConfirmDialog.open) {
      await registerClass(openConfirmDialog.class.id, {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Đăng ký lớp học thành công");
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.classes, "available-for-register"],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.classes, "registered-classes"],
            });
            setOpenConfirmDialog({ open: false });
          } else {
            toast.error(translate(response.error.message));
          }
        },
      });
    }
  };

  const semesterOptions = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.id.toString(),
  }));

  if (isFetching) {
    return <LoadingPage type="page" />;
  }

  return (
    <>
      <div className="space-y-5 mt-3">
        <div className="w-full">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Chọn học kì" />
            </SelectTrigger>
            <SelectContent>
              {semesterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã lớp</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead>Giảng viên</TableHead>
              <TableHead>Học kỳ</TableHead>
              <TableHead>Số lượng đăng ký</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length > 0 ? (
              classes.map((classItem: TClass) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">
                    {classItem.classCode}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{classItem.subject.subjectName}</p>
                      <p className="text-sm text-gray-500">
                        {classItem.subject.subjectCode} •{" "}
                        {classItem.subject.credits} tín chỉ
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{classItem.teacher.fullName}</TableCell>
                  <TableCell>{classItem.semester.semesterName}</TableCell>
                  <TableCell>
                    {classItem.enrolledCount} / {classItem.maxStudents}
                  </TableCell>
                  <TableCell>
                    {classItem.schedules.map((schedule) => (
                      <div key={schedule.id}>
                        {getDayLabel(schedule.dayOfWeekValue)}: Tiết{" "}
                        {schedule.startPeriod} - {schedule.endPeriod}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleRegisterClass(classItem)}
                      disabled={
                        classItem.status !== EClassStatus.OPEN_FOR_REGISTRATION
                      }
                    >
                      Đăng ký
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có lớp học nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        isOpen={openConfirmDialog.open}
        onClose={() => setOpenConfirmDialog({ open: false })}
        onConfirm={handleConfirmRegisterClass}
        title="Xác nhận đăng ký lớp học"
        description={`Bạn có chắc chắn muốn đăng ký lớp học ${
          openConfirmDialog.open
            ? `${openConfirmDialog.class.subject.subjectName} - ${openConfirmDialog.class.classCode}`
            : ""
        }?`}
        confirmText="Đăng ký"
        cancelText="Hủy"
        isLoading={isPending}
      />
    </>
  );
};
