import { EClassStatus } from "@/enums";

export const ClassMapper = {
  status: {
    [EClassStatus.OPENED]: "Đang mở",
    [EClassStatus.CLOSED]: "Đã đóng",
    [EClassStatus.CANCELED]: "Đã hủy",
    [EClassStatus.WAITING_REGISTER]: "Chờ đăng ký",
  },
};
