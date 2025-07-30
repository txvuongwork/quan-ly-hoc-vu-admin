import { CommonTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DAYS_OF_WEEK } from "@/constants";
import { EClassStatus } from "@/enums";
import { ClassMapper } from "@/mapper/class";
import type { TClass } from "@/types/class";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useMemo } from "react";

interface ClassesTableProps {
  data: TClass[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  isLoading?: boolean;
}

const getDayLabel = (dayOfWeek: number) => {
  return DAYS_OF_WEEK.find((day) => day.value === dayOfWeek)?.label;
};

const getPeriodLabel = (startPeriod: number, endPeriod: number) => {
  if (startPeriod === endPeriod) {
    return `Tiết ${startPeriod}`;
  }

  return `Tiết ${startPeriod} - ${endPeriod}`;
};

export function ClassesTable({
  data,
  pagination,
  onPageChange,
  onEdit,
  isLoading,
}: ClassesTableProps) {
  const columns: ColumnDef<TClass>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <p className="font-medium">{row.getValue("id")}</p>,
      },
      {
        accessorKey: "classCode",
        header: "Mã lớp",
        cell: ({ row }) => <p>{row.getValue("classCode")}</p>,
      },
      {
        accessorKey: "subjectName",
        header: "Tên môn học",
        cell: ({ row }) => (
          <p className="max-w-[250px] truncate">
            {row.original.subject.subjectName}
          </p>
        ),
      },
      {
        accessorKey: "teacherName",
        header: "Giảng viên",
        cell: ({ row }) => (
          <p className="max-w-[250px] truncate">
            {row.original.teacher.fullName}
          </p>
        ),
      },
      {
        accessorKey: "semesterName",
        header: "Học kì",
        cell: ({ row }) => (
          <p className="max-w-[250px] truncate">
            {row.original.semester.semesterName}
          </p>
        ),
      },
      {
        accessorKey: "schedules",
        header: "Lịch học",
        cell: ({ row }) => (
          <p className="whitespace-pre-line">
            {row.original.schedules
              .map(
                (schedule) =>
                  `${getDayLabel(schedule.dayOfWeek)} - ${getPeriodLabel(
                    schedule.startPeriod,
                    schedule.endPeriod
                  )}`
              )
              .join("\n")}
          </p>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge
            className="px-2 py-1"
            variant={
              row.original.status === EClassStatus.CANCELED
                ? "destructive"
                : row.original.status === EClassStatus.OPEN
                ? "success"
                : "default"
            }
          >
            {ClassMapper.status[row.original.status]}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const major = row.original;

          return (
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(major.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit]
  );

  return (
    <CommonTable
      data={data}
      columns={columns}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyMessage="Không có lớp học nào."
      isLoading={isLoading}
    />
  );
}
