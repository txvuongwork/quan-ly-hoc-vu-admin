import type { EClassStatus } from "@/enums";
import type { TSemester } from "./semester";
import type { TSubject } from "./subject";
import type { TUser } from "./user";

export type TClassSchedule = {
  id: number;
  dayOfWeek: number;
  startPeriod: number;
  endPeriod: number;
};

export type TClass = {
  id: number;
  classCode: string;
  subject: TSubject;
  semester: TSemester;
  teacher: TUser;
  maxStudents: number;
  minStudents: number;
  startDate: string;
  endDate: string;
  processPercent: number;
  midtermPercent: number;
  finalPercent: number;
  status: EClassStatus;
  createdAt: string;
  schedules: TClassSchedule[];
};
