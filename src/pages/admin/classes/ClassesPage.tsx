import { useGetClasses, useUpdateStatus } from "@/api/classApi";
import { Button, Card, CardContent, ErrorState } from "@/components/ui";
import { ROUTES } from "@/constants";
import { Plus } from "lucide-react";
import { useState } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import {
  ChangeStatusModal,
  ClassesTable,
  type TValidateSchema,
} from "./components";
import type { TClass } from "@/types";
import { translate } from "@/translate/helpers";
import { toast } from "sonner";

const pageSize = 10;

type TChangeStatusModal =
  | {
      open: true;
      classData: TClass;
    }
  | {
      open: false;
    };

export function ClassesPage() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [changeStatusModal, setChangeStatusModal] =
    useState<TChangeStatusModal>({
      open: false,
    });

  const {
    data: response,
    isFetching,
    refetch,
  } = useGetClasses({
    page: currentPage - 1,
    size: pageSize,
  });

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateStatus();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (id: number) => {
    navigate(generatePath(ROUTES.ADMIN.CLASSES.EDIT, { id: id.toString() }));
  };

  const handleAddMajor = () => {
    navigate(ROUTES.ADMIN.CLASSES.CREATE);
  };

  const handleOpenChangeStatusModal = (classData: TClass) => {
    setChangeStatusModal({ open: true, classData });
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

  const onSubmit = async (id: number, data: TValidateSchema) => {
    await updateStatus(
      {
        id,
        data: { status: data.status },
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật trạng thái thành công");
            refetch();
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
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
            onOpenChangeStatusModal={handleOpenChangeStatusModal}
            isLoading={isFetching}
          />
        </CardContent>
      </Card>

      <ChangeStatusModal
        open={changeStatusModal.open}
        onClose={() => setChangeStatusModal({ open: false })}
        onSubmit={onSubmit}
        classData={
          changeStatusModal.open ? changeStatusModal.classData : undefined
        }
        isLoading={isUpdatingStatus}
      />
    </div>
  );
}
