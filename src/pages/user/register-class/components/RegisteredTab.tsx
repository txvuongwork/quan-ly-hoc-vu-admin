import { useCancelClass, useGetRegisteredClasses } from "@/api/classApi";
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
import { QUERY_KEYS } from "@/constants";
import { EClassStatus } from "@/enums";
import { LoadingPage } from "@/pages/LoadingPage";
import { translate } from "@/translate/helpers";
import type { TClass, TSemester } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FunctionComponent } from "react";
import { toast } from "sonner";

const getDayOfWeekLabel = (dayOfWeek: number) => {
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  return days[dayOfWeek - 1];
};

type TConfirmDialog =
  | {
      open: true;
      class: TClass;
    }
  | { open: false };

interface RegisteredTabProps {
  semesters: TSemester[];
}

export const RegisteredTab: FunctionComponent<RegisteredTabProps> = ({
  semesters,
}) => {
  const queryClient = useQueryClient();
  const [selectedSemester, setSelectedSemester] = useState<string>(
    semesters.length > 0 ? semesters[0].id.toString() : ""
  );
  const { data: response, isFetching } =
    useGetRegisteredClasses(selectedSemester);
  const classes = response?.ok ? response.body : [];
  const { mutateAsync: cancelClass, isPending } = useCancelClass();

  const [openConfirmDialog, setOpenConfirmDialog] = useState<TConfirmDialog>({
    open: false,
  });

  const handleCancelClass = (c: TClass) => {
    setOpenConfirmDialog({ open: true, class: c });
  };

  const semesterOptions = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.id.toString(),
  }));

  const handleConfirmCancelClass = async () => {
    if (openConfirmDialog.open) {
      await cancelClass(openConfirmDialog.class.id, {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Hủy đăng ký lớp học thành công");
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.classes, "available-for-register"],
            });
            queryClient.invalidateQueries({
              queryKey: [QUERY_KEYS.classes, "registered-classes"],
            });
          } else {
            toast.error(translate(response.error.message));
          }
        },
      });
    }
  };

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
                        {getDayOfWeekLabel(schedule.dayOfWeekValue)}: Tiết{" "}
                        {schedule.startPeriod} - {schedule.endPeriod}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleCancelClass(classItem)}
                      disabled={
                        classItem.status !== EClassStatus.OPEN_FOR_REGISTRATION
                      }
                    >
                      Hủy đăng ký
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <div className="min-h-20 flex flex-col items-center justify-center">
                    <p>Bạn chưa đăng ký lớp học nào</p>
                    <p>Vui lòng đăng ký lớp học tại trang đăng ký lớp học</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ConfirmDialog
        isOpen={openConfirmDialog.open}
        onClose={() => setOpenConfirmDialog({ open: false })}
        onConfirm={handleConfirmCancelClass}
        title="Xác nhận đăng ký lớp học"
        description={`Bạn có chắc chắn muốn đăng ký lớp học ${
          openConfirmDialog.open
            ? `${openConfirmDialog.class.subject.subjectName} - ${openConfirmDialog.class.classCode}`
            : ""
        }?`}
        confirmText="Hủy đăng ký"
        cancelText="Hủy"
        isLoading={isPending}
        variant="destructive"
      />
    </>
  );
};
