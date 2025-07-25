import { useGetSubjects } from "@/api/subjectApi";
import { SubjectsTable } from "@/components/feature/subject";
import { Button, Card, CardContent, ErrorState } from "@/components/ui";
import { ROUTES } from "@/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const pageSize = 10;

export function SubjectsPage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data: response, isLoading } = useGetSubjects({
    page: currentPage - 1,
    size: pageSize,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    console.log("Edit subject:", id);
    // Navigate to edit subject page
  };

  const handleDelete = (id: number) => {
    console.log("Delete subject:", id);
    // Show confirmation dialog and delete
  };

  const handleAddSubject = () => {
    navigate(ROUTES.ADMIN.SUBJECTS.CREATE);
  };

  if (response && !response.ok) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý môn học</h1>
          <Button variant="primary" onClick={handleAddSubject}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm môn học
          </Button>
        </div>

        <ErrorState
          variant="server"
          title="Lỗi tải dữ liệu môn học"
          message="Không thể tải danh sách môn học. Vui lòng thử lại."
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
        <h1 className="text-3xl font-bold tracking-tight">Quản lý môn học</h1>
        <Button variant="primary" onClick={handleAddSubject}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm môn học
        </Button>
      </div>

      <Card>
        <CardContent>
          <SubjectsTable
            data={tableData}
            pagination={paginationInfo}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
