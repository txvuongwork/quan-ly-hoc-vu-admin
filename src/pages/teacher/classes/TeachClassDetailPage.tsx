import {
  useCreateAttendanceSession,
  useGetAttendanceSessions,
  useRemoveAttendanceSession,
} from "@/api/attendanceSessionApi";
import { useGetClassById, useGetStudentsByClassId } from "@/api/classApi";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { DATE_FORMAT, DAYS_OF_WEEK, ROUTES } from "@/constants";
import { EClassStatus } from "@/enums";
import { formatDateWithDateFns } from "@/lib/utils";
import { ClassMapper } from "@/mapper/class";
import { ClassStatusVariantMapper } from "@/pages/admin/classes/mapper";
import { LoadingPage } from "@/pages/LoadingPage";
import { translate } from "@/translate/helpers";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CalendarDays,
  Clock,
  Eye,
  GraduationCap,
  Loader,
  Plus,
  Target,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const getDayLabel = (dayOfWeek: number) => {
  return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label;
};

export const TeachClassDetailPage: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: classResponse, isFetching: isFetchingClass } =
    useGetClassById(id);
  const { data: studentsResponse, isFetching: isFetchingStudents } =
    useGetStudentsByClassId(id);
  const {
    data: attendanceSessionsResponse,
    isFetching: isFetchingAttendanceSessions,
    refetch: refetchAttendanceSessions,
  } = useGetAttendanceSessions(id);
  const { mutateAsync: createAttendanceSession, isPending } =
    useCreateAttendanceSession();

  const {
    mutateAsync: removeAttendanceSession,
    isPending: isRemovingAttendanceSession,
  } = useRemoveAttendanceSession();
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false);
  const [openRemoveConfirmDialog, setOpenRemoveConfirmDialog] =
    useState<string>("");

  const classData = classResponse?.ok ? classResponse.body : null;
  const students = studentsResponse?.ok ? studentsResponse.body : [];
  const attendanceSessions = attendanceSessionsResponse?.ok
    ? attendanceSessionsResponse.body
    : [];

  if (isFetchingClass || isFetchingStudents) {
    return <LoadingPage type="page" />;
  }

  if (!classData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-gray-500 text-lg">Không tìm thấy lớp học</div>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    await createAttendanceSession(classData.id, {
      onSuccess: (response) => {
        if (response.ok) {
          toast.success("Tạo điểm danh thành công");
          refetchAttendanceSessions();
          setOpenConfirmDialog(false);
        } else {
          toast.error(translate(response.error.message));
        }
      },
    });
  };

  const handleRemoveConfirm = async () => {
    await removeAttendanceSession(openRemoveConfirmDialog, {
      onSuccess: (response) => {
        if (response.ok) {
          toast.success("Vô hiệu hóa lượt điểm danh thành công");
          refetchAttendanceSessions();
          setOpenRemoveConfirmDialog("");
        } else {
          toast.error(translate(response.error.message));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.TEACHER.ROOT)}
              >
                <ArrowLeft />
              </Button>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {classData.classCode}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {classData.subject.subjectName} (
                  {classData.subject.subjectCode})
                </p>
              </div>
            </div>
            <Badge
              size="sm"
              variant={ClassStatusVariantMapper[classData.status]}
            >
              {ClassMapper.status[classData.status]}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Giảng viên</p>
                <p className="font-medium">{classData.teacher.fullName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Học kỳ</p>
                <p className="font-medium">{classData.semester.semesterName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Sĩ số</p>
                <p className="font-medium">
                  Tối thiểu: {classData.minStudents} - Tối đa:{" "}
                  {classData.maxStudents}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Số tín chỉ</p>
                <p className="font-medium">{classData.subject.credits}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Thời gian học
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-medium">
                  {formatDateWithDateFns(
                    classData.semester.startDate,
                    DATE_FORMAT.DATE
                  )}{" "}
                  -{" "}
                  {formatDateWithDateFns(
                    classData.semester.endDate,
                    DATE_FORMAT.DATE
                  )}
                </p>
              </div>
            </div>

            {classData.schedules && classData.schedules.length > 0 && (
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 text-gray-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Lịch học</p>
                  <div className="space-y-2">
                    {classData.schedules.map((schedule, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded">
                        <p className="font-medium text-sm">
                          {getDayLabel(schedule.dayOfWeekValue)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tiết {schedule.startPeriod} - {schedule.endPeriod}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Cơ cấu điểm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {classData.processPercent}%
              </p>
              <p className="text-sm text-gray-600">Điểm quá trình</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {classData.midtermPercent}%
              </p>
              <p className="text-sm text-gray-600">Điểm giữa kỳ</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {classData.finalPercent}%
              </p>
              <p className="text-sm text-gray-600">Điểm cuối kỳ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject Description */}
      {classData.subject.description && (
        <Card>
          <CardHeader>
            <CardTitle>Mô tả môn học</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {classData.subject.description}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sinh viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Mã sinh viên</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.studentCode}</TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Không có sinh viên
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách điểm danh</CardTitle>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setOpenConfirmDialog(true)}
              disabled={classData.status !== EClassStatus.IN_PROGRESS}
            >
              <Plus className="h-4 w-4" />
              Thêm điểm danh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetchingAttendanceSessions ? (
            <div className="flex items-center justify-center h-20">
              <Loader size={40} className="animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Mã điểm danh</TableHead>
                  <TableHead>Số sinh viên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceSessions.length > 0 ? (
                  attendanceSessions.map((attendanceSession, index) => (
                    <TableRow key={attendanceSession.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{attendanceSession.attendanceCode}</TableCell>
                      <TableCell>{attendanceSession.attendanceCount}</TableCell>
                      <TableCell>
                        {formatDateWithDateFns(
                          attendanceSession.createdAt,
                          DATE_FORMAT.DATE_TIME
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            attendanceSession.isActive
                              ? "success"
                              : "destructive"
                          }
                        >
                          {attendanceSession.isActive
                            ? "Đang hoạt động"
                            : "Đã kết thúc"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() =>
                              navigate(
                                generatePath(
                                  ROUTES.TEACHER.CLASSES.ATTENDANCE_SESSIONS
                                    .DETAIL,
                                  {
                                    id: classData.id,
                                    sessionId: attendanceSession.id.toString(),
                                  }
                                )
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setOpenRemoveConfirmDialog(
                                attendanceSession.id.toString()
                              )
                            }
                            disabled={
                              !attendanceSession.isActive ||
                              classData.status !== EClassStatus.IN_PROGRESS
                            }
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      Không có điểm danh
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        onConfirm={handleConfirm}
        title="Xác nhận"
        description="Bạn có chắc chắn muốn tạo điểm danh?"
        confirmText="Tạo"
        cancelText="Hủy"
        isLoading={isPending}
      />

      <ConfirmDialog
        isOpen={!!openRemoveConfirmDialog}
        onClose={() => setOpenRemoveConfirmDialog("")}
        onConfirm={handleRemoveConfirm}
        title="Xác nhận"
        description="Xác nhận hiệu lực lượt điểm danh này?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        isLoading={isRemovingAttendanceSession}
        variant="destructive"
      />
    </div>
  );
};
