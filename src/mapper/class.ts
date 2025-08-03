import { EClassStatus } from "@/enums";

export const ClassMapper = {
  status: {
    [EClassStatus.DRAFT]: "Bản nháp",
    [EClassStatus.OPEN_FOR_REGISTRATION]: "Đang mở đăng ký",
    [EClassStatus.CONFIRMED]: "Đã xác nhận",
    [EClassStatus.CANCELLED]: "Đã hủy",
    [EClassStatus.IN_PROGRESS]: "Đang diễn ra",
    [EClassStatus.COMPLETED]: "Đã kết thúc",
  },
};
