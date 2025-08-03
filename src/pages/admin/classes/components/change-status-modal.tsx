import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LoaderButton,
} from "@/components/ui";
import type { TClass } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { type FunctionComponent } from "react";

interface ChangeStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  classData?: TClass;
  isLoading: boolean;
  type?: "open" | "cancel";
}

export const ChangeStatusModal: FunctionComponent<ChangeStatusModalProps> = ({
  open,
  onClose,
  type,
  isLoading,
  onSubmit,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn {type === "open" ? "mở" : "hủy"} lớp học này?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={onSubmit}>
            {isLoading ? <LoaderButton title="Đang lưu..." /> : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
