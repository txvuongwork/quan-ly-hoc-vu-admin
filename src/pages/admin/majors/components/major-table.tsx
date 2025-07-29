import { CommonTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { DATE_FORMAT } from "@/constants";
import { formatDateWithDateFns } from "@/lib/utils";
import type { TMajor } from "@/types";
import { type ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";

interface MajorsTableProps {
  data: TMajor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  onPageChange: (page: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number, majorName: string) => void;
  isLoading?: boolean;
}

export function MajorsTable({
  data,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
  isLoading,
}: MajorsTableProps) {
  const columns: ColumnDef<TMajor>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "majorCode",
        header: "Mã ngành",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("majorCode")}</div>
        ),
      },
      {
        accessorKey: "majorName",
        header: "Tên ngành",
        cell: ({ row }) => (
          <div className="max-w-[250px] truncate">
            {row.getValue("majorName")}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate">
            {row.getValue("description") || "—"}
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
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(major.id, major.majorName)}
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
      emptyMessage="Không có ngành học nào."
      isLoading={isLoading}
    />
  );
}
