import { CommonTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BadgeVariantKeys } from "@/components/ui/variants";
import { DATE_FORMAT } from "@/constants";
import { ESemesterStatus } from "@/enums";
import { formatDateWithDateFns } from "@/lib/utils";
import type { TSemester } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useMemo } from "react";

interface SemestersTableProps {
  data: TSemester[];
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

export const StatusBadgeVariant: Record<ESemesterStatus, BadgeVariantKeys> = {
  [ESemesterStatus.DRAFT]: "secondary",
  [ESemesterStatus.REGISTRATION_OPEN]: "success",
  [ESemesterStatus.REGISTRATION_CLOSED]: "warning",
  [ESemesterStatus.IN_PROGRESS]: "default",
  [ESemesterStatus.COMPLETED]: "secondary",
} as const;

export const StatusBadgeText: Record<ESemesterStatus, string> = {
  [ESemesterStatus.DRAFT]: "Bản nháp",
  [ESemesterStatus.REGISTRATION_OPEN]: "Đang mở đăng ký",
  [ESemesterStatus.REGISTRATION_CLOSED]: "Đã đóng đăng ký",
  [ESemesterStatus.IN_PROGRESS]: "Đang diễn ra",
  [ESemesterStatus.COMPLETED]: "Đã kết thúc",
} as const;

export function SemestersTable({
  data,
  pagination,
  onPageChange,
  onEdit,
  isLoading,
}: SemestersTableProps) {
  const columns: ColumnDef<TSemester>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "semesterCode",
        header: "Mã học kỳ",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("semesterCode")}</div>
        ),
      },
      {
        accessorKey: "semesterName",
        header: "Tên học kỳ",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.getValue("semesterName")}
          </div>
        ),
      },
      {
        accessorKey: "startDate",
        header: "Ngày bắt đầu",
        cell: ({ row }) => (
          <div className="text-sm">
            {formatDateWithDateFns(row.getValue("startDate"), DATE_FORMAT.DATE)}
          </div>
        ),
      },
      {
        accessorKey: "endDate",
        header: "Ngày kết thúc",
        cell: ({ row }) => (
          <div className="text-sm">
            {formatDateWithDateFns(row.getValue("endDate"), DATE_FORMAT.DATE)}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge variant={StatusBadgeVariant[status]}>
              {StatusBadgeText[status]}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const semester = row.original;

          return (
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(semester.id)}
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
      emptyMessage="Không có học kỳ nào."
      isLoading={isLoading}
    />
  );
}
