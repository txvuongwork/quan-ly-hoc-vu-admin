import {
  useCheckingAttendance,
  useGetAttendanceSessions,
} from "@/api/attendanceSessionApi";
import { useParams } from "react-router-dom";
import { LoadingPage } from "../LoadingPage";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { formatDateWithDateFns } from "@/lib/utils";
import { DATE_FORMAT } from "@/constants";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { DiemDanhModal } from "./DiemDanhModal";
import { useState } from "react";
import { toast } from "sonner";
import { translate } from "@/translate/helpers";

export const UserAttendanceSessionsPage: React.FunctionComponent = () => {
  const { classId } = useParams<{ classId: string }>();
  const {
    data: attendanceSessionsResponse,
    isFetching: isFetchingAttendanceSessions,
    refetch: refetchAttendanceSessions,
  } = useGetAttendanceSessions(classId);

  const { mutateAsync: checkingAttendance, isPending: isCheckingAttendance } =
    useCheckingAttendance();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const attendanceSessions = attendanceSessionsResponse?.ok
    ? attendanceSessionsResponse.body
    : [];

  if (isFetchingAttendanceSessions) {
    return <LoadingPage type="page" />;
  }

  const handleConfirm = async (attendanceCode: string) => {
    await checkingAttendance(attendanceCode, {
      onSuccess: (response) => {
        if (response.ok) {
          toast.success("Điểm danh thành công");
          refetchAttendanceSessions();
          setIsOpen(false);
        } else {
          toast.error(translate(response.error.message));
        }
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách điểm danh</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
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
                        attendanceSession.isActive ? "success" : "destructive"
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
                        disabled={!attendanceSession.isActive}
                        onClick={() => setIsOpen(true)}
                      >
                        <Check className="h-4 w-4" />
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
      </CardContent>
      <DiemDanhModal
        isLoading={isCheckingAttendance}
        onConfirm={handleConfirm}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </Card>
  );
};
