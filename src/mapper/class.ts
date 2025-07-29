import { EClassStatus } from "@/enums";

export const ClassMapper = {
  status: {
    [EClassStatus.OPEN]: "Mở",
    [EClassStatus.CLOSED]: "Đóng",
    [EClassStatus.CANCELED]: "Hủy",
  },
};
