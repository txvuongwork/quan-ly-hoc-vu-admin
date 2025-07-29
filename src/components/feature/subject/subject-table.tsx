import { CommonTable } from "@/components/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DATE_FORMAT } from "@/constants";
import { formatDateWithDateFns } from "@/lib/utils";
import type { TSubject } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";

interface SubjectsTableProps {
  data: TSubject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, subjectName: string) => void;
  isLoading?: boolean;
}

export function SubjectsTable({
  data,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  isLoading,
}: SubjectsTableProps) {
  const columns: ColumnDef<TSubject>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "subjectCode",
        header: "Mã môn học",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("subjectCode")}</div>
        ),
      },
      {
        accessorKey: "subjectName",
        header: "Tên môn học",
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.getValue("subjectName")}
          </div>
        ),
      },
      {
        accessorKey: "credits",
        header: "Tín chỉ",
        cell: ({ row }) => (
          <Badge variant="secondary">{row.getValue("credits")} TC</Badge>
        ),
      },
      {
        accessorKey: "major.majorName",
        header: "Ngành học",
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate">
            {row.original.major.majorName}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDateWithDateFns(
              row.getValue("createdAt"),
              DATE_FORMAT.DATE_TIME
            )}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => {
          const subject = row.original;

          return (
            <div className="flex items-center space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onEdit(subject.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(subject.id, subject.subjectName)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <CommonTable
      data={data}
      columns={columns}
      pagination={pagination}
      onPageChange={onPageChange}
      emptyMessage="Không có môn học nào."
      isLoading={isLoading}
    />
  );
}
