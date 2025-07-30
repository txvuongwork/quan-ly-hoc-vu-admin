import { useGetClasses } from "@/api/classApi";
import { Button, Card, CardContent, ErrorState } from "@/components/ui";
import { ROUTES } from "@/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { ClassesTable } from "./components";

const pageSize = 10;

export function ClassesPage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: response, isLoading } = useGetClasses({
    page: currentPage - 1,
    size: pageSize,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    navigate(generatePath(ROUTES.ADMIN.CLASSES.EDIT, { id: id.toString() }));
  };

  const handleAddMajor = () => {
    navigate(ROUTES.ADMIN.CLASSES.CREATE);
  };

  if (response && !response.ok) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lớp học</h1>
          <Button variant="primary" onClick={handleAddMajor}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm lớp học
          </Button>
        </div>

        <ErrorState
          variant="server"
          title="Lỗi tải dữ liệu lớp học"
          message="Không thể tải danh sách lớp học. Vui lòng thử lại."
          errorCode="500"
          retryText="Tải lại dữ liệu"
        />
      </div>
    );
  }

  const tableData = response?.ok ? response?.body.items : [];
  const paginationInfo = response?.ok
    ? {
        currentPage: response.body.currentPage + 1,
        totalPages: response.body.totalPages,
        totalItems: response.body.totalElements,
        pageSize: response.body.pageSize,
      }
    : {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        pageSize: pageSize,
      };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý lớp học</h1>
        <Button variant="primary" onClick={handleAddMajor}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm lớp học
        </Button>
      </div>

      <Card>
        <CardContent>
          <ClassesTable
            data={tableData}
            pagination={paginationInfo}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
