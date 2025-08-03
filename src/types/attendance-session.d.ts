import type { TUser } from "./user";

export type TAttendanceSession = {
  id: number;
  attendanceCode: string;
  isActive: boolean;
  createdAt: string;
  attendanceCount: number;
};

export type TAttendance = {
  id: number;
  attendedAt: string;
  student: TUser;
};
