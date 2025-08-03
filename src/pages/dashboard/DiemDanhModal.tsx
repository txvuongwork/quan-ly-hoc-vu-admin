import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Input,
  LoaderButton,
} from "@/components/ui";
import { useState } from "react";

interface DiemDanhModalProps {
  isLoading: boolean;
  onConfirm: (code: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DiemDanhModal: React.FunctionComponent<DiemDanhModalProps> = ({
  isLoading,
  onConfirm,
  isOpen,
  onClose,
}) => {
  const [code, setCode] = useState<string>("");

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertDialogTitle className="text-lg font-semibold">
              Điểm danh
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-gray-600">
            <Input
              placeholder="Nhập mã điểm danh"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex space-x-2 justify-end">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Hủy
            </Button>
          </AlertDialogCancel>
          <Button
            variant="primary"
            onClick={() => onConfirm(code)}
            disabled={isLoading || !code}
          >
            {isLoading ? <LoaderButton title="Đang xử lý..." /> : "Xác nhận"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
