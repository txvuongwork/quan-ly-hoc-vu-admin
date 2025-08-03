import { useGetAttendanceSessionDetail } from "@/api/attendanceSessionApi";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { DATE_FORMAT, ROUTES } from "@/constants";
import { formatDateWithDateFns } from "@/lib/utils";
import { LoadingPage } from "@/pages/LoadingPage";
import { ArrowLeft } from "lucide-react";
import { generatePath, useNavigate, useParams } from "react-router-dom";

export const AttendanceSessionsPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { sessionId, id } = useParams<{ sessionId: string; id: string }>();
  const {
    data: attendanceSessionDetail,
    isFetching: isFetchingAttendanceSessionDetail,
  } = useGetAttendanceSessionDetail(sessionId);

  if (isFetchingAttendanceSessionDetail) {
    return <LoadingPage type="page" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() =>
            navigate(generatePath(ROUTES.TEACHER.CLASSES.DETAIL, { id }))
          }
        >
          <ArrowLeft />
        </Button>

        <h2 className="text-2xl font-bold">Danh sách điểm danh</h2>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày điểm danh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceSessionDetail?.ok &&
              attendanceSessionDetail.body.length > 0 ? (
                attendanceSessionDetail.body.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>{attendance.id}</TableCell>
                    <TableCell>{attendance.student.fullName}</TableCell>
                    <TableCell>{attendance.student.email}</TableCell>
                    <TableCell>
                      {formatDateWithDateFns(
                        attendance.attendedAt,
                        DATE_FORMAT.DATE_TIME
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
