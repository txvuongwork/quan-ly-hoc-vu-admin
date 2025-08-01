import { useDeleteMajor, useGetMajors } from "@/api/majorApi";
import { MajorsTable } from "./components";
import {
  Button,
  Card,
  CardContent,
  ConfirmDialog,
  ErrorState,
} from "@/components/ui";
import { ROUTES } from "@/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { translate } from "@/translate/helpers";

const pageSize = 10;

export function MajorsPage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    majorId: number | null;
    majorName: string;
  }>({
    isOpen: false,
    majorId: null,
    majorName: "",
  });

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetMajors({
    page: currentPage - 1,
    size: pageSize,
  });
  const { mutateAsync: deleteMajor, isPending: isDeleting } = useDeleteMajor();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    navigate(generatePath(ROUTES.ADMIN.MAJOR.EDIT, { id: id.toString() }));
  };

  const handleDelete = (id: number, majorName: string) => {
    setDeleteModal({
      isOpen: true,
      majorId: id,
      majorName,
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteModal.majorId) {
      await deleteMajor(deleteModal.majorId, {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Xóa ngành học thành công");
          } else {
            toast.error(translate(response.error.message));
          }
          handleCloseDeleteModal();
          refetch();
        },
      });
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      majorId: null,
      majorName: "",
    });
  };

  const handleAddMajor = () => {
    navigate(ROUTES.ADMIN.MAJOR.CREATE);
  };

  if (response && !response.ok) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý ngành học
          </h1>
          <Button variant="primary" onClick={handleAddMajor}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm ngành học
          </Button>
        </div>

        <ErrorState
          variant="server"
          title="Lỗi tải dữ liệu ngành học"
          message="Không thể tải danh sách ngành học. Vui lòng thử lại."
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
        <h1 className="text-3xl font-bold tracking-tight">Quản lý ngành học</h1>
        <Button variant="primary" onClick={handleAddMajor}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngành học
        </Button>
      </div>

      <Card>
        <CardContent>
          <MajorsTable
            data={tableData}
            pagination={paginationInfo}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xóa ngành học"
        description={`Bạn có chắc chắn muốn xóa ngành học "${deleteModal.majorName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
