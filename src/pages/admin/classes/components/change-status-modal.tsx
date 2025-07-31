import { SelectField } from "@/components/form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Form,
  LoaderButton,
} from "@/components/ui";
import { EClassStatus } from "@/enums";
import type { TClass } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, type FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChangeStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: number, data: TValidateSchema) => void;
  classData?: TClass;
  isLoading: boolean;
}

const validateSchema = z.object({
  status: z.string().min(1, "Trạng thái là bắt buộc"),
});

export type TValidateSchema = z.infer<typeof validateSchema>;

// Function để lấy label dựa trên status hiện tại và status option
const getStatusLabel = (
  currentStatus: EClassStatus,
  statusOption: EClassStatus
): string => {
  // Trường hợp đặc biệt cho status hiện tại
  if (currentStatus === statusOption) {
    switch (statusOption) {
      case EClassStatus.OPENED:
        return "Đang mở";
      case EClassStatus.CLOSED:
        return "Đã đóng";
      case EClassStatus.CANCELED:
        return "Đã hủy";
      case EClassStatus.WAITING_REGISTER:
        return "Chờ đăng ký";
      default:
        return "";
    }
  }

  // Label cho các option khác dựa trên status hiện tại
  switch (currentStatus) {
    case EClassStatus.OPENED:
      switch (statusOption) {
        case EClassStatus.CLOSED:
          return "Đóng";
        case EClassStatus.CANCELED:
          return "Hủy";
        case EClassStatus.WAITING_REGISTER:
          return "Chờ đăng ký";
        default:
          return "";
      }
    case EClassStatus.CLOSED:
      switch (statusOption) {
        case EClassStatus.OPENED:
          return "Mở";
        case EClassStatus.CANCELED:
          return "Hủy";
        case EClassStatus.WAITING_REGISTER:
          return "Chờ đăng ký";
        default:
          return "";
      }
    case EClassStatus.CANCELED:
      switch (statusOption) {
        case EClassStatus.OPENED:
          return "Mở";
        case EClassStatus.CLOSED:
          return "Đóng";
        case EClassStatus.WAITING_REGISTER:
          return "Chờ đăng ký";
        default:
          return "";
      }
    case EClassStatus.WAITING_REGISTER:
      switch (statusOption) {
        case EClassStatus.OPENED:
          return "Mở";
        case EClassStatus.CLOSED:
          return "Đóng";
        case EClassStatus.CANCELED:
          return "Hủy";
        default:
          return "";
      }
    default:
      return "";
  }
};

export const ChangeStatusModal: FunctionComponent<ChangeStatusModalProps> = ({
  open,
  onClose,
  onSubmit,
  classData,
  isLoading,
}) => {
  const form = useForm<TValidateSchema>({
    resolver: zodResolver(validateSchema),
    mode: "all",
    defaultValues: {
      status: EClassStatus.OPENED,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = form;

  const onSubmitForm = (data: TValidateSchema) => {
    if (classData) {
      onSubmit(classData.id, data);
    }
  };

  const options = useMemo(() => {
    if (!classData) return [];

    if (classData.status === EClassStatus.WAITING_REGISTER) {
      return [
        EClassStatus.OPENED,
        EClassStatus.CANCELED,
        EClassStatus.WAITING_REGISTER,
      ].map((status) => ({
        label: getStatusLabel(classData.status, status),
        value: status,
      }));
    }

    if (classData.status === EClassStatus.OPENED) {
      return [EClassStatus.OPENED, EClassStatus.CLOSED].map((status) => ({
        label: getStatusLabel(classData.status, status),
        value: status,
      }));
    }

    return Object.values(EClassStatus).map((status) => ({
      label: getStatusLabel(classData.status, status),
      value: status,
    }));
  }, [classData]);

  useEffect(() => {
    if (open && classData) {
      form.reset({
        status: classData.status,
      });
    }
  }, [open, classData, form]);

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <SelectField
              name="status"
              label="Trạng thái"
              options={options}
              control={form.control}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Hủy
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!isValid || !isDirty || isLoading}
              >
                {isLoading ? <LoaderButton title="Đang lưu..." /> : "Lưu"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
