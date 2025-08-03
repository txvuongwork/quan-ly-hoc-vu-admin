import { useGetClassesbyTeacher } from "@/api/classApi";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Badge } from "@/components/ui/badge";
import { DAYS_OF_WEEK, ROUTES } from "@/constants";
import { useCommonData } from "@/hooks/useCommonData";
import { ClassMapper } from "@/mapper/class";
import { ClassStatusVariantMapper } from "@/pages/admin/classes/mapper";
import { LoadingPage } from "@/pages/LoadingPage";
import type { TClass, TSemester } from "@/types";
import { Eye } from "lucide-react";
import React, { useState, type FunctionComponent } from "react";
import { generatePath, useNavigate } from "react-router-dom";

interface ContentProps {
  semesters: TSemester[];
}
const getDayLabel = (dayOfWeek: number) => {
  return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label;
};

const Content: React.FunctionComponent<ContentProps> = ({ semesters }) => {
  const navigate = useNavigate();

  const [selectedSemester, setSelectedSemester] = useState<string>(
    semesters.length > 0 ? semesters[0].id.toString() : ""
  );
  const { data: response, isLoading } =
    useGetClassesbyTeacher(selectedSemester);
  const classes = response?.ok ? response.body : [];

  const semesterOptions = semesters.map((semester) => ({
    label: semester.semesterName,
    value: semester.id.toString(),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-bold">Quản lý lớp học</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
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

        <div className="w-full ">
          {isLoading ? (
            <LoadingPage type="page" className="h-[30vh]" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Môn học</TableHead>
                  <TableHead>Trạng thái</TableHead>
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
                      <TableCell>
                        <Badge
                          size="sm"
                          variant={ClassStatusVariantMapper[classItem.status]}
                        >
                          {ClassMapper.status[classItem.status]}
                        </Badge>
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
                          variant="primary"
                          onClick={() =>
                            navigate(
                              generatePath(ROUTES.TEACHER.CLASSES.DETAIL, {
                                id: classItem.id,
                              })
                            )
                          }
                        >
                          <Eye />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Không có lịch học
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const TeachClassesPage: FunctionComponent = () => {
  const {
    semesters: { data: semesters },
    isAnyFetching,
  } = useCommonData(["semesters"]);

  if (isAnyFetching) {
    return <LoadingPage type="page" />;
  }

  return (
    <Content
      semesters={semesters.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      )}
    />
  );
};
